from pyspark.sql import functions as func
from init import getData, initMongoBatch

spark = initMongoBatch()


def user_Data():
    getData(db="test", collection="user")
    u_data = spark.sql(
        """SELECT
        _id,
        firstName,
        lastName,
        email,
        cast(phoneNumber as int) as phoneNumber,
        registered.when as registration_date
        FROM user"""
    )
    return u_data


def order_data():
    getData(db="test", collection="Orders")
    o_data = spark.sql(
        """
        select
            _id,
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
    return o_data


def category_data():
    getData(db="test", collection="categories")
    c_data = spark.sql(
        "select * from categories;"
    ).withColumnRenamed(
        "description", "category_desc"
    )
    return c_data


def products_data():
    getData(db="test", collection="Products")
    p_data = spark.sql(
        "select * from Products;"
    )
    return p_data
