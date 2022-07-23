import mongoengine
import datetime
from misc import read_env, main_logger
logger = main_logger()
file = read_env()


def start_connection():

    try:
        logger.info("establishing connection with mongodb")
        mongoengine.connect(db=file["MONGODB_DB"],
                            host=file["MONGODB_URL"], alias='default')
    except Exception as e:
        # log the error as level critical
        logger.info("connection failed with mongodb")
        exit(1)


class Transactions(mongoengine.Document):
    user = mongoengine.StringField()
    time = mongoengine.DateTimeField(default=datetime.datetime.now())
    volume = mongoengine.FloatField()
    high = mongoengine.FloatField()
    low = mongoengine.FloatField()
    new_high = mongoengine.BooleanField()
    time_websocket = mongoengine.FloatField()

    meta = {'allow_inheritance': True,
            "collection": file["MONGODB_COL"], "db_alias": "default"}
