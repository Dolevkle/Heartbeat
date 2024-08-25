import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";
import { UploadIcon } from "lucide-react";
import { Button } from "@components/button";
import ImageUpload from "../../image-uploader";
import { useToast } from "../../shadcn/use-toast";

type ProfilePictureDialogProps = {
  onUploadSuccess: () => void;
};

const ProfilePictureDialog: React.FC<ProfilePictureDialogProps> = ({
  onUploadSuccess,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex h-12 w-12 rounded-full border-none text-white"
          onClick={() => setIsOpen(true)}
        >
          <UploadIcon className="text-2xl" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ImageUpload
          onUploadSuccess={() => {
            onUploadSuccess();
            toast({
              title: "Success",
              description: "Image uploaded successfully",
            });
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureDialog;
