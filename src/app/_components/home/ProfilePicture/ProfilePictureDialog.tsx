import { PenSquareIcon } from "lucide-react";
import { Button } from "@components/button";
import React from "react";
import Image from "next/image";
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
  } from "../../shadcn/dialog";

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../shadcn/form";
  
const ProfilePictureDialog: React.FC = () => {
    const session = useSession();

return(
    <Dialog>
<DialogTrigger asChild>
        <Button
          className="relative left-1/2 flex h-12 w-12 -translate-x-1/2 transform rounded-full border-none text-white"
        //   onClick={() => setIsOpen(true)}
        onClick="#"
        >
          <PenSquareIcon className="text-2xl" />
        </Button>
      </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Select Playlist</DialogTitle>
              <DialogDescription>
                The playlist you select will shape your user personality and
                affect your matches.
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
)}

export default ProfilePictureDialog;
