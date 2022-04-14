from pyspark.sql import functions as func
from pyspark.sql import SparkSession


spark = SparkSession.builder\
    .master("local")\
    .config("spark.mongodb.input.uri", "mongodb://127.0.0.1/test")\
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1/test_analysis")\
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

prod_data = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test")\
    .option("collection", "Products")\
    .load().createOrReplaceTempView("products")

carts = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test")\
    .option("collection", "categories")\
    .load().createOrReplaceTempView("categories")

order_data = spark.read.format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test")\
    .option("collection", 'Orders')\
    .load().createOrReplaceTempView("order_data")

pr_ct = spark.sql(
    """
    Select 
        products.productName,
        categories.categoryName,
        categories.categoryNumber,
        products.createdAt,
        products._id.oid as product_id,
        categories._id.oid as category_id
    from products
    inner join categories
    on products.category.oid = categories._id.oid
    """
)

# pr_ct.printSchema()
o_data = spark.sql(
    """
    select
        orderNumber,
        stage,
        cartId,
        complete,
        user,
        products
    from order_data
    """
).withColumn(
    "products",
    func.explode(func.col("products"))
)

o_data = o_data.join(
    pr_ct,
    pr_ct["product_id"] == o_data["products.product.oid"]
)

orderCatAnalysis = o_data\
    .groupby(*["category_id", "orderNumber"])\
    .agg(
        func.count("orderNumber").alias("totalOrders"),
        func.sum("products.quantity").alias("totalQuantity"),
        func.sum("products.price").alias("totalPrice"),
        func.count("user.oid").alias("totalUsers"),
        func.count(
            func.when(func.col("complete"), func.col("complete") == False)
        ).alias("not_complete"),
        func.count(
            func.when(func.col("complete"), func.col("complete") == True)
        ).alias("completed")

    )

o_data.printSchema()
# o_data.show(3)
orderCatAnalysis.write\
    .format("com.mongodb.spark.sql.DefaultSource")\
    .option("database", "test_analysis")\
    .option("collection", "orderCategory")\
    .mode("overwrite")\
    .save()
