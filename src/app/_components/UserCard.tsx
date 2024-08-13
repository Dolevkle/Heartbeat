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
    <div className="flex">
      <div
        className={`flex rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-1`}
        ref={divRef}
        onClick={() => (onClick && user ? onClick(user) : null)}
      >
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={user?.image ?? ""} alt="Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
      </div>
      <div
        className={`flex rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-1`}
        ref={divRef}
        onClick={() => (onClick && user ? onClick(user) : null)}
      >
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={user?.image ?? ""} alt="Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
      </div>
      <div
        className={`flex rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-1`}
        ref={divRef}
        onClick={() => (onClick && user ? onClick(user) : null)}
      >
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={user?.image ?? ""} alt="Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
      </div>
      <div
        className={`flex rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-1`}
        ref={divRef}
        onClick={() => (onClick && user ? onClick(user) : null)}
      >
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={user?.image ?? ""} alt="Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
      </div>
      <div
        className={`flex rounded-lg border-2 ${isSelected ? "border-white" : "border-transparent"} p-1`}
        ref={divRef}
        onClick={() => (onClick && user ? onClick(user) : null)}
      >
        <Avatar className="hidden h-9 w-9 sm:flex">
          <AvatarImage src={user?.image ?? ""} alt="Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
