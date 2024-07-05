import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Chats from "~/app/_components/Chats";
import { Button } from "@components/button";

export default async function Page() {
  const session = await getServerAuthSession();
  const chats = await api.chat.getChats({ userId: session?.user.id ?? "" });

  return (
    <div className="h-full w-fit">
      <Chats chats={chats} />
    </div>
  );
}
