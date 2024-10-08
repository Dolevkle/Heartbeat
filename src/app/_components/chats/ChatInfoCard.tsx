import { Carousel, CarouselContent, CarouselItem } from "@components/carousel";
import Image from "next/image";
import { type User, type Image as ImageType } from "@prisma/client";
import { Heart, MapPin, PersonStanding } from "lucide-react";
import { Badge } from "~/app/_components/shadcn/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

interface ChatInfoCardProps {
  user: User;
  images: ImageType[] | undefined;
}

const ChatInfoCard: React.FC<ChatInfoCardProps> = ({ user, images }) => {
  return (
    <div className="col-span-1 col-start-3 row-span-full flex flex-col border-l border-secondary ">
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-full "
        >
          <CarouselContent className={`-mt-1 h-[66vh]`}>
            {images?.map((image, index) => (
              <CarouselItem
                key={index}
                className="flex h-full flex-col justify-center p-1 pt-1 md:basis-full"
              >
                <AspectRatio>
                  <Image
                    src={image.url ?? ""}
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
      <div className=" p-4 font-bold text-white [flex-grow:1]">
        <div className="py-2 text-4xl">{`${user.name}, ${user.age}`}</div>
        <div className="flex items-end py-2 text-2xl">
          <MapPin className="h-8 w-8" />
          {user.city}
        </div>
        <div className="py-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge>
                  {" "}
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
                  {" "}
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
    </div>
  );
};

export default ChatInfoCard;
