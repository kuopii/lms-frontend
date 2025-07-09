"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io5";
import { FaApple } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { authSchema } from "@/validators/auth";

export const loginSchema = authSchema.pick({
  email: true,
  password: true,
});

export type LoginSchema = z.infer<typeof loginSchema>;

const socialProviders = [
  {
    name: "google",
    label: "Google",
    icon: <IoLogoGoogle size={22} />,
  },
  {
    name: "apple",
    label: "Apple ID",
    icon: <FaApple size={22} />,
  },
  {
    name: "facebook",
    label: "Facebook",
    icon: <IoLogoFacebook size={22} />,
  },
];

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginSchema) => {
    console.log("LOGIN DATA", data);
  };

  return (
    <div className="max-w-lg flex flex-col justify-center items-center">
      <div className="text-center mb-10 text-white">
        <h1 className="font-bold text-4xl mb-2">Welcome Back!</h1>
        <p>
          Log in to continue your English journey with <b>Koupii</b>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
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
              <FormItem>
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

          <Link
            href="/auth/forgot-password"
            className="text-sm hover:underline mb-3.5 inline-block mt-2.5"
          >
            Forgot password?
          </Link>

          <Button type="submit" className="w-full rounded-4xl">
            Login
          </Button>
        </form>
      </Form>

      <span className="my-6">- Or Login With -</span>

      <div className="flex items-center justify-center gap-6 mb-6 w-full">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            size="sm"
            className="rounded-full [&_svg:not([class*='size-'])]:size-[22px] w-12 md:w-fit"
          >
            {provider.icon}
            <span className="hidden md:block">{provider.label}</span>
          </Button>
        ))}
      </div>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="hover:underline text-white">
          Register
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
