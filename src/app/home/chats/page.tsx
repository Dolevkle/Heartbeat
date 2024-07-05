import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Chats from "~/app/_components/Chats";
import { Button } from "@components/button";

export default async function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-white">Select a chat from the sidebar</h1>
    </div>
  );
}
