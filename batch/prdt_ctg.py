from pyspark.sql import functions as func
from pyspark.sql import SparkSession

from batch.init import initMongoBatch


spark = initMongoBatch()

prod_data = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test")\
    .option("collection", "Products")\
    .load().createOrReplaceTempView("products")

carts = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test")\
    .option("collection", "categories")\
    .load().createOrReplaceTempView("categories")


c_data = spark.sql("select * from categories;")\
    .withColumnRenamed("description", "category_desc")
p_data = spark.sql("select * from products;")

c_p_join = p_data["category.oid"] == c_data["_id.oid"]
p_c_data = p_data.join(c_data, c_p_join)

# *  Get the data schema for the columns
# p_c_data.printSchema()
# p_data.printSchema()
# c_data.printSchema()

# * Aggregating the joined df based on the category
p_c_agg = p_c_data.groupBy("categoryNumber").agg(
    func.mean("price").alias("avg_price"),
    func.sum("price").alias("total_price"),
    func.count("productNumber").alias("count_prds"),
    func.sum("quantity").alias("count_quantity")
)

categoryAnalysis = p_c_agg.join(
    c_data,
    c_data["categoryNumber"] == p_c_data["categoryNumber"]
)
categoryAnalysis = categoryAnalysis.drop("_id", "__v")

categoryAnalysis.printSchema()

categoryAnalysis.write\
    .format("com.mongodb.spark.sql.DefaultSource")\
    .mode("overwrite")\
    .option("database", "test_analysis")\
    .option("collection", "categoryProducts")\
    .save()
