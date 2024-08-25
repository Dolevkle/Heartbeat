"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/tooltip";
import { Button } from "@components/button";
import { CornerDownLeft, ImageUp, Paperclip } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
      imageUrl: "",
    },
  });

  const session = useSession();

  const { mutate: createMessage, isPending } =
    api.message.createMessage.useMutation();

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    debugger;
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
          onError: (data) => {
            console.log("Failed to create message");
          },
        },
      );
    }
    form.reset({ message: "", imageUrl: "" });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.code == "Enter" && e.shiftKey == false) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onUpload = (url: string) => {
    form.setValue("imageUrl", url);
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    form.register("imageUrl", { required: false });
  }, [form.register]);



  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex min-h-28 w-full flex-row justify-between overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <FormField
          control={form.control}
          name="message"
          defaultValue=""
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem className="h-full w-5/6">
              <FormLabel>
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
              </FormLabel>
              <FormControl>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="h-full min-h-12 resize-none border-0 p-3 text-white shadow-none focus-visible:ring-0"
                  onKeyDown={onEnter}
                  {...field}
                  required={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mr-3 flex flex-col justify-around">
          <ImageUploadDialog
            onUploadSuccess={onUpload}
            Button={
              <Button
                variant="secondary"
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
              >
                upload image
                <ImageUp className="size-3.5" />
              </Button>
            }
          />

          <Button type="submit" size="lg" className="ml-auto w-full gap-1.5">
            Send
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
