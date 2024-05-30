"use client";
import GlobeShowcase from "./_components/global-showcase";
import { motion } from "framer-motion";
import { Button } from "@components/button";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Vortex } from "~/app/_components/ui/Vortex";
import { CanvasShowcase } from "~/app/_components/canvas-showcase";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const sign = () => signIn("spotify", { callbackUrl: "/signup" });
  const handleLogin = () => {
    if (session.data?.user.personality) router.push("/home");
    else void sign();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex h-full flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Vortex
          baseHue={300}
          rangeY={200}
          className="flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10"
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-white">Heartbeat</span>
          </h1>
          <h2 className="text-center text-xl font-bold text-black dark:text-white md:text-4xl">
            Connecting &nbsp;<span className="text-primary">Hearts</span>&nbsp;
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
            <p className="mx-auto mt-2 max-w-md text-center text-base font-normal text-neutral-700 dark:text-neutral-200 md:text-lg">
              The leading AI personality matcher in the world.
            </p>
            <div className="mt-5 flex w-full justify-center space-x-12">
              <Button variant="secondary" onClick={sign}>
                Sign Up
              </Button>
              <Button onClick={handleLogin}>Log In</Button>
            </div>
          </motion.div>
        </Vortex>

        {/*<GlobeShowcase />*/}
      </div>
      <CanvasShowcase />
    </main>
  );
}
