import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import React from "react";
interface Props {
  children: React.ReactNode;
  title: string;
}
const SideCard = ({ children, title }: Props) => {
  // TODO maybe convert to next.js layout
  return (
    <Card className="h-full w-64 rounded-l-none rounded-r rounded-bl-none border-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">{children}</CardContent>
    </Card>
  );
};

export default SideCard;
