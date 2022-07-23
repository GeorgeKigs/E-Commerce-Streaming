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
from misc import read_env, read_kafka_config, configs

kafka_configs = read_kafka_config()
env = read_env()
configs = configs()
# host, port = configs["kafka_url"].split(":")
host, port = "localhost:9092".split(":")
print(host, port)


spark = SparkSession.builder.\
    appName("SparkTraining").\
    config('spark.jars.packages', 'org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0').\
    config('master', configs["spark_master"]).\
    config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1").\
    config("spark.mongodb.output.uri", f"{configs['mongo_write']}").\
    config("spark.mongodb.write.connection.uri", f"{configs['mongo_write']}").\
    getOrCreate()

# print(host, port)
# # read the data

df = spark \
    .read \
    .format("kafka") \
    .option("kafka.bootstrap.servers", f"{host}:{port}") \
    .option("subscribe", configs["kafka_topic"]) \
    .load()


df = df.selectExpr(
    'CAST(key as STRING) key', 'CAST(value AS STRING) value')

# {"user": user, "productId": product, "rating": rating}
dataSchema = StructType([
    StructField("user", StringType(), True),
    StructField("productID", StringType(), True),
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
    "itemCol": "productID-index"
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

recomendations = cvModel.recommendForAllUsers(5)
recomendations = recomendations.join(
    transformed,
    transformed["user-index"] == recomendations["user-index"]
)

# rmse = eval.evaluate(pred)
# print("rmse: ", rmse)

# cvModel.write().overwrite().save("./temp/model")
recomendations.write\
    .format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", env["MONGODB_DB"])\
    .option("collection", env["MONGODB_COL"])\
    .mode("overwrite")\
    .save()

transformed.select("productID", "productID-index").distinct().write\
    .format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", env["MONGODB_DB"])\
    .option("collection", "transformed-data")\
    .mode("overwrite")\
    .save()
