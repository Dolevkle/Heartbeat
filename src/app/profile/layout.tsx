"use client";
import Link from "next/link";
import {
  HeartPulse,
  LogOut,
  UserRound,
  MessageCircleHeart,
  Bell,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/tooltip";
import { usePathname } from "next/navigation";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@components/use-toast";
import { api } from "~/trpc/react";
import { Badge } from "@components/badge";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const session = useSession();

  const { data } = api.notification.getNotifications.useQuery(
    { userId: session.data?.user.id ?? "" },
    {
      enabled: !!session.data,
      refetchInterval: 30000, // every minute
    },
  );

  const notifications = data?.notifications.length;

  const isActive = (href: string) => pathname === href;

  const getLinkClassname = (href: string) =>
    `relative flex h-9 w-9 items-center justify-center ${isActive(href) ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base" : "rounded-lg text-muted-foreground transition-colors hover:text-foreground"}`;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error during logout",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile/matches"
                className={getLinkClassname("/profile/matches")}
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
                href="/profile/chats"
                className={getLinkClassname("/profile/chats")}
              >
                <MessageCircleHeart className="h-5 w-5" />
                <span className="sr-only">Chats</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Chats</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/profile" className={getLinkClassname("/profile")}>
                <UserRound className="h-5 w-5" />
                <span className="sr-only">Acme Inc</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile/notifications"
                className={getLinkClassname("/profile/notifications")}
              >
                <>
                  <Badge
                    className="absolute -right-2 -top-2  flex h-5 w-5 justify-center rounded-full text-center"
                    variant="secondary"
                  >
                    {notifications}
                  </Badge>
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Notifications</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex h-screen flex-col sm:gap-4 sm:pl-14">{children}</div>
    </div>
  );
}
