from unicodedata import category
import pandas as pd
import mysql.connector as my_conn
import dotenv
import numpy as np
import warnings




def configurationFiles():
    warnings.filterwarnings("ignore")
    file = dotenv.DotEnv('.env')
    return file.data


def get_connection():
    files = configurationFiles()
    # print(files)
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

        data = data[['firstName','lastName','password',
        'email','phoneNumber','customerNumber']]
        return data.to_dict("records")
    except Exception as error:
        print("No data read due to ",error)
        return

def get_products_data():
    try:
        query = "select * from products"
        data = get_data(query)
        data["discount"] = np.random.randint(0,70,len(data))
        data.rename(columns={
            "productCode":"productNumber",
            "productDescription":"description",
            "quantityInStock":"quantity",
            "buyPrice":"price"
        },inplace=True)

        data = data[["productNumber","description","productName",
        "price","quantity","productLine","discount"]] 

        return data.to_dict("records")
    except Exception as error:
        print("No data read due to ",error)
        return

def get_category_data():
    try:
        query = "select * from productlines"
        data = get_data(query)

        data["categoryNumber"] = data.index
        data.rename(columns={
            "productLine":"categoryName",
            "textDescription":"description"
        },inplace=True)

        data = data[["categoryNumber","categoryName","description"]]
        return data.to_dict("records")

    except Exception as error:
        print("No data read due to ",error)
        return


def get_order_data():
    try:
        query = "select * from orders;"
        data = get_data(query)
        data.rename(columns={
            'status':"stage",
        },inplace=True)
        ord_data = data[['orderNumber','stage','customerNumber']].to_dict('records')

        for record in ord_data:
            ord_query = f'select * from orderdetails where orderNumber = {record["orderNumber"]};'
            ord_dets = get_data(ord_query)
            
            ord_dets.rename(columns={
                "quantityOrdered":"quantity",
                "priceEach":"price"
            },inplace=True)
            ord_dets = ord_dets[['productCode','quantity','price']].to_dict("records")
            record['products'] = ord_dets

        return ord_data
    except Exception as error:
        print("No data read due to ",error)
        return
