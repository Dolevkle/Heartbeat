"use client";
import ChatInput from "~/app/_components/chats/ChatInput";
import ChatHeader from "~/app/_components/chats/ChatHeader";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { type User } from "@prisma/client";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const parsedUser = JSON.parse(
    decodeURIComponent(searchParams.get("user") ?? ""),
  ) as User;
  const messages = api.message.getMessages.useQuery({ chatId: params.id });
  console.log(messages);

  return (
    <div className="flex h-full w-full flex-col items-center justify-between">
      <ChatHeader user={parsedUser} />
      <ChatInput />
    </div>
  );
}
