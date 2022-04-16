from pyspark.sql import functions as func
from getFiles import category_data, products_data
from init import writeData


def product_category_anlysis():
    # get the data from the database
    c_data = category_data()
    p_data = products_data()

    c_p_join = p_data["category.oid"] == c_data["_id.oid"]
    p_c_data = p_data.join(c_data, c_p_join)

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

    # categoryAnalysis.printSchema()
    writeData(categoryAnalysis, dw="test_analysis",
              collection="categoryProducts")


if __name__ == "__main__":
    product_category_anlysis()
