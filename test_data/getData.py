import pandas as pd
import mysql.connector as my_conn
import dotenv
from pyparsing import col

def configurationFiles():
    file = dotenv.DotEnv('.env')
    return file.data


def get_connection():
    files = configurationFiles()
    print(files)
    try:
        conn = my_conn.connect(**files)
        return conn
    except my_conn.errors.Error as conn_error:
        print("connection failed")
        return
    except Exception as error:
        print("Connection not established due to",error)
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
        
        data['password'] = data['addressLine1']
        data["email"] = data["customerName"].str.replace(" ","")
        data["email"]=data["email"].str.lower() + "@gmail.com"
        data.rename(columns={
            "contactFirstName":"firstName",
            "contactLastName":"lastName",
            "phone":"phoneNumber"
        },inplace=True)
        data["phoneNumber"] = data["phoneNumber"].str.replace(r'\D','',regex=True)
        data["phoneNumber"] = data["phoneNumber"].astype('int')

        data = data[['firstName','lastName','password','email','phoneNumber']]
        return data.to_dict("records")
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
