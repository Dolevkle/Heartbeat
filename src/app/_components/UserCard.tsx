import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { type User } from "@prisma/client";

interface Props {
  user: User | undefined;
}
export default function UserCard({ user }: Props) {
  return (
    <div className="flex items-center gap-4">
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
