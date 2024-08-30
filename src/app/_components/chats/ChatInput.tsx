"use client";
import { Button } from "@components/button";
import { CornerDownLeft, Image } from "lucide-react";
import { Label } from "@components/label";
import { Textarea } from "@components/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import ImageUploadDialog from "./ImageUploadDialog";

export const messageFormSchema = z
  .object({
    message: z.string(),
    imageUrl: z.string(),
  })
  .refine(
    (schema) => {
      return !(schema.imageUrl === "" && schema.message === "");
    },
    { message: "Message can not be empty" },
  );

interface Props {
  chatId: string;
}
export default function ChatInput({ chatId }: Props) {
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
      imageUrl: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const session = useSession();

  const { mutate: createMessage } = api.message.createMessage.useMutation();

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    if (session.data?.user.id) {
      createMessage(
        {
          message: values.message || values.imageUrl,
          chatId: chatId,
          userId: session.data?.user.id,
          isImage: Boolean(values.imageUrl),
        },
        {
          onSuccess: () => {
            void utils.message.getMessages.invalidate();
          },
          onError: () => {
            console.log("Failed to create message");
          },
        },
      );
    }
    form.reset({ message: "", imageUrl: "" });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.code == "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onUpload = (url: string) => {
    form.setValue("imageUrl", url);
    formRef.current?.requestSubmit();
  };

  form.register("imageUrl", { required: false });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative  col-span-2 row-span-1 flex w-full flex-row justify-between overflow-hidden items-center  border-t border-secondary bg-background"
      >
          <ImageUploadDialog
            onUploadSuccess={onUpload}
            uploadEndpoint="chatImageUploader"
            Button={
              <Button variant="outline" size="icon" type="submit" className="ml-3">
                <Image className="size-5 text-white" />
                <span className="sr-only">Attach file</span>
              </Button>
            }
          />
        <FormField
          control={form.control}
          name="message"
          defaultValue=""
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
              </FormLabel>
              <FormControl>
                <Textarea
                  id="message"
                  placeholder="Tune your message..."
                  className="min-h-12 resize-none border-0 p-3 text-white shadow-none focus-visible:ring-0"
                  onKeyDown={onEnter}
                  {...field}
                  required={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center mr-3">

          <Button type="submit" className="ml-auto gap-1.5">
            Send message
            <CornerDownLeft className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}