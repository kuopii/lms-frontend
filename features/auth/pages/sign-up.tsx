"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Role } from "@/types/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, RegisterSchema } from "@/validators/auth";

export const SignUpPage = () => {
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
    <div className="flex w-full max-w-lg flex-col items-center justify-center">
      <div className="mb-10 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold">Create Your Account</h1>
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
                          "border-destructive ring-destructive ring-1",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 hover:cursor-pointer"
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
        <Link href="/auth/sign-in" className="text-white hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};
