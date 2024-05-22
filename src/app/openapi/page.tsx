"use client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import axios from "axios";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { env } from "~/env";
import { useState } from "react";

const userSchema = z.object({
  genre: z.string().min(1, { message: "genre cannot be empty" }), // Ensures the first name is not empty
  songs: z.string().array().max(3, { message: "cannot be more than 3" }), // Ensures the last name is not empty
});

export default function Poc() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      songs: [" "],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "songs" as never,
  });

  const [personality, setPersonality] = useState<string[]>([]);

  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const analyzePerson = async (
    genre: string,
    songs: string[],
  ): Promise<string> => {
    // TODO keep in mind this costs money we will need to change the api key sometime
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you need to analyze users. if user give you a music genre and 3 songs your return scores about him in the following format: Openness: low/medium/high, Conscientiousness:  low/ medium/high, extraversion:  low/ medium/high, agreeableness:  low/ medium/high,neuroticism:  low/ medium/high. return without additional info",
        },
        { role: "user", content: `genre: ${genre} songs: ${songs.join(", ")}` },
      ],
      temperature: 0.7,
    };

    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.NEXT_PUBLIC_OPEN_API_KEY}`, // Replace with your OpenAI API key
      },
    });

    return response.data.choices[0].message.content as string;
  };

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    const content = await analyzePerson(values.genre, values.songs);
    setPersonality(content.split(","));
  };

  const songs = form.watch("songs");

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mx-auto mt-16 max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>Enter your perferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="genre">Genre</Label>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="rock" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name={`songs.${index}`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              <Label htmlFor="song">Song</Label>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => append(" ")}
                        className="self-end"
                        disabled={
                          songs.length > index + 1 || songs.length === 3
                        }
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full">
                  Analyze
                </Button>
              </div>
            </CardContent>
            <div className="flex flex-col items-center">
              {personality.map((field, index) => (
                <span key={index}>{field}</span>
              ))}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
