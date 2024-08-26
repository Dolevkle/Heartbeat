import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@components/dialog";
import { PenSquareIcon } from "lucide-react";
import ImageUpload from "@components/../image-uploader";

interface ImageUploadDialogProps {
  onUploadSuccess: (url: string) => void;
  uploadEndpoint:string;
  Button: ReactNode;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  onUploadSuccess,
  Button,
  uploadEndpoint
}: ImageUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUploadSuccess = (url: string) => {
    onUploadSuccess(url); // Call the parent's function
    setIsOpen(false); // Close the dialog
  };

  const handleUploadSuccess = (url: string) => {
    onUploadSuccess(url); // Call the parent's function
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Button}</DialogTrigger>
      <DialogTrigger asChild>{Button}</DialogTrigger>
      <DialogContent>
        <ImageUpload onUploadSuccess={handleUploadSuccess} uploadEndpoint={uploadEndpoint} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
