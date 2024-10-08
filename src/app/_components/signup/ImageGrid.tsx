import React, { useRef, useState } from "react";
import ProfilePictureDialog from "~/app/_components/home/ProfilePicture/ProfilePictureDialog";
import { api } from "~/trpc/react";
import { removeImageFromS3 } from "~/app/actions/removeImageFromS3";
import { useToast } from "@components/use-toast";
import ProfileImage from "~/app/_components/signup/ProfileImage";
import { Skeleton } from "@components/skeleton";

export const EmptyImageLayout = ({ content }: { content: string }) => (
  <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
    <span className="text-4xl">{content}</span>
  </div>
);

interface Props {
  isLoading: boolean;
  imageUrls: string[] | undefined;
  refetchImages: () => void;
}

const ImageGrid = ({ isLoading, imageUrls, refetchImages }: Props) => {
  const [loading, setLoading] = useState<boolean[]>(new Array(7).fill(false));
  const currentImage = useRef(-1);
  const { toast } = useToast();
  // Fallback numbers in case imageUrls is empty or partially filled
  const defaultContent = ["1", "2", "3", "4", "5", "6", "7"];
  const { mutate: deleteImage } = api.image.deleteOne.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      const copy = [...loading];
      copy[currentImage.current] = false;
      setLoading(copy);
      refetchImages();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Uh oh! Something went wrong.",
      });
      const copy = [...loading];
      copy[currentImage.current] = false;
      setLoading(copy);
    },
  });

  const handleRemove = async (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string | undefined,
    index: number,
  ) => {
    evt.stopPropagation();
    currentImage.current = index;
    if (imageUrl) {
      const copy = [...loading];
      copy[index] = true;
      setLoading(copy);
      const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      const res = await removeImageFromS3(imageKey);
      if (res.success) deleteImage(imageUrl);
    }
  };

  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-4 gap-4 p-4">
      {defaultContent.map((content, index) => {
        const url = imageUrls?.[index] ?? null;

        if (index === 0) {
          // Large image on the left
          return isLoading ? (
            <Skeleton
              key={index}
              className="col-span-4 row-span-3 h-full w-full rounded-lg"
            />
          ) : (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className="relative col-span-4 row-span-3 h-full w-full cursor-pointer">
                  <ProfileImage
                    handleRemove={handleRemove}
                    index={index}
                    content={content}
                    loading={loading[index]}
                    url={url}
                  />
                </div>
              }
            />
          );
        } else if (index > 0 && index < 4) {
          // Three small images in a column on the right
          return isLoading ? (
            <Skeleton
              key={index}
              className="col-span-2 row-span-1 h-full w-full rounded-lg"
            />
          ) : (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className=" relative col-span-2 row-span-1 h-full w-full cursor-pointer">
                  <ProfileImage
                    handleRemove={handleRemove}
                    index={index}
                    content={content}
                    loading={loading[index]}
                    url={url}
                  />
                </div>
              }
            />
          );
        } else {
          // Two small images in a row at the bottom
          return isLoading ? (
            <Skeleton
              key={index}
              className="col-span-2 row-span-1 h-full w-full rounded-lg"
            />
          ) : (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className=" relative col-span-2 row-span-1 h-full w-full cursor-pointer">
                  <ProfileImage
                    handleRemove={handleRemove}
                    index={index}
                    content={content}
                    loading={loading[index]}
                    url={url}
                  />
                </div>
              }
            />
          );
        }
      })}
    </div>
  );
};

export default ImageGrid;
