"use client";

import { useForm } from "react-hook-form";
import { authSchema } from "@/validators/auth";
import { Role } from "@/types/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const registerSchema = authSchema;

export type RegisterSchema = z.infer<typeof registerSchema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const handleSubmit = (data: RegisterSchema) => {
    console.log("REGISTER DATA:", data);
  };

  return (
    <div className="w-full max-w-lg flex flex-col justify-center items-center">
      <div className="text-white text-center mb-10">
        <h1 className="font-bold text-4xl mb-2">Create Your Account</h1>
        <p>
          Create your account and start learning smarter with <b>Koupii</b>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Register as</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Your Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value={Role.TEACHER}>Teacher</SelectItem>
                    <SelectItem value={Role.STUDENT}>Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className={cn(
                        "pr-10",
                        form.formState.errors.password &&
                          "border-destructive ring-1 ring-destructive"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-foreground hover:cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <HiEye size={20} />
                      ) : (
                        <HiEyeOff size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-4xl bg-[#7A9D58] hover:bg-[#6d8a4f]"
          >
            Sign up
          </Button>
        </form>
      </Form>

      <p className="mt-5">
        You have an account?{" "}
        <Link href="/auth/sign-in" className="hover:underline text-white">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
