import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import React from "react";

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

export default function TraitCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        <CarouselItem>
          <TraitCard title="Openness">
            personality trait that involves being curious, imaginative, and open
            to new experiences. People high in openness enjoy exploring new
            ideas, creative activities, and embracing change and variety in
            life.
          </TraitCard>
        </CarouselItem>
        <CarouselItem>
          <TraitCard title="Neuroticism">
            personality trait that involves a tendency to experience negative
            emotions like anxiety, sadness, and irritability. People high in
            neuroticism may feel stressed or worried more easily and often have
            mood swings.
          </TraitCard>
        </CarouselItem>
        <CarouselItem>
          <TraitCard title="Extraversion">
            personality trait characterized by a preference for social
            interaction, high energy, and enthusiasm. Extroverts are often
            outgoing, talkative, and enjoy being around people, drawing energy
            from social activities and external environments.
          </TraitCard>
        </CarouselItem>
        <CarouselItem>
          <TraitCard title="Conscientiousness">
            personality trait that reflects how organized, responsible, and
            dependable a person is. People high in conscientiousness are
            careful, disciplined, and goal-oriented, often excelling in tasks
            that require attention to detail and persistence.
          </TraitCard>
        </CarouselItem>
        <CarouselItem>
          <TraitCard title="Agreeableness">
            personality trait that reflects how kind, compassionate, and
            cooperative a person is. People high in agreeableness are friendly,
            empathetic, and enjoy helping others, often putting others’ needs
            before their own.
          </TraitCard>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="text-white" />
      <CarouselNext className="text-white" />
    </Carousel>
  );
}
