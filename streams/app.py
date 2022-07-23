
from flask import Flask, jsonify, request, abort
from bson import json_util
import json
from misc import read_env, main_logger, configs
from publish import WriteKafka

import pymongo


app = Flask(__name__)
env = read_env()

logger = main_logger()
config = configs()

try:
    # init publisher
    producer = WriteKafka(topic=config["kafka_topic"])
    result = producer.create_topic()
    # start_connection()

    if result:
        app.run(port=3000)
        logger.info("Server Started")
    else:
        logger.critical("Server Closed")
        exit(1)
except KeyboardInterrupt as e:
    logger.critical("Killed by user")
except Exception as e:
    logger.critical(f"Error occurred {e}")


@app.route("/predict/<userID>", methods=["GET"])
def load_predictions(userID):
    try:

        myclient = pymongo.MongoClient('localhost', 27000)
        mydb = myclient["predictions"]
        mydoc = mydb[env["MONGODB_COL"]].find({"user": f"{userID}"})
        prods = [j['productID-index']
                 for i in mydoc for j in i["recommendations"]]
        products = mydb["transformed-data"].find(
            {"productID-index": {"$in": prods}})
        results = [i["productID"] for i in products]

        return jsonify({
            "success": 200,
            "data": results
        }), 200
    except Exception as e:
        logger.error(f"error: {e}")
        return jsonify({
            "success": False,
            "data": e
        }), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "hello": "world"
    })


@app.route("/logClicks", methods=["POST"])
def log():
    """Adds the click data into a Kafka Topic"""
    # input data = { user: user, product: productID }
    try:
        data = request.get_json()
        user = data["uuid"]
        product = data["productID"]
        rating = 2
        producer.publish("Clicks", json.dumps(
            {"user": user, "productID": product, "rating": rating}))

        return jsonify({
            "success": 200,
            "data": True
        })
    except Exception as e:
        abort(500)


@ app.route("/logHover", methods=["POST"])
def log_hover():
    """Adds the hover data into a Kafka Topic"""

    try:
        data = request.get_json()

        user = data["uuid"]
        product = data["productID"]
        rating = 1

        producer.publish("Hover", json.dumps(
            {"user": user, "productID": product, "rating": rating}))

        return jsonify({
            "success": 200,
            "data": True
        })
    except Exception as e:
        print(e.with_traceback())
        abort(500)


@ app.route("/logCart", methods=["POST"])
def log_cart():
    """Publish data into the Kafka Topic

    Returns:
        json: return data in_case of a successful data
    """

    try:
        data = request.get_json()
        user = data["uuid"]
        product = data["productID"]
        rating = 3
        logger.info(f"we recieved data: ")
        producer.publish("Cart", json.dumps(
            {"user": user, "productID": product, "rating": rating}))
        return jsonify({
            "success": True,
            "data": True
        }), 200
    except Exception as e:
        logger.error(f"log_clicks: {e}")
        abort(500)


@ app.route("/logOrders", methods=["POST"])
def log_orders():
    """Used to publish the orders we recieve
    """
    try:
        json_data = request.get_json()
        data = [{
            "user": json_data["uuid"],
            "productID":j["productID"],
            "rating":4
        } for j in json_data["products"]]
        for single_data in data:
            producer.publish("Orders", json.dumps(single_data))
            print(single_data)

        return jsonify({
            "success": True,
            "data": True
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "data": e
        })


@app.errorhandler(404)
def page_not_found(error):
    return jsonify({
        "success": False,
        "data": "Page Not Found"
    }), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "success": False,
        "data": f"server error due to {error}"
    }), 500


@ app.route("/")
def hello():
    return jsonify({
        "greetings": "hello world"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
