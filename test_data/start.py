from getData import get_products_data as products
from getData import get_category_data as categories
from getData import get_user_data as users
from sendData import stream_data, send
import requests
import random


def send_user_data():
    # sends data at an irregular interval.
    try:
        data = users()
        for j in stream_data(data):
            send(url='http://127.0.0.1:5000/users/register', data=j)

    except Exception as e:
        print(e)


def send_category_data():
    try:
        data = categories()
        for i, j in stream_data(data):
            send('http://127.0.0.1:5000/categories/add', data=j)

    except Exception as e:
        pass


def send_product_data():
    try:
        data = products()
        for j in stream_data(data):
            send('http://127.0.0.1:5000/products/add', data=j)

    except Exception as e:
        pass


if __name__ == "__main__":
    send_user_data()
    send_category_data()
    send_product_data()
