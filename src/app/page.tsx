import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import GlobeShowcase from "./_components/GlobeShowcase";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-white">Heartbeat</span>
        </h1>
        <h2 className="text-center text-xl font-bold text-black dark:text-white md:text-4xl">
          Connecting
          &nbsp;<span className="text-primary">Hearts</span>&nbsp;
           with music worldwide
        </h2>
        {/* <h3 className="mx-auto mt-2 max-w-md text-center text-base font-normal text-neutral-700 dark:text-neutral-200 md:text-lg">
          The leading AI personality matcher in the world.
        </h3> */}
        {/* <div className="flex w-52 justify-between">
          <Button variant="secondary">Sign Up</Button>
          <Button>Log In</Button>
        </div> */}
        <GlobeShowcase />
        {/* <CrudShowcase /> */}
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
