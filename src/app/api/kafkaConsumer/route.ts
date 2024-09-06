// api/vercelKafkaConsumer.ts
import kafka from "~/server/kafka";
import redis from "~/server/redis";
import { NextResponse } from "next/server";

// Set up Upstash Kafka
const consumer = kafka.consumer();

export async function POST() {
  try {
    // Consume messages from Kafka
    const messages = await consumer.consume({
      consumerGroupId: "group_1",
      instanceId: "instance_1",
      topics: ["notifications"],
      autoOffsetReset: "earliest",
    });

    for (const message of messages) {
      const secondUserId = message.key?.toString();
      const notificationData = JSON.parse(
        message.value?.toString() || "{}",
      ) as { matchId: string; userId: string; message: string };

      // Check if the message already exists in Redis
      if (secondUserId) {
        const existingMessages = await redis.lrange(
          `notifications:${secondUserId}`,
          0,
          -1,
        );

        if (existingMessages.includes(notificationData.message)) {
          console.log(
            `Message for user ${secondUserId} already exists in Redis.`,
          );
          continue; // Skip saving the message if it's already in Redis
        }

        // Store the notification in Redis for the user if not already present
        await redis.lpush(`notifications:${secondUserId}`, notificationData);

        // Set expiration time for the Redis key (same as Kafka retention)
        const kafkaRetentionInSeconds = 60 * 60 * 24 * 7; // Example: 1 week (adjust to match Kafka retention)
        await redis.expire(
          `notifications:${secondUserId}`,
          kafkaRetentionInSeconds,
        );
      }
    }

    if (messages !== null) {
      return NextResponse.json({ messages: messages.length || 0 });
    } else {
      return NextResponse.json(
        { error: "Failed to fetch messages from Kafka Cluster" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing Kafka messages:", error);
    return NextResponse.json(
      { success: false, message: "Error processing Kafka messages." },
      { status: 500 },
    );
  }
}
