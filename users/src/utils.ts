import { Kafka } from "kafkajs";
import mongoose from "mongoose";

const connection = async () => {
	try {
		await mongoose.connect("mongodb://localhost/users");
	} catch (error) {
		console.log("connection not estalished");
		// console.error(error);
	}
};

const kafka = new Kafka({
	clientId: "Tausi Application",
	brokers: ["localhost:9092"],
});

export { connection, kafka };
