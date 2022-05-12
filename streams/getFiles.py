from pyspark.sql import functions as func
from init import initMongoStreams, getData, writeData


spark = initMongoStreams()


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
    writeData(df=o_data, dw="test_analysis", collection="streamOrders")
    return o_data


if __name__ == "__main__":
    query = order_data()
    query.start()
