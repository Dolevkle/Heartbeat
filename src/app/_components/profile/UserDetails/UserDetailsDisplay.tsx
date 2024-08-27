import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import DetailsEditDialog from "./DetailsEditDialog";
import ProfilePictureDisplay from "~/app/_components/home/ProfilePicture/ProfilePictureDisplay";

const UserDetailsDisplay: React.FC = () => {
  const session = useSession();

  const { data: userDetails } = api.user.findUserById.useQuery(
    session.data?.user?.id ?? "",
    { enabled: !!session.data },
  );

  const facts = [
    `I live in ${userDetails?.city}`,
    `I am a ${userDetails?.gender}.`,
    `I am looking for a ${userDetails?.sexualPreference}!`,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${userDetails?.name}, ${userDetails?.age}`}</CardTitle>
        <CardDescription>{userDetails?.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            {facts.map((fact, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{fact}</p>
                </div>
              </div>
            ))}
          </div>
          <ProfilePictureDisplay />
        </div>
      </CardContent>
      <CardFooter>
        <DetailsEditDialog />
      </CardFooter>
    </Card>
  );
};

export default UserDetailsDisplay;
