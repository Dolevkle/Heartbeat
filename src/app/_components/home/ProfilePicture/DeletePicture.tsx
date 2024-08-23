"use-client";
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/dialog";
import { PenSquareIcon } from "lucide-react";
import { Input } from "../../shadcn/input";
import { Button } from "@components/button";
import { ImagePlus } from "lucide-react";
import { useToast } from "../../shadcn/use-toast";
import ImageUpload from "../../image-uploader";

 const ProfilePictureDialog: React.FC = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

  const formSchema = z.object({
    image: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const { toast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // toast.success(`Image uploaded successfully 🎉 ${values.image.name}`);
  };

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
        </DialogContent>
    </Dialog>
  );
};
export default ProfilePictureDialog;