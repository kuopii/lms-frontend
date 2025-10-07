"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Role } from "@/types/auth";
import { registerSchema, RegisterSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "sonner";
import { usePostRegister } from "../api/use-post-register";
import { AxiosError } from "axios";
import { useAutoLogin } from "../api/use-auto-login";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { performAutoLogin } = useAutoLogin();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const { mutate: registerUser, isPending } = usePostRegister({
    onSuccess: async (variables) => {
      toast.success("Account created successfully!");

      // Auto-login menggunakan custom hook
      await performAutoLogin(variables.email, variables.password);

      form.reset();
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.message;
        toast.error(message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleSubmit = (data: RegisterSchema) => registerUser(data);

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
            disabled={isPending}
            className="w-full rounded-4xl [&_svg:not([class*='size-'])]:size-5"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
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

export default SignUpPage;
