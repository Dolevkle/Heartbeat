// api/vercelKafkaConsumer.ts
import kafka from "~/server/kafka";
import redis from "~/server/redis";
import { NextResponse } from "next/server";

// Set up Upstash Redis

const consumer = kafka.consumer();

export async function GET() {
  try {
    const messages = await consumer.consume({
      consumerGroupId: "group_1",
      instanceId: "instance_1",
      topics: ["notification"],
      autoOffsetReset: "earliest",
    });

    for (const message of messages) {
      console.log(message);
      const secondUserId = message.key?.toString();
      const notificationData = JSON.parse(
        message.value?.toString() || "{}",
      ) as { matchId: string; userId: string; message: string };

      // Store the notification in Redis for the user
      if (secondUserId) {
        await redis.lpush(
          `notifications:${secondUserId}`,
          notificationData.message,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Kafka messages processed.",
    });
  } catch (error) {
    console.error("Error processing Kafka messages:", error);
    return NextResponse.json(
      { success: false, message: "Error processing Kafka messages." },
      { status: 500 },
    );
  }
}
