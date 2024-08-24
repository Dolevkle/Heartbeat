import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../shadcn/dialog";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@components/button";
import ImageUpload from "../../image-uploader";

type ProfilePictureDialogProps = {
  onUploadSuccess: (url: string) => void;
};

const ProfilePictureDialog: React.FC<ProfilePictureDialogProps> = ({ onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="relative left-1/2 flex h-12 w-12 -translate-x-1/2 transform rounded-full border-none text-white"
          onClick={() => setIsOpen(true)}
        >
          <PenSquareIcon className="text-2xl" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ImageUpload onUploadSuccess={(url) => {
          onUploadSuccess(url); // Call the parent's function
          setIsOpen(false); // Close the dialog
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureDialog;