"use client";

import React from "react";
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
import { useSession } from "next-auth/react";
import { type UseFormReturn } from "react-hook-form";
import { type Playlist, type TrackItem } from "@spotify/web-api-ts-sdk";

interface Props {
  form: UseFormReturn<{
    playlist: string;
    age: number;
    city: string;
    sexualPreference: string;
    gender: string;
  }>;
  playlists: Playlist<TrackItem>[] | undefined;
  handleNextStep: () => void;
  isAnyFieldEmpty: boolean;
}
function FirstStep({
  form,
  playlists,
  handleNextStep,
  isAnyFieldEmpty,
}: Props) {
  useSession();
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
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
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor="city">City</Label>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="sexualPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor="sexualPreference">sexual preference</Label>
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
                    {sexualPreferences.map((sexualPreference, index) => (
                      <SelectItem key={index} value={sexualPreference}>
                        {sexualPreference}
                      </SelectItem>
                    ))}
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
                <Label htmlFor="playlist">Playlist</Label>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        className="w-full"
        onClick={handleNextStep}
        disabled={isAnyFieldEmpty}
      >
        Continue
      </Button>
    </>
  );
}

export default FirstStep;
