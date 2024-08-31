import React from "react";
import { Button } from "@components/button";
import { Loader2, X } from "lucide-react";
import { EmptyImageLayout } from "~/app/_components/signup/ImageGrid";

interface Props {
  url: string | null;
  handleRemove: (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    url: string,
    index: number,
  ) => void;
  index: number;
  loading: boolean | undefined;
  content: string;
}

function ProfileImage({ url, handleRemove, index, loading, content }: Props) {
  return (
    <>
      {url ? (
        <>
          <img
            src={url}
            alt={`Image ${index + 1}`}
            className="h-full w-full rounded-lg object-cover shadow-md"
          />

          <Button
            variant="outline"
            className="absolute left-0 top-0 h-fit w-fit rounded-full p-0"
            onClick={(evt) => handleRemove(evt, url, index)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-5 w-5 text-white" />
            )}
          </Button>
        </>
      ) : (
        <EmptyImageLayout content={content} />
      )}
    </>
  );
}

export default ProfileImage;
