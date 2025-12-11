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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        form.setValue("password", "");
        setIsLoading(false);
      } else if (res?.ok) {
        form.reset();
        toast.success("Login success!");
        // Use window.location for faster redirect (bypasses React Router delay)
        // This ensures immediate navigation without waiting for session state updates
        window.location.href = "/dashboard/profile";
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
      form.setValue("password", "");
      setIsLoading(false);
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

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-4xl [&_svg:not([class*='size-'])]:size-5"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
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

export default SignInPage;
