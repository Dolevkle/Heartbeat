"use client";
import ChatInput from "~/app/_components/chats/ChatInput";
import ChatHeader from "~/app/_components/chats/ChatHeader";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const parsedUser = JSON.parse(
    decodeURIComponent(searchParams.get("user") ?? ""),
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-between">
      <ChatHeader chatId={params.id} user={parsedUser} />
      <ChatInput />
    </div>
  );
}
