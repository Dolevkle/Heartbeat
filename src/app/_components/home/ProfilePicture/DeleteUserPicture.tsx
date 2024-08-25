import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@components/button";
import { imageRemove } from "~/app/actions/imageRemove";
import { api } from "~/trpc/react";
import { useToast } from "../../shadcn/use-toast";

type DeleteUserPictureProps = {
  imageUrl: string;
  onDeleteSuccess: () => void; 
};

const DeleteUserPicture: React.FC<DeleteUserPictureProps> = ({
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { mutate: deleteImage } = api.image.deleteOne.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      setLoading(false);
      onDeleteSuccess(); 
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
      className="flex h-12 w-12 rounded-full border-none text-white"
      onClick={handleRemove}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="text-2xl" />
      )}
    </Button>
  );
};

export default DeleteUserPicture;
