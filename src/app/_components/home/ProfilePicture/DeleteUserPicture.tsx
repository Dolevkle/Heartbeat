"use-client";
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Loader2 } from "lucide-react"
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
import {CircleX  } from "lucide-react";
import { LoadingButton } from '../../loading-button';
import { Button } from "@components/button";
import { imageRemove } from "~/app/actions/imageRemove";
import { api } from "~/trpc/react";
import { useToast } from "../../shadcn/use-toast";
import { useSession } from "next-auth/react";







type DeleteUserPictureProps = {
  imageUrl: string;
};


 const DeleteUserPicture: React.FC<DeleteUserPictureProps>= ({imageUrl}) => {

  const [loading, setLoading] = useState(false);

  const session = useSession();
  const { update: updateSession } = useSession();
  const { toast } = useToast();


  const {mutate: deleteImage, isPending: isImageRemoved} =
    api.image.deleteOne.useMutation({
      onMutate: () =>{
        toast({
          title:"Deleting",
          description:"Deleting picture",
        })
      },
      onSuccess: async () =>{
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        await updateSession();
      },
      
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Uh oh! Something went wrong.",
        });
      },
    })


    
  const handleRemove =async ()=>{
    setLoading(true); // Start loading

    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    const res = await imageRemove(imageKey);
    if (res.success)
    {
      deleteImage(imageUrl)
      alert("file removed");
    }
    console.log("kaki ")
  }


  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog>

        <Button 
          className="relative left-1/2 flex h-12 w-12 -translate-x-1/2 transform rounded-full border-none text-white"
          onClick={handleRemove}
          disabled = {loading}
        >
          {loading? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </> 
          ):(
            <CircleX className="text-2xl" />
          )}
        </Button>
    <DialogContent>
        </DialogContent>
    </Dialog>
  );
};
export default DeleteUserPicture;