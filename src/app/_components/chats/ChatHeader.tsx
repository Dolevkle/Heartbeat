"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { api } from "~/trpc/react";
import UserCard from "~/app/_components/UserCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

interface Props {
  chatId: string;
  user: User;
}
export default function ChatHeader({ chatId, user }: Props) {
  const messages = api.message.getMessages.useQuery({ chatId: chatId });
  console.log(messages);
  return (
    <Card className=" w-full rounded-none border-0 border-b border-secondary">
      <CardHeader className={" p-0"}>
        <UserCard user={user} />
      </CardHeader>
    </Card>
  );
}
