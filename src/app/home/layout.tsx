"use client";
import Link from "next/link";
import {
  HeartPulse,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@components/tooltip";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const getLinkClassname = (href: string) =>
    `flex h-9 w-9 items-center justify-center ${isActive(href) ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base" : "rounded-lg text-muted-foreground transition-colors hover:text-foreground"}`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link href="/home" className={getLinkClassname("/home")}>
            <Home className="h-4 w-4" />

            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/home/matches"
                className={getLinkClassname("/home/matches")}
              >
                <HeartPulse className="h-5 w-5" />
                <span className="sr-only">Matches</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Matches</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/home/chats"
                className={getLinkClassname("/home/chats")}
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Chats</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Chats</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex h-screen flex-col sm:gap-4 sm:pl-14">{children}</div>
    </div>
  );
}
