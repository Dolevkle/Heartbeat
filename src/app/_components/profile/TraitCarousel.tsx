import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@components/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import React, { forwardRef, useImperativeHandle } from "react";
import { title } from "process";

const TraitCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className="h-54 w-96 rounded-lg border-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 p-4">{children}</CardContent>
    </Card>
  );
};
const traits = [
  {
    title: "Openness",
    description: `personality trait that involves being curious, imaginative, and open
            to new experiences. People high in openness enjoy exploring new
            ideas, creative activities, and embracing change and variety in
            life.`,
  },
  {
    title: "Neuroticism",
    description: `personality trait that involves a tendency to experience negative
    emotions like anxiety, sadness, and irritability. People high in
    neuroticism may feel stressed or worried more easily and often have
    mood swings.`,
  },
  {
    title: "Extraversion",
    description: `personality trait characterized by a preference for social
    interaction, high energy, and enthusiasm. Extroverts are often
    outgoing, talkative, and enjoy being around people, drawing energy
    from social activities and external environments.`,
  },
  {
    title: "Conscientiousness",
    description: `personality trait that reflects how organized, responsible, and
    dependable a person is. People high in conscientiousness are
    careful, disciplined, and goal-oriented, often excelling in tasks
    that require attention to detail and persistence.`,
  },
  {
    title: "Agreeableness",
    description: `personality trait that reflects how kind, compassionate, and
    cooperative a person is. People high in agreeableness are friendly,
    empathetic, and enjoy helping others, often putting others’ needs
    before their own.`,
  },
];
export interface CarouselHandle {
  setItem: (trait: string) => void;
}

interface Props {}

export default forwardRef<CarouselHandle, Props>(
  function TraitCarousel(props, ref) {
    const [api, setApi] = React.useState<CarouselApi>();

    useImperativeHandle(ref, () => ({
      setItem(trait: string) {
        let index = traits.findIndex((element) => element.title === trait);
        api?.scrollTo(index);
      },
    }));

    return (
      // <Card>
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="flex w-full max-w-sm items-center"
      >
        <CarouselContent>
          {traits.map((trait) => (
            <CarouselItem>
              <TraitCard title={trait.title}>{trait.description}</TraitCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white" />
        <CarouselNext className="text-white" />
      </Carousel>
      // </Card>
    );
  },
);
