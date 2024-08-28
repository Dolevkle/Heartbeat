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
  const [msgs, setMsgs] = useState(messages);

  useEffect(() => {
    const channel = pusherClient
      .subscribe(chatId)
      .bind(`new-message-chat-${chatId}`, (data) => {
        console.log("test", data);
        if (msgs) setMsgs([...msgs, data]);
        else setMsgs([data]);
      });

    return () => {
      channel.unbind();
    };
  }, []);
  return (
    <ScrollArea>
      <div className="flex flex-1 flex-col p-2">
        {messages?.map(({ senderId, content, id, isImage }, index) => (
          <p
            dir="auto"
            key={id}
            className={`m-1 h-fit w-fit max-w-xs whitespace-pre-wrap rounded-lg p-2 text-white ${senderId === session.data?.user.id ? "self-end bg-primary" : "self-start bg-secondary"}`}
          >
            {isImage ? (
              <Image className="rounded-lg" src={content} width={300} height={300} alt="User image" />
            ) : (
              content
            )}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
