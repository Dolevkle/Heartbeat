"use client";

import React from "react";
import { Button } from "@components/button";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ImageGrid from "~/app/_components/signup/ImageGrid";

interface Props {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

function SecondStep({ handlePreviousStep, handleNextStep }: Props) {
  const session = useSession();
  const {
    data: usersImages,
    refetch: refetchImages,
    isLoading: isLoadingImages,
  } = api.image.findMany.useQuery(session.data?.user?.id ?? "", {
    enabled: !!session.data,
  });

  return (
    <>
      <div className="h-[400px] w-[400px]">
        <ImageGrid
          isLoading={isLoadingImages}
          imageUrls={usersImages?.map((img) => img.url)}
          refetchImages={refetchImages}
        />
      </div>

      <div className="flex gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePreviousStep}
        >
          Previous
        </Button>
        <Button
          className="w-full"
          disabled={!usersImages || usersImages.length < 1}
          onClick={handleNextStep}
        >
          Continue
        </Button>
      </div>
    </>
  );
}

export default SecondStep;
