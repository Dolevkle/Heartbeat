"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
export default function Page() {
  const session = useSession();
  const searchParams = useSearchParams();
  const notifications = decodeURIComponent(
    searchParams.get("notifications") ?? "[]",
  );

  const deleteNotifications =
    api.notification.deleteNotifications.useMutation();

  const { data: users, isSuccess } = api.user.findUsersByIds.useQuery(
    JSON.parse(notifications) as string[],
    {
      enabled: notifications !== null && notifications.length > 0,
    },
  );
  const { data: usersImages } = api.image.groupImagesByIds.useQuery(
    users?.map((user) => user?.id ?? "") ?? [],
    { enabled: users && users.length > 0 },
  );

  useEffect(() => {
    if (users && users.length > 0) {
      deleteNotifications.mutate({ userId: session.data?.user.id ?? "" });
    }
  }, [isSuccess]);

  return (
    <Card className="h-full border-none">
      <CardHeader>
        <CardTitle>Approved you</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {users?.map((user) => {
          const { name, id, email } = user ?? {};
          return (
            <div className="flex items-center gap-4 " key={id}>
              <Avatar className="hidden h-9 w-9 blur-sm sm:flex">
                {usersImages?.[id!]?.[0] && (
                  <AvatarImage
                    src={usersImages?.[id!]?.[0]?.url}
                    alt="Avatar"
                  />
                )}
                <AvatarFallback>{name?.charAt(0) ?? ""}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 blur-sm">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              {/*<div className="ml-auto font-medium">+$1,999.00</div>*/}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
