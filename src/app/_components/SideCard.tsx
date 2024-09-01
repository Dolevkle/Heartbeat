import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import React from "react";
import { ScrollArea } from "./shadcn/scroll-area";
interface Props {
  children: React.ReactNode;
  title: string;
}
const SideCard = ({ children, title }: Props) => {
  // TODO maybe convert to next.js layout
  return (
    <Card className="flex h-full w-64 flex-col rounded-l-none rounded-r rounded-bl-none border-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ScrollArea>
        <CardContent className="grid min-h-0 gap-8 px-0">
          {children}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default SideCard;
