"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { ChevronRight } from "lucide-react";
import SideCard from "~/app/_components/SideCard";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import { type User, type Image } from "@prisma/client";
import { Skeleton } from "@components/skeleton";

interface PotentialMatchDisplayProps {
  user: User | undefined;
  isInFocus?: boolean;
}

interface Props {
  potentialMatches: User[];
  potentialMatchesImages: Record<string, Image[]>;
  isLoadingUsers: boolean;
}

export default function Component({
  potentialMatches,
  potentialMatchesImages,
  isLoadingUsers,
}: Props) {
  const PotentialMatchSkeleton = () => (
    <div className="flex items-center space-x-4">
      {potentialMatches.map((_, index) => (
        <Skeleton key={index} className="m-1 h-12 w-12 rounded-full" />
      ))}
    </div>
  );

  const PotentialMatchDisplay = ({
    user,
    isInFocus,
  }: PotentialMatchDisplayProps) => {
    const userImages = potentialMatchesImages[user?.id ?? ""];
    return (
      <Avatar
        className={`h-12 w-12 border-2 ${isInFocus ? "border-primary" : "border-transparent"} m-1`}
      >
        <AvatarImage src={userImages ? userImages[0]?.url : ""} alt="Avatar" />
        <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <SideCard title="Matches">
      <div className="flex max-w-64 flex-row items-center gap-4">
        <ScrollArea className="w-full">
          <div className="mb-2 ml-4 flex w-10/12 flex-row">
            {potentialMatches?.map((potentialMatch, currentPotentialMatch) =>
              isLoadingUsers ? (
                <PotentialMatchSkeleton key={potentialMatch.id} />
              ) : (
                <PotentialMatchDisplay
                  key={potentialMatch?.id}
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
