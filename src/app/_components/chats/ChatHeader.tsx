"use client";
import { Card, CardHeader } from "@components/card";
import UserCard from "~/app/_components/UserCard";
import { type User } from "@prisma/client";

interface Props {
  user: User;
}
export default function ChatHeader({ user }: Props) {
  return (
    <Card className="row-span-1 col-span-2 w-full rounded-none border-0 border-b border-secondary">
      <CardHeader className={" p-0"}>
        <UserCard user={user} />
      </CardHeader>
    </Card>
  );
}
