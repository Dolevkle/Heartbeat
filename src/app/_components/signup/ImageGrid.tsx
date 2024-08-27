import React from "react";
import ProfilePictureDialog from "~/app/_components/home/ProfilePicture/ProfilePictureDialog";

const EmptyImageLayout = ({ content }: { content: string }) => (
  <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
    <span className="text-4xl">{content}</span>
  </div>
);

const ImageGrid = ({
  imageUrls,
  refetchImages,
}: {
  imageUrls: string[];
  refetchImages: () => void;
}) => {
  // Fallback numbers in case imageUrls is empty or partially filled
  const defaultContent = ["1", "2", "3", "4", "5", "6", "7"];

  return (
    <div className="grid max-h-[500px] max-w-[500px] grid-cols-6 grid-rows-4 gap-4 p-4 ">
      {defaultContent.map((content, index) => {
        const url = imageUrls[index] ?? null;

        if (index === 0) {
          // Large image on the left
          return (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className="col-span-4 row-span-3 cursor-pointer">
                  {url ? (
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover shadow-md"
                    />
                  ) : (
                    <EmptyImageLayout content={content} />
                  )}
                </div>
              }
            />
          );
        } else if (index > 0 && index < 4) {
          // Three small images in a column on the right
          return (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className="col-span-2 row-span-1 cursor-pointer">
                  {url ? (
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover shadow-md"
                    />
                  ) : (
                    <EmptyImageLayout content={content} />
                  )}
                </div>
              }
            />
          );
        } else {
          // Two small images in a row at the bottom
          return (
            <ProfilePictureDialog
              key={index}
              onUploadSuccess={refetchImages}
              trigger={
                <div className="col-span-2 row-span-1 cursor-pointer">
                  {url ? (
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover shadow-md"
                    />
                  ) : (
                    <EmptyImageLayout content={content} />
                  )}
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
