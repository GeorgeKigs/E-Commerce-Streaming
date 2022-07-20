
from confluent_kafka import Producer
from confluent_kafka.error import KafkaException
from misc import read_env, read_kafka_config
from confluent_kafka.admin import AdminClient, NewTopic


class WriteKafka:
    def __init__(self, topic):
        self.configs = read_kafka_config()
        self.env = read_env()
        self.topic = topic
        self.prod = Producer(self.configs)

    def check_connection(self) -> bool:
        topics = AdminClient.list_topics().topics
        if self.topic not in topics:
            return False
        return True

    def create_topic(self):
        try:
            admin = AdminClient(self.configs)
            topic = [NewTopic(f"{self.topic}", num_partitions=1)]
            result = admin.create_topics(
                topic, operation_timeout=1000, request_timeout=1000)
            for topic, data in result.items():
                try:
                    data.result()
                    return True
                except:
                    return False

        except KafkaException as e:
            print(e)
            return False

    def callback(self, error, message):
        if error:
            pass  # write to a logger file
        if message:
            pass  # write to a logger

    def publish(self, key: str, data: dict):
        ''' Publish data to the topic'''
        self.prod.produce(
            self.topic, data, key, on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
