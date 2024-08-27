"use client";

import React from "react";
import { Button } from "@components/button";
import { useSession } from "next-auth/react";
import { type UseFormReturn } from "react-hook-form";
import { api } from "~/trpc/react";
import ImageGrid from "~/app/_components/signup/ImageGrid";

interface Props {
  handlePreviousStep: () => void;
  submitButtonContent: React.ReactElement;
}

function SecondStep({ handlePreviousStep, submitButtonContent }: Props) {
  const session = useSession();
  const { data: usersImages, refetch: refetchImages } =
    api.image.findMany.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });

  return (
    <>
      {usersImages && (
        <ImageGrid
          imageUrls={usersImages?.map((img) => img.url)}
          refetchImages={refetchImages}
        />
      )}
      <div className="flex gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePreviousStep}
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={!usersImages || usersImages.length < 1}
        >
          {submitButtonContent}
        </Button>
      </div>
    </>
  );
}

export default SecondStep;
