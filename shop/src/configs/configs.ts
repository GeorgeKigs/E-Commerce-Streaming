import dotenv from "dotenv";

dotenv.config({ path: ".env" });
// console.log("here");
const configs = {
	kafka_topic_broker: process.env["KAFKA_TOPIC_BROKER"],
	kafka_user_topic: process.env["KAFKA_USER_TOPIC"],
	kafka_consumer_group: process.env["KAFKA_CONSUMER_GROUP"],
	kafka_consumer_topic: process.env["KAFKA_CONSUMER_TOPIC"],
	client_id: process.env["CLIENT_ID"],
	mongodb_url: process.env["MONGODB_URL_DOCKER"] || process.env["MONGODB_URL"],
	auth_url: process.env["AUTH_URL"],
};
// console.log("there");
export default configs;
