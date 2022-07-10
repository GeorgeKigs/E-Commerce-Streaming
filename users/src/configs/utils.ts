import { Kafka, Consumer } from "kafkajs";
import mongoose from "mongoose";
import configs from "./configs";

const connection = async () => {
	const url = configs.mongodb_url;
	console.log(url);

	if (url) {
		console.log(url);
		await mongoose.connect(url);
	} else {
		throw Error("cannot connect without env variables");
	}
};

const kafka = () => {
	const client_id = configs.kafka_consumer_client;
	const broker = configs.kafka_topic_broker;
	if (broker) {
		const kafka = new Kafka({
			clientId: client_id,
			brokers: [broker],
		});
		return kafka;
	} else {
		throw Error("Cannot connect to the MQ");
	}
};

const produce = async (topic: string, partition: number, message: any) => {
	var kafka_prod: Kafka = kafka();
	const producer = kafka_prod.producer({
		allowAutoTopicCreation: false,
	});
	await producer.send({
		topic,
		messages: [
			{
				key: message["key"],
				value: message["value"],
				partition: partition,
			},
		],
	});
};

abstract class ConsumerKafka {
	kafka: Kafka;
	groupId: string;
	topic: string;

	constructor() {
		this.kafka = kafka();
		this.groupId = "";
		this.topic = "";
	}

	protected async def_consumer(): Promise<Consumer> {
		const consumer = this.kafka.consumer({
			allowAutoTopicCreation: false,
			groupId: this.groupId,
		});

		await consumer.connect();
		await consumer.subscribe({
			topic: this.topic,
			fromBeginning: true,
		});
		return consumer;
	}

	public abstract def_vars(): void;
}

export { connection, kafka as kafka_client };
