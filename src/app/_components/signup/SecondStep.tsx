"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { Skeleton } from "@components/skeleton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import { Label } from "@components/label";
import { Input } from "@components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { genders, sexualPreferences } from "~/app/consts";
import { Button } from "@components/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { type UseFormReturn } from "react-hook-form";
import { Playlist, TrackItem } from "@spotify/web-api-ts-sdk";
import { api } from "~/trpc/react";

interface Props {
  form: UseFormReturn<{
    playlist: string;
    age: number;
    city: string;
    sexualPreference: string;
    gender: string;
  }>;
  handlePreviousStep: () => void;
}

const ImageGrid = ({ imageUrls }: { imageUrls: string[] }) => {
  // Fallback numbers in case imageUrls is empty or partially filled
  const defaultContent = ["1", "2", "3", "4", "5", "6", "7"];
  const defaultComponent = (content: string) => (
    <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
      <span className="text-4xl">{content}</span>
    </div>
  );
  return (
    <div className="grid max-h-[450px] w-[500px] grid-cols-6 grid-rows-4 gap-4 p-4 ">
      {defaultContent.map((content, index) => {
        const url = imageUrls[index] ?? null;

        if (index === 0) {
          // Large image on the left
          return (
            <div key={index} className="col-span-4 row-span-3">
              {url ? (
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
                  <span className="text-4xl">{content}</span>
                </div>
              )}
            </div>
          );
        } else if (index > 0 && index < 4) {
          // Three small images in a column on the right
          return (
            <div key={index} className="col-span-2 row-span-1">
              {url ? (
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
                  <span className="text-4xl">{content}</span>
                </div>
              )}
            </div>
          );
        } else {
          // Two small images in a row at the bottom
          return (
            <div key={index} className="col-span-2 row-span-1">
              {url ? (
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-white shadow-md">
                  <span className="text-4xl">{content}</span>
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

function FirstStep({ form, handlePreviousStep }: Props) {
  const session = useSession();
  const { data: usersImages, refetch: refetchImages } =
    api.image.findMany.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });
  return (
    <>
      {usersImages && (
        <ImageGrid imageUrls={usersImages?.map((img) => img.url)} />
      )}
      <div className="flex gap-x-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePreviousStep}
        >
          Previous
        </Button>
        <Button type="submit" className="w-full">
          submit
        </Button>
      </div>
    </>
  );
}

export default FirstStep;
