import time
from urllib.error import HTTPError
from getData import get_order_data as orders
import requests
import pandas as pd
import random


def send(url, data):
    try:
        dataSent = requests.post(url, data=data)

    except requests.ConnectionError as e:
        print("Server is down. Try again later.")
    except Exception as e:
        print(e)


def stream_data(data):
    for i in data:
        yield i


def send_cart_data():
    # we remove the stage from the orders to form a cart
    try:
        data = orders()
        num_seconds = random.randint(0, 10)
        for i, j in enumerate(stream_data(data)):
            del j['stage']
            send('http://127.0.0.1:5000/cart/add', json=j)

            if i == num_seconds:
                break
    except Exception as e:
        pass


def send_order_data():
    try:
        data = orders()
        nums = random.randint(0, 5)
        for i, j in enumerate(stream_data(data)):
            send('http://127.0.0.1:5000/orders/add', json=j)

            if i == nums:
                break
    except Exception as e:
        pass


if __name__ == '__main__':

    stream_options = [
        send_cart_data,
        send_order_data]
    while True:
        choice = random.choice(stream_options)
        time_sleep = random.randint(0, 60)
        choice()
        time.sleep(time_sleep)
