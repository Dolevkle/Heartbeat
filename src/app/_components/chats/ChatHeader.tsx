"use client";
import { Card, CardHeader } from "@components/card";
import UserCard from "~/app/_components/UserCard";
import { type User } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/sheet";
import { Heart, MapPin, PersonStanding } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";
import { Badge } from "@components/badge";
import { Carousel, CarouselContent, CarouselItem } from "@components/carousel";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

interface Props {
  user: User;
  images: string[];
}
export default function ChatHeader({ user, images }: Props) {
  const image = images? images[0] :null
  return (
    <Card className="col-span-2 row-span-1 w-full rounded-none border-0 border-b border-secondary">
      <CardHeader className={" p-0"}>
        <Sheet>
          <SheetTrigger asChild>
            <UserCard user={user} imageUrl={image} />
          </SheetTrigger>
          <SheetContent
            className="border-none"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div>
              <Carousel
                opts={{
                  align: "start",
                }}
                orientation="vertical"
                className="w-full "
              >
                <CarouselContent className={`-mt-1 h-[66vh]`}>
                  {images.map((url, index) => (
                    <CarouselItem
                      key={index}
                      className="flex h-full flex-col justify-center p-1 pt-1 md:basis-full"
                    >
                      <AspectRatio>
                        <Image
                          src={url ?? ""}
                          alt={`Photo of ${user?.name}`}
                          objectFit="cover"
                          className="rounded-lg	"
                          fill
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <SheetHeader>
              <div className=" p-4 font-bold text-white [flex-grow:1]">
                <SheetTitle className="py-2 text-4xl">{`${user.name}, ${user.age}`}</SheetTitle>
                <div className="flex items-end py-2 text-2xl">
                  <MapPin className="h-8 w-8" />
                  {user.city}
                </div>
                <div className="py-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge>
                          <PersonStanding className="mr-1" />
                          {user.gender}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gender</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="ml-2">
                          <Heart className="mr-1" />
                          {user.sexualPreference}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sexual Preference</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </CardHeader>
    </Card>
  );
}
