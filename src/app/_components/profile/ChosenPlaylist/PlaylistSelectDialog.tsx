import React, { useState } from "react";
import { PenSquareIcon } from "lucide-react";
import { Button } from "@components/button";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/dialog";
import { Label } from "@components/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { useToast } from "@components/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Personality, userSchema } from "~/app/signup/types";
import { type z } from "zod";
import { Loader2 } from "lucide-react";

const PlaylistSelectDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const { update: updateSession } = useSession();

  const playlistSchema = userSchema.pick({
    playlist: true,
  });

  const form = useForm<z.infer<typeof playlistSchema>>({
    resolver: zodResolver(playlistSchema),
  });

  const { toast } = useToast();

  const formValues = form.watch();

  const isAnyFieldEmpty = Object.values(formValues).some((value) => !value);

  const { mutate: analyzePersonality, isPending: isAnalyzingPersonality } =
    api.openAi.analyzePersonality.useMutation();

  const { mutate: updateUser, isPending: isUpdatingUser } =
    api.user.update.useMutation({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Playlist successfully updated",
        });
        setIsOpen(false);
        await updateSession();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Playlist was not updated!",
        });
      },
    });

  const { mutate: deleteExistingMatches, isPending: isDeletingMatches } =
    api.match.deleteMany.useMutation({
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not delete old matches!",
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

  const onSubmit = async (values: z.infer<typeof playlistSchema>) => {
    if (session.data?.user.id && tracks)
      analyzePersonality(
        { songs: tracks.map((track) => track.track.name) },
        {
          onSuccess: (data) => {
            deleteExistingMatches(session.data?.user.id);
            updateUser({
              id: session.data?.user.id,
              age: session.data?.user.age ?? 0,
              gender: session.data?.user.gender ?? "",
              sexualPreference: session.data?.user.sexualPreference ?? "",
              city: session.data?.user.city ?? "",
              ...values,
              personality: data as Personality,
            });
          },
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
    if (!formValues?.playlist) return <span>Save</span>;

    if (!isAnyFieldEmpty && !tracks)
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

    if (isUpdatingUser || isAnalyzingPersonality || isDeletingMatches)
      return (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </div>
      );

    return <span>Save</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="absolute bottom-0 left-0 m-1 h-9 w-9 rounded-full p-2"
          onClick={() => setIsOpen(true)}
        >
          <PenSquareIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Select Playlist</DialogTitle>
              <DialogDescription>
                Your playlist sets the tone for your personality and influences
                your matches.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isAnyFieldEmpty || !tracks}
              >
                {renderSubmitButtonContent()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistSelectDialog;
