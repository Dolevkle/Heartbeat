import React from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
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
import ProfilePictureDialog from "./ProfilePictureDialog";


const ProfilePictureDisplay: React.FC = () => {
    const session = useSession();
  
    const { data: userDetails } = api.user.findUserById.useQuery(
      session.data?.user?.id ?? "",
      { enabled: !!session.data },
    );


return(
<div className="relative max-w-sm overflow-hidden rounded p-4 text-white shadow-lg">
<Image
  src={"https://utfs.io/f/90f6ada9-71a5-4ffc-89e3-61e2e96e99e9-iaxihd.png"}
  width={300}
  height={300}
  alt={"could not fetch the picture..."}
/>
<ProfilePictureDialog />
<div className="mt-3 flex items-center justify-center text-xl font-bold">
        {"Profile picture"}
      </div>
</div>
)}
export default ProfilePictureDisplay