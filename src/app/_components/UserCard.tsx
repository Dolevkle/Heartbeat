import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { type User } from "@prisma/client";
import { useRef } from "react";
import { api } from "~/trpc/react";

interface Props {
  user: User | undefined;
  onClick?: (user: User) => void;
  isSelected?: boolean;
  chatId: string;
}
export default function UserCard({ user, onClick, isSelected, chatId }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const { data: messages } = api.message.getLatestMessage.useQuery({
    chatId: chatId,
  });

  return (
    <div
      className={`flex items-start cursor-pointer gap-4 rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-4`}
      ref={divRef}
      onClick={() => (onClick && user ? onClick(user) : null)}
    >
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src={user?.image ?? ""} alt="Avatar" />
        <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1 grid-cols-2 grid-rows-2">
        <p className="text-sm font-medium leading-none w-min">{user?.name}</p>
        <p className="text-sm text-muted-foreground leading-none">{user?.age}</p>
        <p className="text-sm text-muted-foreground col-span-2">
          {messages && messages[0]?.content}
        </p>
      </div>
    </div>
  );
}
