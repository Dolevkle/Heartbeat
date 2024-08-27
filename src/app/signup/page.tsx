"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/button";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@components/select";
import { Skeleton } from "@components/skeleton";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@components/use-toast";
import { type Personality, userSchema } from "~/app/signup/types";
import { genders, sexualPreferences } from "../consts";
import FirstStep from "~/app/_components/signup/FirstStep";
import SecondStep from "~/app/_components/signup/SecondStep";
import React, { useState } from "react";

export default function SignUp() {
  const session = useSession();

  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  //Retrieves the current values of the form fields being watched.
  const formValues = form.watch();

  const isAnyFieldEmpty = Object.values(formValues).some((value) => !value);

  const { mutate: analyzePersonality, isPending: isAnalyzingPersonality } =
    api.openAi.analyzePersonality.useMutation();

  const { mutate: updateUser, isPending: isUpdatingUser } =
    api.user.update.useMutation({
      /**
       * Callback function to handle successful user creation.
       * It navigates to the profile page and shows a success toast message.
       */
      onSuccess: () => {
        router.push("/profile");
        toast({
          title: "Success",
          description: "User successfully created",
        });
      },
      /**
       * Callback function to handle errors during user creation.
       * It shows a toast message indicating that the user was not created.
       */
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "User was not created!",
        });
      },
    });

  // Fetches the user's playlists from the Spotify API.
  const { data: playlists } = api.spotify.userPlaylists.useQuery(
    { id: session.data?.user.spotifyId ?? "" },
    { enabled: !!session.data },
  );

  // Fetches the tracks from the selected playlist from the Spotify API.
  const { data: tracks } = api.spotify.tracks.useQuery(
    { id: formValues.playlist },
    { enabled: !!formValues.playlist },
  );

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Check if user data and tracks are available
    if (session.data?.user.id && tracks)
      // Analyze personality using OpenAI API
      analyzePersonality(
        { songs: tracks.map((track) => track.track.name) },
        {
          // On successful analysis, update the user with the personality data
          onSuccess: (data) =>
            updateUser({
              id: session.data?.user.id,
              ...values,
              personality: data as Personality,
            }),
          // On error during analysis, show a toast message
          onError: () =>
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "User's personality was not analyzed!",
            }),
        },
      );
  };

  const renderSubmitButtonContent = () => {
    // If there are no empty fields and tracks are available, show a loading spinner
    if (!isAnyFieldEmpty && !tracks)
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

    // If user data is being updated or personality is being analyzed, show a loading spinner with text
    if (isUpdatingUser || isAnalyzingPersonality)
      return (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </div>
      );
    // If none of the above conditions are met, show the default text for the submit button
    return <span>Create an account</span>;
  };

  const handleNextStep = () => setCurrentStep((currentStep) => currentStep + 1);
  const handlePreviousStep = () =>
    setCurrentStep((currentStep) => currentStep - 1);

  const currentStepComponent =
    {
      1: (
        <FirstStep
          form={form}
          playlists={playlists}
          handleNextStep={handleNextStep}
        />
      ),
      2: (
        <SecondStep
          handlePreviousStep={handlePreviousStep}
          submitButtonContent={renderSubmitButtonContent()}
        />
      ),
    }[currentStep] ?? null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto mt-16 w-fit">
          <CardHeader>
            {session.data?.user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={session.data?.user?.image ?? ""}
                  className="rounded-full object-cover "
                  alt="no profile image"
                />
                <CardTitle className="text-xl" data-testid="user name">
                  {session.data?.user?.name}
                </CardTitle>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            )}

            <CardDescription>
              Enter additional information to finish creating an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">{currentStepComponent}</div>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link
                href={`${session.data?.user.personality ? "/profile" : "/"}`}
                className="underline"
              >
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
