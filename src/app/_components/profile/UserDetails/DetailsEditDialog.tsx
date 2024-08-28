import React, { useEffect, useState } from "react";
import { PenSquareIcon, Loader2 } from "lucide-react";
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
} from "../../shadcn/dialog";
import { Label } from "../../shadcn/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import { useToast } from "../../shadcn/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Personality, userSchema } from "~/app/signup/types";
import { type z } from "zod";
import { genders, sexualPreferences } from "~/app/consts";
import { Input } from "../../shadcn/input";


type DetailsEditDialogProps = {
  onDetailsUpdated: () => void; 
};

const DetailsEditDialog: React.FC<DetailsEditDialogProps> = ({onDetailsUpdated}) => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const { update: updateSession } = useSession();

  const userDetailsSchema = userSchema.pick({
    age: true,
    gender: true,
    sexualPreference: true,
    city: true,
  });

  const form = useForm<z.infer<typeof userDetailsSchema>>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      age: session.data?.user.age ?? 18,
      gender: session.data?.user.gender ?? "",
      sexualPreference: session.data?.user.sexualPreference ?? "",
      city: session.data?.user.city ?? "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (session) {
      reset({
        age: session.data?.user.age ?? 18,
        gender: session.data?.user.gender ?? "",
        sexualPreference: session.data?.user.sexualPreference ?? "",
        city: session.data?.user.city ?? "",
      });
    }
  }, [session, reset]);

  const { toast } = useToast();

  const formValues = form.watch();

  const isAnyFieldEmpty = Object.values(formValues).some((value) => !value);

  const { mutate: updateUser, isPending: isUpdatingUser } =
    api.user.update.useMutation({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Details successfully updated",
        });
        setIsOpen(false);
        await updateSession();
        onDetailsUpdated();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Details were not updated!",
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

  const onSubmit = async (values: z.infer<typeof userDetailsSchema>) => {
    if (session.data?.user.id && session.data?.user.personality)
      deleteExistingMatches(session.data?.user.id, {
        onSuccess: () => {
          updateUser({
            id: session.data?.user.id,
            ...values,
            playlist: session.data?.user.playlist,
            personality: session.data?.user.personality as Personality,
          });
        },
      });
  };

  const renderSubmitButtonContent = () => {
    if (isUpdatingUser || isDeletingMatches)
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
          className="relative left-1/2 flex -translate-x-1/2 transform border-none text-white"
          onClick={() => setIsOpen(true)}
        >
          <PenSquareIcon className="mr-2 h-4 w-4 text-2xl" />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Details</DialogTitle>
              <DialogDescription>
                Changing your details will affect your current matches.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="age">Age</Label>
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
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="gender">Gender</Label>
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="sexualPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="sexualPreference">
                          Sexual Preference
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isAnyFieldEmpty}
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

export default DetailsEditDialog;
