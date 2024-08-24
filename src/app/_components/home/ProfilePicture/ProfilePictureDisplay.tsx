import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../shadcn/carousel";
import { Card, CardContent } from "../../shadcn/card";
import { api } from "~/trpc/react";
import ProfilePictureDialog from "./ProfilePictureDialog";
import DeleteUserPicture from "./DeleteUserPicture";

const ProfilePictureDisplay: React.FC = () => {
  const session = useSession();

  const { data: usersImages, refetch: refetchImages } =
    api.image.findMany.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });

  const isUserHasImages = usersImages && usersImages.length > 0;

  const updatedUserImages = isUserHasImages
    ? usersImages.map((image) => image.url)
    : ["https://utfs.io/f/9dc01f95-3ff0-484f-822e-59500be4baeb-x8m314.png"];

  const handleDeleteSuccess = async () => {
    await refetchImages();
  };

  const handleUploadSuccess = async () => {
    await refetchImages();
  };

  return (
    <div>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {updatedUserImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Image
                    src={image}
                    width={300}
                    height={300}
                    alt="User image"
                  />
                </CardContent>
              </Card>
              <div
                className={`relative ${isUserHasImages ? "left-1/3" : "left-1/3 ml-1 translate-x-1/2"} mt-1 flex h-12 w-12 max-w-sm gap-2 rounded text-white`}
              >
                {isUserHasImages && (
                  <DeleteUserPicture
                    imageUrl={image}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                )}
                <ProfilePictureDialog onUploadSuccess={handleUploadSuccess} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProfilePictureDisplay;
