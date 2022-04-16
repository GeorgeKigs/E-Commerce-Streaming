from pyspark.sql import functions as func
from pyspark.sql import SparkSession

from batch.init import getData, initMongoBatch, writeData
from batch.user_data import order_Data


spark = initMongoBatch()
prod_data = getData(db="test", collection="Products")
carts = getData(db="test", collection="categories")
order_data = order_Data()


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
    from Orders
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
writeData(orderCatAnalysis, "test_analysis", "orderCategory")
