import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ImageGrid from "~/app/_components/signup/ImageGrid";

const ProfilePictureDisplay: React.FC = () => {
  const session = useSession();

  const {
    data: usersImages,
    refetch: refetchImages,
    isLoading: isLoadingImages,
  } = api.image.findMany.useQuery(session.data?.user?.id ?? "", {
    enabled: !!session.data,
  });

  return (
    <div className="max-h-[400px] max-w-[400px]">
      <ImageGrid
        isLoading={isLoadingImages}
        imageUrls={usersImages?.map((image) => image.url) ?? []}
        refetchImages={refetchImages}
      />
    </div>
  );
};

export default ProfilePictureDisplay;
