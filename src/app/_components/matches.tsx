import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Sparkles } from "lucide-react";

export default function Component() {
  return (
    <Card className="h-full w-fit rounded-l-none rounded-r rounded-bl-none border-card">
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3 font-medium">
            <Sparkles className="h-4 w-4" />
            <span>85%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Jackson Lee</p>
            <p className="text-sm text-muted-foreground">
              jackson.lee@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">20%</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
            <p className="text-sm text-muted-foreground">
              isabella.nguyen@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">30%</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/04.png" alt="Avatar" />
            <AvatarFallback>WK</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">William Kim</p>
            <p className="text-sm text-muted-foreground">will@email.com</p>
          </div>
          <div className="ml-auto flex space-x-3 font-medium">
            <Sparkles className="h-4 w-4" />
            <span> 99%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/05.png" alt="Avatar" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <p className="text-sm text-muted-foreground">
              sofia.davis@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">48%</div>
        </div>
      </CardContent>
    </Card>
  );
}
