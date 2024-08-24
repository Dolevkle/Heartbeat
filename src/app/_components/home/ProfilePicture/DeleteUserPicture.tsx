import React, { useState } from "react";
import { Loader2, CircleX } from "lucide-react";
import { Button } from "@components/button";
import { imageRemove } from "~/app/actions/imageRemove";
import { api } from "~/trpc/react";
import { useToast } from "../../shadcn/use-toast";
import { useSession } from "next-auth/react";

type DeleteUserPictureProps = {
  imageUrl: string;
  onDeleteSuccess: () => void; // New prop for callback
};

const DeleteUserPicture: React.FC<DeleteUserPictureProps> = ({ imageUrl, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const { mutate: deleteImage } = api.image.deleteOne.useMutation({
    onMutate: () => {
      toast({
        title: "Deleting",
        description: "Deleting picture",
      });
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      setLoading(false);
      onDeleteSuccess(); // Call the callback on success
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Uh oh! Something went wrong.",
      });
      setLoading(false);
    },
  });

  const handleRemove = async () => {
    setLoading(true); // Start loading
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    const res = await imageRemove(imageKey);
    if (res.success) {
      deleteImage(imageUrl);
    }
  };

  return (
    <Button
      className="relative left-1/2 flex h-12 w-12 -translate-x-1/2 transform rounded-full border-none text-white"
      onClick={handleRemove}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CircleX className="text-2xl" />
      )}
    </Button>
  );
};

export default DeleteUserPicture;