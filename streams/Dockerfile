FROM bitnami/spark

USER root
# RUN apt-get install librdkafka-dev gcc librdkafka musl-dev linux-headers
COPY requirements.txt .
RUN pip install -r requirements.txt 
WORKDIR /app
COPY . .
CMD ["spark-submit","--packages","org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0","streams.py"]