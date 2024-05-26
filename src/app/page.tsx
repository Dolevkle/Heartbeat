"use client"

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
// import { api } from "~/trpc/server";
import GlobeShowcase from "./_components/global-showcase";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";



export default function Home() {
  const router = useRouter()
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await getServerAuthSession();


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
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          {/* <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
          The leading AI personality matcher in the world.
          </h2> */}
          <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
          The leading AI personality matcher in the world.
          </p>
          <div className="flex w-full justify-center space-x-12 mt-5">
            <Button onClick={ () => signOut()}>kaki</Button>
          <Button variant="secondary" onClick={ () => signIn('spotify', { callbackUrl: "/signup" })}>Sign Up</Button>
          <Button onClick={() => router.push('/login')}>Log In</Button>
          </div>
        </motion.div>
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

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
