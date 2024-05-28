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
import { UploadButton } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const router = useRouter();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });
  const session = useSession();
  const playlistId = form.watch("playlist");
  const { mutate: analyzePersonality } =
    api.openAi.analyzePersonality.useMutation();

  const { data: playlists } = api.spotify.userPlaylists.useQuery(
    {
      id: session.data?.user.spotifyId ?? "",
    },
    {
      enabled: !!session.data,
    },
  );

  const { data: tracks } = api.spotify.tracks.useQuery(
    {
      id: playlistId,
    },
    {
      enabled: !!playlistId,
    },
  );

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (session.data?.user.id && tracks)
      analyzePersonality(
        { songs: tracks.map((track) => track.track.name) },
        {
          onSuccess: (data) => {
            console.log("analysis:", data);
            //TODO add navigation to app
          },
        },
      );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto mt-16 max-w-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              {session.data?.user?.image && (
                <img
                  src={session.data?.user?.image}
                  width={50}
                  height={50}
                  className="rounded-full object-cover "
                  alt="no profile image"
                />
              )}
              <CardTitle className="text-xl">Sign Up</CardTitle>
            </div>

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
                        <FormControl>
                          <Input placeholder="bisexual" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
