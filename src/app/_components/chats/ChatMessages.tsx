import { type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher";
import Image from "next/image";
import { ScrollArea } from "../shadcn/scroll-area";

interface Props {
  messages: RouterOutputs["message"]["getMessages"] | undefined;
  chatId: string;
}

export default function ChatMessages({ messages, chatId }: Props) {
  const session = useSession();
  const [msgs, setMsgs] = useState<
    RouterOutputs["message"]["getMessages"] | undefined
  >(messages);
  const updateMessages = (data) => {
    console.log("test", data);
    console.log
    if (data.content) setMsgs([...(msgs || []), data]);
    else setMsgs([...(msgs || [])]);
  };

  useEffect(() => {
    const channel = pusherClient
      .subscribe(chatId)
      .bind(`new-message-chat-${chatId}`, updateMessages);

    return () => {
      channel.unbind();
    };
  }, [msgs]);

  return (
    <ScrollArea className="row-span-10 col-span-2">
      <div className="flex flex-1 flex-col p-2">
        {msgs?.map(({ senderId, content, id, isImage }, index) => (
          <p
            dir="auto"
            key={id}
            className={`m-1 h-fit w-fit max-w-xs whitespace-pre-wrap rounded-lg p-2 text-white ${senderId === session.data?.user.id ? "self-end bg-primary" : "self-start bg-secondary"}`}
          >
            {isImage ? (
              <Image
                className="rounded-lg"
                src={content}
                width={300}
                height={300}
                alt="User image"
              />
            ) : (
              content
            )}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
