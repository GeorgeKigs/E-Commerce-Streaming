from math import prod
from pyspark.sql import functions as func


from init import writeData
from getFiles import category_data, order_data, products_data


def order_category():
    prod_data = products_data().withColumnRenamed(
        "_id", "product_id"
    )
    cat_data = category_data().withColumnRenamed(
        "_id", "category_id"
    )
    o_data = order_data()

    join_statement = prod_data["category.oid"] == cat_data["category_id.oid"]
    pr_ct = prod_data.join(
        cat_data, join_statement, "inner"
    )

    o_data = o_data.join(
        pr_ct,
        pr_ct["product_id.oid"] == o_data["products.product.oid"]
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

    orderCatAnalysis.printSchema()
    writeData(df=orderCatAnalysis, dw="test_analysis",
              collection="orderCategory")


if __name__ == "__main__":
    order_category()
