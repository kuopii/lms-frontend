"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LoginSchema, loginSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io5";
import { FaApple } from "react-icons/fa";
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

export const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginSchema) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      console.error("Login gagal:", res.error);
    } else {
      console.log("Login sukses!");
    }
  };

  return (
    <div className="flex max-w-lg flex-col items-center justify-center">
      <div className="mb-10 text-center text-white">
        <h1 className="mb-2 text-4xl font-bold">Welcome Back!</h1>
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

          <Link
            href="/auth/forgot-password"
            className="mt-2.5 mb-3.5 inline-block text-sm hover:underline"
          >
            Forgot password?
          </Link>

          <Button type="submit" className="w-full rounded-4xl">
            Login
          </Button>
        </form>
      </Form>

      <span className="my-6">- Or Login With -</span>

      <div className="mb-6 flex w-full items-center justify-center gap-6">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            size="sm"
            className="w-12 rounded-full md:w-fit [&_svg:not([class*='size-'])]:size-[22px]"
          >
            {provider.icon}
            <span className="hidden md:block">{provider.label}</span>
          </Button>
        ))}
      </div>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="text-white hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};
