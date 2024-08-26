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
import ImageGrid from "~/app/_components/signup/ImageGrid";

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

function SecondStep({ form, handlePreviousStep }: Props) {
  const session = useSession();
  const { data: usersImages, refetch: refetchImages } =
    api.image.findMany.useQuery(session.data?.user?.id ?? "", {
      enabled: !!session.data,
    });

  return (
    <>
      {usersImages && (
        <ImageGrid
          imageUrls={usersImages?.map((img) => img.url)}
          refetchImages={refetchImages}
        />
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

export default SecondStep;
