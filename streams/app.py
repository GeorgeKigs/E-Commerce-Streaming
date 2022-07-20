from flask import Flask, jsonify, request, abort
from pyspark.ml.tuning import CrossValidator
import json
from misc import read_env, main_logger
from publish import WriteKafka


from pyspark.sql import SparkSession
import pyspark.sql as sql
from pyspark.sql import functions as func

app = Flask(__name__)


@app.route("/predict/<uuid:userID>")
def load_model():
    model = CrossValidator.load("./model")
    return model.transform()


@app.route("/logClicks", methods=["POST"])
def log():
    """Adds the click data into a Kafka Topic"""
    # input data = { user: user, product: productID }
    try:
        data = request.get_json()
        data.update({"rating": 2})
        producer.publish("Clicks", json.dumps(data))

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
        data.update({"rating": 1})
        producer.publish("Hover", json.dumps(data))

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
        user = data["user"]
        product = data["productID"]
        rating = 3
        producer.publish("Cart", json.dumps(
            {"user": user, "productId": product, "rating": rating}))
        return jsonify({
            "success": True,
            "data": True
        }), 200
    except Exception as e:
        print(e.with_traceback())
        abort(500)


@ app.route("/logOrders", methods=["POST"])
def log_orders():
    """Used to publish the orders we recieve
    """
    try:
        json_data = request.get_json()
        data = [{
            "user": json_data["uuid"],
            "product":j["product"],
            "rating":4
        } for j in json_data["products"]]
        for single_data in data:
            producer.publish("Orders", json.dumps(single_data))
            print(single_data)

        return jsonify({
            "success": True,
            "data": True
        })
    except:
        return jsonify({
            "success": True,
            "data": True
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
        "data": f"server error due to "
    }), 500


@ app.route("/")
def hello():
    return jsonify({
        "greetings": "hello world"
    })


if __name__ == "__main__":
    # init server

    env = read_env()
    start = False
    logger = main_logger()
    try:
        # init publisher
        producer = WriteKafka(topic=env["KAFKA_CONSUMER_TOPIC"])
        result = producer.create_topic()

        if result:
            app.run(host="0.0.0.0", port=3000)
            logger.info("Server Started")
        else:
            logger.critical("Server Closed")
            exit(1)
    except KeyboardInterrupt as e:
        logger.critical("Killed by user")
    except Exception as e:
        logger.critical("Error occurred")
