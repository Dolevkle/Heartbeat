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
      className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-4`}
      ref={divRef}
      onClick={() => (onClick && user ? onClick(user) : null)}
    >
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src={user?.image ?? ""} alt="Avatar" />
        <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{user?.name}</p>
        <p className="text-sm text-muted-foreground">{user?.age}</p>
      </div>
    </div>
  );
}
