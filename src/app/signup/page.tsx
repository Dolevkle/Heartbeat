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
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });
  const session = useSession();
  const { mutate } = api.openAi.analyzePersonality.useMutation();
  const { data: playlists } = api.spotify.userPlaylists.useQuery(
    {
      id: session.data?.user.spotifyId ?? "",
    },
    {
      enabled: !!session.data,
    },
  );

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (session.data?.user.id)
      mutate(
        { playlistId: values.playlist },
        {
          onSuccess: (data) => {
            const analysis = data.split(", ");
            console.log("analysis:", analysis);
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
            <CardTitle className="text-xl">Sign Up</CardTitle>
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
                        <Input type="number" placeholder="5" {...field} />
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
