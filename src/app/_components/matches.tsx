"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { ChevronRight } from "lucide-react";
import SideCard from "~/app/_components/SideCard";
import UserCardSkeleton from "~/app/_components/UserCardSkeleton";
import { ScrollArea, ScrollBar } from "./shadcn/scroll-area";
import { type User } from "@prisma/client";

interface PotentialMatchDisplayProps {
  user: User | undefined;
  isInFocus?: boolean;
}

interface Props {
  potentialMatches: User[];
  isLoadingUsers: boolean;
}

export default function Component({ potentialMatches, isLoadingUsers }: Props) {
  const PotentialMatchDisplay = ({
    user,
    isInFocus,
  }: PotentialMatchDisplayProps) => (
    <Avatar
      className={`h-12 w-12 border-2 ${isInFocus ? "border-primary" : "border-transparent"} m-1`}
    >
      <AvatarImage src={user?.image ?? ""} alt="Avatar" />
      <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
    </Avatar>
  );

  return (
    <SideCard title="Matches">
      <div className="flex max-w-64 flex-row items-center gap-4">
        <ScrollArea className="w-full">
          <div className="mb-2 ml-4 flex w-10/12 flex-row">
            {potentialMatches?.map((potentialMatch, currentPotentialMatch) =>
              isLoadingUsers ? (
                <UserCardSkeleton key={potentialMatch.id} />
              ) : (
                <PotentialMatchDisplay
                  key={potentialMatch.id}
                  user={potentialMatches?.[currentPotentialMatch]}
                  isInFocus={currentPotentialMatch == 0}
                />
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <ChevronRight className="mb-1 mr-1 h-8 w-8" />
      </div>
    </SideCard>
  );
}
