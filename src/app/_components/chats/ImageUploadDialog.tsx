import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@components/dialog";
import { PenSquareIcon } from "lucide-react";
import ImageUpload from "@components/../image-uploader";

interface ImageUploadDialogProps {
  onUploadSuccess: (url: string) => void;
  Button : ReactNode
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  onUploadSuccess,
  Button
}: ImageUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      {Button}
      </DialogTrigger>
      <DialogContent>
        <ImageUpload
          onUploadSuccess={(url) => {
            onUploadSuccess(url); // Call the parent's function
            setIsOpen(false); // Close the dialog
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
