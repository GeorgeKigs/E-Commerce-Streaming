from pyspark.sql import SparkSession
import pyspark.sql as sql
from pyspark.sql.types import StructField, StringType, IntegerType, MapType, StructType
from pyspark.sql import functions as func
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS
from pyspark.ml import Pipeline
from pyspark.ml.feature import StringIndexer
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
import json
import random
from misc import read_env, read_kafka_config

kafka_configs = read_kafka_config()
configs = read_env()
# config("spark.mongodb.input.uri", f"mongodb://127.0.0.1/{db}")\
host, port = kafka_configs["bootstrap.servers"].split(":")

spark = SparkSession.builder.\
    appName("SparkTraining").\
    config('spark.jars.packages', 'org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0').\
    config("spark.mongodb.output.uri", f"{configs['MONGODB_URL']}{configs['MONGODB_DB']}.{configs['MONGODB_COL']}")\
    .config(
        "spark.mongodb.write.connection.uri",
        f"{configs['MONGODB_URL']}{configs['MONGODB_DB']}.{configs['MONGODB_COL']}")\
    .getOrCreate()
# master("spark://spark:7077").\

# print(host, port)
# # read the data
# df = spark \
#     .read \
#     .format("kafka") \
#     .option("kafka.bootstrap.servers", f"{host}:{port}") \
#     .option("subscribe", configs["KAFKA_MAIN_TOPIC"]) \
#     .option("failOnDataLoss", False)\
#     .load()

df = spark.createDataFrame(
    [('Clicks', '{"user": "user", "productId": "product", "rating": 5}'),
     ('Clicks', '{"user": "user1", "productId": "product1", "rating": 5}'),
     ('Clicks', '{"user": "user2", "productId": "product2", "rating": 3}'),
     ('Clicks', '{"user": "user3", "productId": "product3", "rating": 4}'),
     ('Clicks', '{"user": "user", "productId": "product3", "rating": 2}'),
     ('Clicks', '{"user": "user2", "productId": "product", "rating": 5}'),
     ('Clicks', '{"user": "user1", "productId": "product2", "rating": 2}'),
     ('Clicks', '{"user": "user3", "productId": "product1", "rating": 5}'),
     ('Clicks', '{"user": "user2", "productId": "product2", "rating": 2}')],
    ['key', "value"])

df = df.selectExpr(
    'CAST(key as STRING) key', 'CAST(value AS STRING) value')

# {"user": user, "productId": product, "rating": rating}
dataSchema = StructType([
    StructField("user", StringType(), True),
    StructField("productId", StringType(), True),
    StructField("rating", IntegerType(), True)
])

values = df.withColumn(
    "value",
    func.from_json(
        df.value,
        MapType(StringType(), StringType())
    ))


values = df.withColumn(
    "value",
    func.from_json(func.col("value"), schema=dataSchema)
)


values = values.select(func.col("key"), func.col(
    "value.*")).drop(func.col("key"))

# values.printSchema()
# values.show(truncate=False)

indexer = [
    StringIndexer(inputCol=col, outputCol=f"{col}-index")
    for col in list(set(values.columns)-set("rating"))]
pipeline = Pipeline(stages=indexer)
transformed = pipeline.fit(values).transform(values)

# transformed.printSchema()
# transformed.show(5)

# # split the dataset to train and test
train, test = transformed.randomSplit([0.8, 0.2], seed=random.randint(5, 100))
# train.printSchema()
# train.show(truncate=False)
# test.printSchema()
# test.show(truncate=False)
data = {
    "maxIter": 10,
    "rank": 4,
    "regParam": 0.1,
    "userCol": "user-index",
    "ratingCol": "rating",
    "itemCol": "productId-index"
}

#

als = ALS(maxIter=data["maxIter"],
          rank=data["rank"],
          regParam=data["regParam"],
          userCol=data["userCol"],
          ratingCol=data["ratingCol"],
          itemCol=data["itemCol"],
          nonnegative=True)

params = ParamGridBuilder()\
    .addGrid(als.maxIter, [4, 10])\
    .addGrid(als.regParam, [0.1, 0.01, 0.001])\
    .addGrid(als.rank, range(4, 10))\
    .build()

eval = RegressionEvaluator(
    metricName="rmse",
    labelCol=data["ratingCol"],
    predictionCol="prediction")

crossVal = CrossValidator(estimator=als,
                          estimatorParamMaps=params,
                          evaluator=eval,
                          numFolds=2)

trial = crossVal.fit(train)


cvModel = trial.bestModel

pred = cvModel.transform(test)

recomendations = cvModel.recommendForAllUsers(3)


# rmse = eval.evaluate(pred)
# print("rmse: ", rmse)

# cvModel.write().overwrite().save("./temp/model")
recomendations.write\
    .format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "predictions")\
    .option("collection", "Users")\
    .mode("overwrite")\
    .save()
