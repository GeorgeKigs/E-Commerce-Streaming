import { Consumer, Kafka } from "kafkajs";
import mongoose from "mongoose";
import dotenv = require("dotenv");
import { config } from "./configs/configs";

dotenv.config({ path: "env" });

const connection = async () => {
	try {
		const url = config.mongodb_url;
		if (url) {
			await mongoose.connect(url);
			console.log(url);
		}
	} catch (error) {
		console.log(error);
	}
};

const kafka = () => {
	const client_id = process.env["KAFKA_CLIENTID"];
	const broker = process.env["KAFKA_BROKER"];

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

export { connection, kafka as kafka_client, ConsumerKafka };
