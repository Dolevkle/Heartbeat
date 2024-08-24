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
  const updatedUserImages  = usersImages && usersImages.length > 0 ? usersImages.map(image =>image.url): ["https://utfs.io/f/9dc01f95-3ff0-484f-822e-59500be4baeb-x8m314.png"]
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
          {
              updatedUserImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image src={image} width={300} height={300} alt="User image" />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg ">
                    <DeleteUserPicture
                      key={index}
                      imageUrl={image}
                      onDeleteSuccess={handleDeleteSuccess} // Pass the callback
                    />
        <ProfilePictureDialog onUploadSuccess={handleUploadSuccess} />
        <div className="mt-3 flex items-center justify-center text-xl font-bold">
          {"Profile picture"}
        </div>
      </div>
                </CarouselItem>
              ))
            }

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ProfilePictureDisplay;