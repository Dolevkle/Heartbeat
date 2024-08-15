import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Chats from "~/app/_components/Chats";
import Sidebar from "~/app/_components/Sidebar"
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const chats = await api.chat.getChats({ userId: session?.user.id ?? "" });

  return (
    <div className="flex h-full w-full">
      <Sidebar></Sidebar>
      <Chats chats={chats} />
      <div className="flex w-full">{children}</div>
    </div>
  );
}
