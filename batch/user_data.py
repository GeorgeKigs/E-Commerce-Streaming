from pyspark.sql import functions as func

from getFiles import order_data, user_Data
from init import writeData


def order_agg():
    o_data = order_data().withColumnRenamed(
        "_id", "order_id"
    )
    o_data.printSchema()

    o_agg = o_data.groupby("order_id.oid").agg(
        func.sum(func.col("products.price") *
                 func.col("products.quantity")).alias("total_price"),
        func.sum("products.quantity").alias("total_quanity"),
        func.max(func.col("products.price") *
                 func.col("products.quantity")).alias("max_price"),
        func.max(func.col("products.quantity")).alias("max_quantity"),
        func.max(func.col("products.price")).alias("max_price_prod"),
        func.avg(func.col("products.price") *
                 func.col("products.quantity")).alias("average_price")
    )

    o_data = o_data.drop("products").dropDuplicates()
    o_data = o_data.join(o_agg, o_data["order_id.oid"] == o_agg["oid"])

    o_data.printSchema()
    writeData(df=o_data, dw="test_analysis", collection="orderAggr")
    return o_data


def user_order():
    o_data = order_agg()
    u_data = user_Data().withColumnRenamed(
        "_id", "user_id"
    )

    join_stmt = u_data["user_id.oid"] == o_data["user.oid"]
    o_u_data = o_data.join(u_data, join_stmt)

    o_u_data = o_u_data.groupby("user.oid").agg(
        func.count("orderNumber").alias("total_orders"),
        func.sum("total_price").alias("total_user_price"),
        func.max("total_price").alias("top_price"),
        func.max("max_quantity").alias("top_qunatity")
    )
    o_u_data = o_u_data.join(u_data, u_data["user_id.oid"] == o_u_data["oid"])
    o_u_data.printSchema()
    writeData(o_u_data, dw="test_analysis", collection="orderUser")


if __name__ == "__main__":
    user_order()
