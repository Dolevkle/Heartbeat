import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ImageGrid from "~/app/_components/signup/ImageGrid";

const ProfilePictureDisplay: React.FC = () => {
  const session = useSession();

  const { data: usersImages, refetch: refetchImages } =
    api.image.findMany.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });

  return (
    <ImageGrid
      imageUrls={usersImages?.map((image) => image.url) ?? []}
      refetchImages={refetchImages}
      width={350}
      height={300}
    />
  );
};

export default ProfilePictureDisplay;
