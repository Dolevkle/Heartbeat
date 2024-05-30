"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { ToastAction } from "@components/toast";
type Personality = {
  Openness: string;
  Neuroticism: string;
  Extraversion: string;
  Conscientiousness: string;
  Agreeableness: string;
};

interface CreateUserPayload extends z.infer<typeof userSchema> {
  id: string;
  personality: Personality;
}

const userSchema = z.object({
  age: z.coerce
    .number()
    .min(1, { message: "Invalid age below" })
    .max(120, "Invalid age, above limit"), // Validates the string as an email
  sexualPreference: z
    .string()
    .min(1, { message: "sexual preference cannot be empty" }), // Ensures the first name is not empty
  gender: z.string().min(1, { message: "gender cannot be empty" }), // Ensures the last name is not empty
  playlist: z.string(),
});

export default function SignUp() {
  const session = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });
  const { toast } = useToast();

  const playlistId = form.watch("playlist");
  const { mutate: analyzePersonality, isPending: isAnalyzingPersonality } =
    api.openAi.analyzePersonality.useMutation();

  const { mutate: updateUser, isPending: isUpdatingUser } =
    api.user.update.useMutation();

  const { data: playlists } = api.spotify.userPlaylists.useQuery(
    { id: session.data?.user.spotifyId ?? "" },
    { enabled: !!session.data },
  );

  const { data: tracks } = api.spotify.tracks.useQuery(
    { id: playlistId },
    { enabled: !!playlistId },
  );

  const formValues = form.watch();

  const isAnyFieldEmpty = Object.values(formValues).some((value) => !value);

  const handleCreateUser = (payload: CreateUserPayload) => {
    updateUser(payload, {
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
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  };

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (session.data?.user.id && tracks)
      analyzePersonality(
        { songs: tracks.map((track) => track.track.name) },
        {
          onSuccess: (data) =>
            handleCreateUser({
              id: session.data?.user.id,
              ...values,
              personality: data as Personality,
            }),
          onError: () =>
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "User's personality was not analayzed!",
            }),
        },
      );
  };

  const renderSubmitButtonContent = () => {
    if (!isAnyFieldEmpty && !tracks)
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    if (isUpdatingUser || isAnalyzingPersonality)
      return (
        <div className="flex">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </div>
      );
    {
      return <span>Create an account</span>;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto mt-16 max-w-sm">
          <CardHeader>
            {session.data?.user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={session.data?.user?.image ?? ""}
                  width={50}
                  height={50}
                  className="rounded-full object-cover "
                  alt="no profile image"
                />
                <CardTitle className="text-xl">
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">male</SelectItem>
                            <SelectItem value="female">female</SelectItem>
                            <SelectItem value="both">both</SelectItem>
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
                            <SelectItem value="male">male</SelectItem>
                            <SelectItem value="female">female</SelectItem>
                            <SelectItem value="non binary">
                              non binary
                            </SelectItem>
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
              {/*<UploadButton*/}
              {/*  className="w-full ut-button:w-full ut-button:bg-secondary ut-button:ut-readying:bg-secondary"*/}
              {/*  endpoint="imageUploader"*/}
              {/*  content={{*/}
              {/*    button({ ready }) {*/}
              {/*      if (ready) return <div>Upload image</div>;*/}

              {/*      return "loading...";*/}
              {/*    },*/}
              {/*    allowedContent({ ready, fileTypes, isUploading }) {*/}
              {/*      // if (!ready) return "Checking what you allow";*/}
              {/*      if (isUploading) return "uploading the profile picture";*/}
              {/*      return "";*/}
              {/*      // return `Stuff you can upload: ${fileTypes.join(", ")}`;*/}
              {/*    },*/}
              {/*  }}*/}
              {/*  onClientUploadComplete={(res) => {*/}
              {/*    // Do something with the response*/}
              {/*    router.refresh();*/}
              {/*    console.log("Files: ", res);*/}
              {/*    alert("Upload Completed");*/}
              {/*  }}*/}
              {/*  onUploadError={(error: Error) => {*/}
              {/*    // Do something with the error.*/}
              {/*    alert(`ERROR! ${error.message}`);*/}
              {/*  }}*/}
              {/*/>*/}
              <Button
                type="submit"
                className="w-full"
                disabled={isAnyFieldEmpty || !tracks}
              >
                {renderSubmitButtonContent()}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
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
