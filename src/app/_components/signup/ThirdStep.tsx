"use client";

import React from "react";
import { Button } from "@components/button";
import { useSession } from "next-auth/react";

interface Props {
  handlePreviousStep: () => void;
  submitButtonContent: React.ReactElement;
}

function SecondStep({ handlePreviousStep, submitButtonContent }: Props) {
  return (
    <div className="max-w-[400px]">
      <h2 className="mb-4 text-lg font-semibold">Your music speaks volumes.</h2>
      <p className="mb-4">
        At Heartbeat, your music taste isn’t just a preference, it’s a window
        into your personality. We use your playlist to craft a unique
        personality profile using:
      </p>
      <span className="mb-4 text-lg">Big Five traits</span>
      <ul className="mb-4 list-disc space-y-2 pl-6">
        <li>Openness: Embrace new experiences.</li>
        <li>Conscientiousness: Precision and reliability.</li>
        <li>Extraversion: Energy and social connection.</li>
        <li>Agreeableness: Compassion and kindness.</li>
        <li>Neuroticism: Emotional balance.</li>
      </ul>
      <p className="mb-4">
        Our AI blends these insights with your musical vibe, crafting matches
        that resonate deeply.
      </p>
      <span>
        It’s not just about similar tastes ,It is about connecting souls.
      </span>
      <p className="my-4 text-center text-xl font-semibold">
        Your perfect match is in the next song.
      </p>
      <div className="flex gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePreviousStep}
        >
          Previous
        </Button>
        <Button type="submit" className="w-full">
          {submitButtonContent}
        </Button>
      </div>
    </div>
  );
}

export default SecondStep;
