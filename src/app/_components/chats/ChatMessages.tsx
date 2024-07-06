import { type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";

interface Props {
  messages: RouterOutputs["message"]["getMessages"] | undefined;
}

export default function ChatMessages({ messages }: Props) {
  const session = useSession();
  return (
    <div className="flex flex-1 flex-col p-2">
      {messages?.map(({ senderId, content, id }) => (
        <div
          key={id}
          className={`m-1 h-fit w-fit max-w-xs rounded-lg p-2 text-white ${senderId === session.data?.user.id ? "self-end bg-primary" : "self-start bg-secondary"}`}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
