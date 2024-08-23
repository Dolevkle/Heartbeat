import React, { forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../shadcn/dialog";
  import { Card, CardContent } from "../../shadcn/card"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi,
  } from "../../shadcn/carousel";
  
import { api, type RouterOutputs } from "~/trpc/react";
import ProfilePictureDialog from "./ProfilePictureDialog";
import DeleteUserPicture from "./DeleteUserPicture";




const ProfilePictureDisplay: React.FC = () => {
    const session = useSession();
  
    const { data: userDetails } = api.user.findUserById.useQuery(
      session.data?.user?.id ?? "",
      { enabled: !!session.data },
    );

    // const {mutate:  }

    const { data: usersImages} = api.image.findMany.useQuery(
      session.data?.user?.id ?? "",
      { enabled: !!session.data },
    );

    // const { mutate: deleteExistingMatches, isPending: isDeletingMatches } =
    // api.match.deleteMany.useMutation({
    //   onError: () => {
    //     toast({
    //       variant: "destructive",
    //       title: "Uh oh! Something went wrong.",
    //       description: "Could not delete old matches!",
    //     });
    //   },
    // });

return(
  <div>
  <div>
      return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
      {usersImages && usersImages.length > 0 ? (
        usersImages.map((image, index) => (
          <>
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                <Image
                    src={image?.url}
                    width={300}
                    height={300}
                    alt={"could not fetch the picture..."}
                  />
                  {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                </CardContent>
              </Card>
            </div>
            <div>
            <DeleteUserPicture key={index} imageUrl={image.url} />
            </div>
          </CarouselItem>
          </>
        ))
        
      ) : (
        <Image
          src={"https://utfs.io/f/9dc01f95-3ff0-484f-822e-59500be4baeb-x8m314.png"}
          width={300}
          height={300}
          alt={"could not fetch the picture..."}
        />
       )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
  </div>
<div className="relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg">
{/* {session.data?.user.image?(
<Image
  src={session.data.user.image}
  width={300}
  height={300}
  alt={"could not fetch the picture..."}
/>):
<Image
  src={"https://utfs.io/f/90f6ada9-71a5-4ffc-89e3-61e2e96e99e9-iaxihd.png"}
  width={300}
  height={300}
  alt={"could not fetch the picture..."}
/>} */}
<ProfilePictureDialog />
<div className="mt-3 flex items-center justify-center text-xl font-bold">
        {"Profile picture"}
      </div>
</div>
</div>
)}
export default ProfilePictureDisplay