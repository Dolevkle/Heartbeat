"use client";
import { Card, CardHeader } from "@components/card";
import UserCard from "~/app/_components/UserCard";
import { Image, type User } from "@prisma/client";

interface Props {
  user: User;
  image: string | null;
}
export default function ChatHeader({ user, image }: Props) {
  user.image = image;
  return (
    <Card className="col-span-2 row-span-1 w-full rounded-none border-0 border-b border-secondary">
      <CardHeader className={" p-0"}>
        <UserCard user={user} />
      </CardHeader>
    </Card>
  );
}
