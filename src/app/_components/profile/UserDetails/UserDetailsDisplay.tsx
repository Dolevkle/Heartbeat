import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/card";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import DetailsEditDialog from "./DetailsEditDialog";
import ImageGrid from "~/app/_components/signup/ImageGrid";
import React from "react";
import { Skeleton } from "@components/skeleton";

const UserDetailsDisplay: React.FC = () => {
  const session = useSession();

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    api.user.findUserById.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });

  const facts = [
    `I live in ${userDetails?.city}`,
    `I am a ${userDetails?.gender}.`,
    `I am looking for a ${userDetails?.sexualPreference}!`,
  ];
  const {
    data: usersImages,
    refetch: refetchImages,
    isLoading: isLoadingImages,
  } = api.image.findMany.useQuery(session.data?.user?.id ?? "", {
    enabled: !!session.data,
  });

  return (
    <Card className="max-w-screen-sm">
      <CardHeader>
        {isLoadingUserDetails || !userDetails ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/5 rounded-md" />
            <Skeleton className="h-4 w-1/6 rounded-md" />
          </div>
        ) : (
          <>
            <CardTitle>{`${userDetails?.name}, ${userDetails?.age}`}</CardTitle>
            <CardDescription>{userDetails?.email}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {isLoadingUserDetails || isLoadingImages || !session.data ? (
          <div className="flex justify-between">
            <div>
              {facts.map((_, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <Skeleton className="h-2 w-2 translate-y-1 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-4 h-[400px] w-[400px]">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <div>
              {facts.map((fact, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{fact}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-h-[400px] max-w-[400px]">
              <ImageGrid
                imageUrls={usersImages?.map((image) => image.url) ?? []}
                refetchImages={refetchImages}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <DetailsEditDialog />
      </CardFooter>
    </Card>
  );
};

export default UserDetailsDisplay;
