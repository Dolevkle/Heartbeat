"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Sparkles } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@components/skeleton";
import SideCard from "~/app/_components/SideCard";
import { Button } from "@components/button";
import { toast } from "@components/use-toast";
import UserCard from "~/app/_components/UserCard";
import UserCardSkeleton from "~/app/_components/UserCardSkeleton";
interface Props {
  chats: RouterOutputs["chat"]["getChats"];
}
export default function Chats({ chats }: Props) {
  const session = useSession();
  const chatUserIds = chats?.map(({ users }) =>
    users[0] === session.data?.user.id ? users[1] : users[0],
  );
  const { data: users, isLoading } = api.user.findUsersByIds.useQuery(
    chatUserIds,
    {
      enabled: chatUserIds !== undefined,
    },
  );
  /**
   * This function maps the user IDs to their corresponding user objects from the fetched users data.
   * It ensures that the order of the users matches the order of the IDs.
   */
  const orderedUsers = chatUserIds?.map((id) =>
    users?.find((user) => user.id === id),
  );

  const { mutate: createChat, isPending } = api.chat.createChat.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Test chat successfully created",
      });
    },
  });
  return (
    <SideCard title="Chats">
      {chats?.map((chat, i) =>
        isLoading ? (
          <UserCardSkeleton key={chat.id} />
        ) : (
          <UserCard key={chat.id} user={orderedUsers?.[i]} />
        ),
      )}
      <Button
        onClick={() =>
          createChat({
            users: ["665654d7880d08ee8cf00c00", "6686cf8d0cd54da497acec0e"],
          })
        }
      >
        Create Test Chat
      </Button>
    </SideCard>
  );
}
