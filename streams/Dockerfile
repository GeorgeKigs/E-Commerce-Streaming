FROM bitnami/spark

USER root
# RUN apt-get install librdkafka-dev gcc librdkafka musl-dev linux-headers
COPY requirements.txt .
RUN pip install -r requirements.txt 
RUN pip install pymongo mongoengine
RUN apt-get update && apt-get install -y gcc
RUN pip install uwsgi
WORKDIR /app
COPY . .
CMD ["python","app.py"]