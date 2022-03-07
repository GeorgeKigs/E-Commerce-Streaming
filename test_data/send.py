import pandas as pd
import mysql.connector as my_conn
import dotenv

def configurationFiles():
    file = dotenv.DotEnv('.env')
    return file.data


def get_connection():
    files = configurationFiles()
    try:
        conn = my_conn.connect(files)
        return conn
    except my_conn.errors.Error as conn_error:
        print("connection failed")
        return
    except Exception as error:
        print("Connection failed due to",error)
        return


def get_data(query:str):
    try:
        connection = get_connection()
        data = pd.read_sql(query,connection)
        return data
    except Exception as error:
        print("Connection failed due to",error)
        return


def get_user_data():
    try:
        query = "select * from customers"
        data = get_data(query)
        return data
    except Exception as error:
        print("No data read due to ",error)
        return


def get_products_data():
    try:
        query = "select * from products"
        data = get_data(query)
        return data
    except Exception as error:
        print("No data read due to ",error)
        return


def get_order_data():
    try:
        query = "select * from orders"
        data = get_data(query)
        return data
    except Exception as error:
        print("No data read due to ",error)
        return
