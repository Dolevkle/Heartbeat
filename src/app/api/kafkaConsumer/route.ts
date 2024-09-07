// api/vercelKafkaConsumer.ts
import kafka from "~/server/kafka";
import redis from "~/server/redis";
import { NextResponse } from "next/server";

const consumer = kafka.consumer();

export async function POST() {
  const SECONDS_IN_WEEK = 60 * 60 * 24 * 7;
  try {
    // Consume messages from Kafka
    const messages = await consumer.consume({
      consumerGroupId: "group_1",
      instanceId: "instance_1",
      topics: ["notifications"],
      autoOffsetReset: "earliest",
    });

    for (const message of messages) {
      const notificationData = JSON.parse(
        message.value?.toString() || "{}",
      ) as { matchId: string; userId: string; approverId: string };
      const { userId, approverId } = notificationData;
      console.log(userId);
      console.log(approverId);

      // Check if the message already exists in Redis
      if (userId) {
        const existingMessages = await redis.lrange(
          `notifications:${userId}`,
          0,
          -1,
        );

        if (existingMessages.includes(approverId)) {
          console.log(
            `Message for user ${userId} by ${approverId} already exists in Redis.`,
          );
          continue;
        }

        // Store the notification in Redis for the user if not already present
        await redis.lpush(`notifications:${userId}`, approverId);

        // Set expiration time for the Redis key (same as Kafka retention)
        // Example: 1 week (adjust to match Kafka retention)
        await redis.expire(`notifications:${userId}`, SECONDS_IN_WEEK);
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
