import { Kafka } from "@upstash/kafka";
import { env } from "~/env";

const kafka = new Kafka({
  url: env.UPSTASH_KAFKA_REST_URL,
  username: env.UPSTASH_KAFKA_REST_USERNAME,
  password: env.UPSTASH_KAFKA_REST_PASSWORD,
});

export default kafka;
