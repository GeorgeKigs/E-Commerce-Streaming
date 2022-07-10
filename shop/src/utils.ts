import { Consumer, Kafka } from "kafkajs";
import mongoose from "mongoose";
import dotenv = require("dotenv");
import configs from "./configs/configs";

const connection = async () => {
	const con_str = configs.mongodb_url;
	if (con_str) {
		console.log(con_str);
		await mongoose.connect(con_str);
	}
};

const kafka = () => {
	const client_id = configs.kafka_consumer_group;
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

export { connection, kafka as kafka_client, ConsumerKafka };
