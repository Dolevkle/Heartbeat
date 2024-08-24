import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../shadcn/carousel";
import { Card, CardContent } from "../../shadcn/card";
import { api } from "~/trpc/react";
import ProfilePictureDialog from "./ProfilePictureDialog";
import DeleteUserPicture from "./DeleteUserPicture";

const ProfilePictureDisplay: React.FC = () => {
  const session = useSession();
  const [imageUrl, setImageUrl] = useState<string>("");

  const { data: usersImages, refetch: refetchImages } = api.image.findMany.useQuery(
    session.data?.user?.id ?? "",
    { enabled: !!session.data }
  );

  const handleDeleteSuccess = async () => {
    await refetchImages();
  };

  const handleUploadSuccess = async (url: string) => {
    setImageUrl(url);
    await refetchImages(); // Trigger a refetch of images after upload
  };

  return (
    <div>
      <div>
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {usersImages && usersImages.length > 0 ? (
              usersImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image src={image?.url} width={300} height={300} alt="User image" />
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <DeleteUserPicture
                      key={index}
                      imageUrl={image.url}
                      onDeleteSuccess={handleDeleteSuccess} // Pass the callback
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <Image
                src={"https://utfs.io/f/9dc01f95-3ff0-484f-822e-59500be4baeb-x8m314.png"}
                width={300}
                height={300}
                alt="No images found"
              />
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg">
        <ProfilePictureDialog onUploadSuccess={handleUploadSuccess} />
        <div className="mt-3 flex items-center justify-center text-xl font-bold">
          {"Profile picture"}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureDisplay;