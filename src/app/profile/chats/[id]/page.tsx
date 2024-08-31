"use client";
import ChatInput from "~/app/_components/chats/ChatInput";
import ChatHeader from "~/app/_components/chats/ChatHeader";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { type User } from "@prisma/client";
import ChatMessages from "~/app/_components/chats/ChatMessages";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const parsedUser = JSON.parse(
    decodeURIComponent(searchParams.get("user") ?? ""),
  ) as User;
  const { data: messages } = api.message.getMessages.useQuery({
    chatId: params.id,
  });

  const { data: usersImages } = api.image.findMany.useQuery(
    parsedUser.id ?? "",
  );

  return (
    <div className="grid h-full w-full grid-rows-12">
      <ChatHeader
        user={parsedUser}
        images={(usersImages || []).map((image) => image.url)}
      />
      <ChatMessages messages={messages} chatId={params.id} />
      <ChatInput chatId={params.id} />
    </div>
  );
}
