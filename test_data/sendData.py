from urllib.error import HTTPError
from getData import get_user_data as users
from getData import get_order_data as orders
from getData import get_products_data as products
from getData import get_category_data as categories
import requests
import pandas as pd
import random
import json
import time


def stream_data(data):
    for i in data:
        yield i


def send_user_data():
    # sends data at an irregular interval.
    try:
        data = users()
        for i, j in enumerate(stream_data(data)):
            num_seconds = random.randint(0, 60)
            dataSent = requests.post(
                'http://127.0.0.1:5000/users/register', data=j)
            # print(dataSent.json())
            # time.sleep(num_seconds)
            # if i == 5:
            #     break

    except requests.ConnectionError as e:
        print("Server is down. Try again later.")
    except Exception as e:
        print(e)


def send_category_data():
    try:
        data = categories()
        for i, j in enumerate(stream_data(data)):
            num_seconds = random.randint(0, 60)
            print(j)
            dataSent = requests.post(
                'http://127.0.0.1:5000/categories/add', data=j)
            print(dataSent.json())
            # time.sleep(num_seconds)
            # if i == 5:
            #     break
    except Exception as e:
        pass


def send_product_data():
    try:
        data = products()
        for i, j in enumerate(stream_data(data)):
            num_seconds = random.randint(0, 60)
            dataSent = requests.post(
                'http://127.0.0.1:5000/products/add', data=j)
            # print(dataSent.json())
            # time.sleep(num_seconds)
            # if i == 5:
            #     break
    except Exception as e:
        pass


def send_cart_data():
    # we remove the stage from the orders to form a cart
    try:
        data = orders()
        for i, j in enumerate(stream_data(data)):
            del j['stage']
            print(j)
            num_seconds = random.randint(0, 60)
            dataSent = requests.post('http://127.0.0.1:5000/cart/add', json=j)
            # print(dataSent.json())
            # time.sleep(num_seconds)
            # print(j)
            if i == 1:
                break
    except Exception as e:
        pass


def send_order_data():
    try:
        data = orders()
        for i, j in enumerate(stream_data(data)):
            print(j)
            num_seconds = random.randint(0, 60)
            dataSent = requests.post(
                'http://127.0.0.1:5000/orders/add', json=j)
            # print(dataSent.json())
            # time.sleep(num_seconds)
            if i == 2:
                break
    except Exception as e:
        pass


if __name__ == '__main__':
    # send_user_data()
    # send_category_data()
    # send_product_data()
    # send_cart_data()
    send_order_data()
