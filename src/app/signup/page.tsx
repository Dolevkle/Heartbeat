"use client";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";

import { useForm } from "react-hook-form";
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
  FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }), // Validates the string as an email
  firstName: z.string().min(1, { message: "First name cannot be empty" }), // Ensures the first name is not empty
  lastName: z.string().min(1, { message: "Last name cannot be empty" }), // Ensures the last name is not empty
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }) // Sets a minimum length for the password
    .regex(/[a-zA-Z]/, { message: "Password must contain letters" }) // Ensures the password contains letters
    .regex(/[0-9]/, { message: "Password must contain numbers" }) // Ensures the password contains numbers
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain special characters",
    }), // Ensures the password contains special characters
});

export default function SignUp() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto mt-16 max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="first-name">First name</Label>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Max" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="last-name">Last name</Label>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Robinson" {...field} />
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="email">Email</Label>
                      </FormLabel>
                      <FormControl>
                        <Input type='email' placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="password">Password</Label>
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with GitHub
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
