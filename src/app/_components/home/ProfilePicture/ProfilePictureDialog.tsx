import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";
import { UploadIcon } from "lucide-react";
import { Button } from "@components/button";
import ImageUpload from "../../image-uploader";
import { useToast } from "../../shadcn/use-toast";

type ProfilePictureDialogProps = {
  onUploadSuccess: () => void;
  trigger: React.ReactElement;
};

const ProfilePictureDialog: React.FC<ProfilePictureDialogProps> = ({
  onUploadSuccess,
  trigger,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleUploadSuccess = () => {
    onUploadSuccess();
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {React.cloneElement(trigger, {
          onClick: () => setIsOpen(true),
        })}
      </DialogTrigger>
      <DialogContent>
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureDialog;
