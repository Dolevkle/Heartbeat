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

  const onDrop = React.useCallback(
    (acceptedFile: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFile[0]);
        form.setValue("image", acceptedFile[0]);
        form.clearErrors("image");
      } catch (error) {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form],
  );
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
    {/* <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto md:w-1/2">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  Upload your image
                  <span
                    className={
                      form.formState.errors.image || fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  ></span>
                </h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
                >
                  {preview && (
                    <img
                      src={preview as string}
                      alt="Uploaded image"
                      className="max-h-[400px] rounded-lg"
                    />
                  )}
                  <ImagePlus
                    className={`size-40 ${preview ? "hidden" : "block"}`}
                  />
                  <Input {...getInputProps()} type="file" />
                  {isDragActive ? (
                    <p>Drop the image!</p>
                  ) : (
                    <p>Click here or drag an image to upload it</p>
                  )}
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than 1MB and of type png, jpg, or jpeg
                  </p>
                )}
              </FormMessage>
            </FormItem> */}
          {/* )} */}
        {/* /> */}
        {/* <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
        >
          Submit
        </Button> */}
        <ImageUpload/>
      {/* </form>
    </Form> */}
        </DialogContent>
    </Dialog>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    //     <FormField
    //       control={form.control}
    //       name="image"
    //       render={() => (
    //         <FormItem className="mx-auto md:w-1/2">
    //           <FormLabel
    //             className={`${
    //               fileRejections.length !== 0 && "text-destructive"
    //             }`}
    //           >
    //             <h2 className="text-xl font-semibold tracking-tight">
    //               Upload your image
    //               <span
    //                 className={
    //                   form.formState.errors.image || fileRejections.length !== 0
    //                     ? "text-destructive"
    //                     : "text-muted-foreground"
    //                 }
    //               ></span>
    //             </h2>
    //           </FormLabel>
    //           <FormControl>
    //             <div
    //               {...getRootProps()}
    //               className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
    //             >
    //               {preview && (
    //                 <img
    //                   src={preview as string}
    //                   alt="Uploaded image"
    //                   className="max-h-[400px] rounded-lg"
    //                 />
    //               )}
    //               <ImagePlus
    //                 className={`size-40 ${preview ? "hidden" : "block"}`}
    //               />
    //               <Input {...getInputProps()} type="file" />
    //               {isDragActive ? (
    //                 <p>Drop the image!</p>
    //               ) : (
    //                 <p>Click here or drag an image to upload it</p>
    //               )}
    //             </div>
    //           </FormControl>
    //           <FormMessage>
    //             {fileRejections.length !== 0 && (
    //               <p>
    //                 Image must be less than 1MB and of type png, jpg, or jpeg
    //               </p>
    //             )}
    //           </FormMessage>
    //         </FormItem>
    //       )}
    //     />
    //     <Button
    //       type="submit"
    //       disabled={form.formState.isSubmitting}
    //       className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
    //     >
    //       Submit
    //     </Button>
    //   </form>
    // </Form>
  );
};
export default ProfilePictureDialog;