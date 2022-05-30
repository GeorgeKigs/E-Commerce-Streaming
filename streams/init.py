from distutils.command.config import config
from pyspark.sql import SparkSession
from pyspark.sql import functions as func
from pyspark.streaming import StreamingContext
import json
import pyspark.sql as sql


def initSparkStreaming():
    spark = SparkSession.builder.\
        appName("SparkStreaming").\
        config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector:10.0.0').\
        getOrCreate()

    return spark


# def initMongoStreams(db: str = "test", dw: str = "test_analysis"):
#     spark = SparkSession.builder\
#         .master('local')\
#         .config("spark.mongodb.input.uri", f"mongodb://127.0.0.1/{db}")\
#         .config("spark.mongodb.output.uri", f"mongodb://127.0.0.1/{dw}")\
#         .getOrCreate()

#     spark.sparkContext.setLogLevel("WARN")
#     return spark


def getData():
    # db: str, collection: str
    spark = initSparkStreaming()
    query = spark.readStream.format("mongodb")\
        .option("spark.mongodb.output.uri", f"mongodb://127.0.0.1/test")\
        .option("database", "test")\
        .option("collection", "user")\
        .option('spark.mongodb.change.stream.publish.full.document.only', 'true') \
        .option("forceDeleteTempCheckpointLocation", "true") \
        .load()
    query = query.select(
        ["_id", "firstName", "lastName", "email", "phoneNumber"]
    )
    Query = query.writeStream\
        .format("mongod")\
        .option("checkpointLocation", "/tmp/pyspark/")\
        .option("forceDeleteTempCheckpointLocation", "true")\
        .trigger(continuous="10 seconds")\
        .outputMode("update")
    Query.start()
    #


def writeData(df, dw, collection):
    df.writeStream\
        .format("com.mongodb.spark.sql.DefaultSource")\
        .option("database", dw)\
        .option("collection", collection)\
        .mode("overwrite")\
        .save()
    return True


getData()
