import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import React, { forwardRef, useImperativeHandle } from "react";

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
    description: `Driven by curiosity and imagination, people high in openness are always exploring new ideas and creative pursuits. 
    They embrace change and thrive on the thrill of new experiences and the unexpected.`,
  },
  {
    title: "Neuroticism",
    description: `Navigating life’s challenges with heightened sensitivity, people high in neuroticism often feel emotions more intensely. 
    They’re more prone to anxiety, stress, and mood swings, making them attuned to the emotional undercurrents around them.`,
  },
  {
    title: "Extraversion",
    description: `Fueled by social vibes and high energy, extroverts thrive in the spotlight. 
    These people are outgoing, talkative, and draw their spark from being around people and lively environments.`,
  },
  {
    title: "Conscientiousness",
    description: `Always on top of their game, people high in conscientiousness are organized, reliable, and laser-focused. 
    They’re the disciplined go-getters who excel in anything requiring detail and determination.`,
  },
  {
    title: "Agreeableness",
    description: `Naturally warm and compassionate, those high in agreeableness are the friendly, empathetic souls who always have your back. 
    They’re the ones who put others first and make the world a kinder place.`,
  },
];
export interface CarouselHandle {
  setItem: (trait: string) => void;
}

interface Props {}

export default forwardRef<CarouselHandle, Props>(
  function TraitCarousel(_props, ref) {
    const [api, setApi] = React.useState<CarouselApi>();

    useImperativeHandle(ref, () => ({
      setItem(trait: string) {
        let index = traits.findIndex((element) => element.title === trait);
        api?.scrollTo(index);
      },
    }));

    return (
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
    );
  },
);
