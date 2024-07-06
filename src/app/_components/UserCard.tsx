import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { type User } from "@prisma/client";
import { useRef } from "react";

interface Props {
  user: User | undefined;
  onClick?: (user: User) => void;
  isSelected?: boolean;
}
export default function UserCard({ user, onClick, isSelected }: Props) {
  const divRef = useRef<HTMLDivElement>(null);

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
