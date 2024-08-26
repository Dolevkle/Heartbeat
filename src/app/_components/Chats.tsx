"use client";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import SideCard from "~/app/_components/SideCard";
import { Button } from "@components/button";
import { toast } from "@components/use-toast";
import UserCard from "~/app/_components/UserCard";
import UserCardSkeleton from "~/app/_components/UserCardSkeleton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
interface Props {
  chats: RouterOutputs["chat"]["getChats"];
}
export default function Chats({ chats }: Props) {
  const session = useSession();
  const router = useRouter();

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
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleUserCardClick = (user: User, chatId: string) => {
    setSelectedId(user.id);
    const queryString = `user=${encodeURIComponent(JSON.stringify(user))}`;
    router.push(`/profile/chats/${chatId}?${queryString}`);
  };

  return (
    <div className="w-fit">
      <SideCard title="Chats">
        {chats?.map((chat, i) =>
          isLoading ? (
            <UserCardSkeleton key={chat.id} />
          ) : (
            <UserCard
              key={chat.id}
              user={orderedUsers?.[i]}
              isSelected={
                selectedId ===
                (orderedUsers?.[i] ? orderedUsers[i]?.id : undefined)
              }
              onClick={() => handleUserCardClick(orderedUsers[i], chat.id)}
            />
          ),
        )}
      </SideCard>
    </div>
  );
}
