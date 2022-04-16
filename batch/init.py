from pyspark.sql import SparkSession
from pyspark.sql import functions as func
import json
import pyspark.sql as sql


def initMongoBatch(db: str = "test", dw: str = "test_analysis"):
    spark = SparkSession.builder\
        .master('local')\
        .config("spark.mongodb.input.uri", f"mongodb://127.0.0.1/{db}")\
        .config("spark.mongodb.output.uri", f"mongodb://127.0.0.1/{dw}")\
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")
    return spark


def getData(db: str, collection: str):
    spark = initMongoBatch()
    data = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
        .option("database", db)\
        .option("collection", collection)\
        .load().createOrReplaceTempView(collection)

    return data


def writeData(df, dw, collection):
    df.write\
        .format("com.mongodb.spark.sql.DefaultSource")\
        .option("database", dw)\
        .option("collection", collection)\
        .mode("overwrite")\
        .save()
    return True
