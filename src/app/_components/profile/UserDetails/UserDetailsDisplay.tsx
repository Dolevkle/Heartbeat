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

  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    refetch: refetchUserDetails,
  } = api.user.findUserById.useQuery(session.data?.user?.id ?? "", {
    enabled: !!session.data,
  });

  const facts = [
    `${userDetails?.city} vibes`,
    `Music loving ${userDetails?.gender}`,
    `Searching for a ${userDetails?.sexualPreference} who matches my beat`,
  ];
  const {
    data: usersImages,
    refetch: refetchImages,
    isLoading: isLoadingImages,
  } = api.image.findMany.useQuery(session.data?.user?.id ?? "", {
    enabled: !!session.data,
  });

  const renderCardHeader = () => {
    if (isLoadingUserDetails || !userDetails)
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/5 rounded-md" />
          <Skeleton className="h-4 w-1/6 rounded-md" />
        </div>
      );
    return (
      <>
        <CardTitle>{`${userDetails?.name}, ${userDetails?.age}`}</CardTitle>
        <CardDescription>{userDetails?.email}</CardDescription>
      </>
    );
  };
  return (
    <Card className="max-w-screen-sm">
      <CardHeader>{renderCardHeader()}</CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            {facts.map((fact, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                {isLoadingUserDetails || isLoadingImages || !session.data ? (
                  <>
                    <Skeleton className="h-2 w-2 translate-y-1 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{fact}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="h-[400px] w-[400px]">
            <ImageGrid
              isLoading={isLoadingImages}
              imageUrls={usersImages?.map((image) => image.url) ?? []}
              refetchImages={refetchImages}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <DetailsEditDialog refetchUserDetails={refetchUserDetails} />
      </CardFooter>
    </Card>
  );
};

export default UserDetailsDisplay;
