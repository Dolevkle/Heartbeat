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

export default function SignUp() {
  const session = useSession();

  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });
  const { toast } = useToast();

  const formValues = form.watch();

  const isAnyFieldEmpty = Object.values(formValues).some((value) => !value);

  const { mutate: analyzePersonality, isPending: isAnalyzingPersonality } =
    api.openAi.analyzePersonality.useMutation();

  const { mutate: updateUser, isPending: isUpdatingUser } =
    api.user.update.useMutation({
      onSuccess: () => {
        router.push("/home");
        toast({
          title: "Success",
          description: "User successfully created",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "User was not created!",
        });
      },
    });

  const { data: playlists } = api.spotify.userPlaylists.useQuery(
    { id: session.data?.user.spotifyId ?? "" },
    { enabled: !!session.data },
  );

  const { data: tracks } = api.spotify.tracks.useQuery(
    { id: formValues.playlist },
    { enabled: !!formValues.playlist },
  );

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    if (session.data?.user.id && tracks)
      analyzePersonality(
        { songs: tracks.map((track) => track.track.name) },
        {
          onSuccess: (data) =>
            updateUser({
              id: session.data?.user.id,
              ...values,
              personality: data as Personality,
            }),
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
    if (!isAnyFieldEmpty && !tracks)
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    if (isUpdatingUser || isAnalyzingPersonality)
      return (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </div>
      );
    return <span>Create an account</span>;
  };

  const genders = ["male", "female", "non binary"];

  const sexualPreferences = ["male", "female", "both"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto mt-16 max-w-sm">
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
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="age">age</Label>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="18" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="sexualPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="sexualPreference">
                            sexual preference
                          </Label>
                        </FormLabel>
                        <Select
                          data-testid="sexual preference select"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sexualPreferences.map(
                              (sexualPreference, index) => (
                                <SelectItem
                                  key={index}
                                  value={sexualPreference}
                                >
                                  {sexualPreference}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="gender">gender</Label>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genders.map((gender, index) => (
                              <SelectItem key={index} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="playlist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="playlist">playlist</Label>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from your playlists" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {playlists?.map((playlist) => (
                            <SelectItem key={playlist.id} value={playlist.id}>
                              {playlist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isAnyFieldEmpty || !tracks}
              >
                {renderSubmitButtonContent()}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link
                href={`${session.data?.user.personality ? "/home" : "/"}`}
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
