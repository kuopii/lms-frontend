"use client";

import { Role, User } from "@/types/auth";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/validators/auth";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IoMdImage } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";

// API CALL
export const useFetchUserById = ({
  onError,
  userId,
}: {
  onError: (e: Error) => void;
  userId: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}`);
        return data as User;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId,
    queryKey: ["profile"],
  });
};

export const useUpdateUser = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: FormData;
      userId: string;
    }) => {
      const { data: response } = await axiosInstance.patch(
        `/users/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useChangePassword = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: ChangePasswordSchema;
      userId: string;
    }) => {
      const { data: response } = await axiosInstance.patch(
        `/users/auth/change-password/${userId}`,
        data,
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

// VALIDATION
export const updateUserSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    image: z
      .any()
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file type",
      })
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
        message: "Image size must be 2MB or less",
      })
      .optional(),
  });

export const changePasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Current password is required",
      })
      .min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TYPES VALIDATION
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

// FORM COMPONENT
export const ProfileForm = ({
  form,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<UpdateUserSchema>>;
  onSubmit: (data: UpdateUserSchema) => void;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-5">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" {...field} placeholder="Your name..." />
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
              <Input type="email" {...field} placeholder="Your email..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Profile Image
            </FormLabel>
            <FormControl>
              <div className="flex flex-col items-center justify-between gap-4 overflow-hidden md:flex-row">
                {/* Preview */}
                <div className="border-muted aspect-square w-1/2 shrink-0 overflow-hidden rounded-3xl border md:h-20 md:w-20 md:rounded-full">
                  {field.value instanceof File ? (
                    <Image
                      src={URL.createObjectURL(field.value)}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                      <IoMdImage size={24} />
                    </div>
                  )}
                </div>

                {/* Custom File Input */}
                <label className="border-muted-foreground text-muted-foreground hover:bg-muted/20 flex w-full cursor-pointer items-center justify-start gap-4 rounded-md border border-dashed px-4 py-2 text-sm">
                  <span className="bg-primary rounded-md px-4 py-1.5 text-white">
                    Upload
                  </span>
                  <span className="line-clamp-1 max-w-[200px] truncate overflow-hidden">
                    {field.value?.name || "No file selected"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      form.setValue("image", file || null);
                    }}
                  />
                </label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-4 flex justify-end">
        <Button size="xs" type="submit" className="rounded-full">
          Update <MdEditSquare size={20} />
        </Button>
      </div>
    </form>
  </Form>
);

export const PasswordForm = ({
  form,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<ChangePasswordSchema>>;
  onSubmit: (data: ChangePasswordSchema) => void;
}) => {
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const renderPasswordField = (
    name: keyof ChangePasswordSchema,
    label: string,
    placeholder: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={show[name] ? "text" : "password"}
                placeholder={placeholder}
                className="pr-10"
              />
              <button
                tabIndex={-1}
                type="button"
                onClick={() => toggleVisibility(name)}
                className="text-muted-foreground absolute top-1/2 right-3.5 -translate-y-1/2 hover:cursor-pointer"
              >
                {show[name] ? <IoEye size={18} /> : <IoEyeOff size={18} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {renderPasswordField("password", "Old Password", "Enter old password")}
        {renderPasswordField(
          "newPassword",
          "New Password",
          "Enter new password",
        )}
        {renderPasswordField(
          "confirmPassword",
          "Confirm New Password",
          "Confirm new password",
        )}

        <div className="mt-4 flex justify-end">
          <Button size="xs" type="submit" className="rounded-full">
            Change Password <MdEditSquare size={20} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Profile = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.STUDENT,
    },
  });

  const { data: user, refetch } = useFetchUserById({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    userId: session?.user?.id,
  });

  const profileForm = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: "", email: "", image: null },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updateUser } = useUpdateUser({
    onSuccess: () => {
      toast.success("User updated successfully");
      refetch();
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const { mutate: updatePassword } = useChangePassword({
    onSuccess: () => {
      toast.success("Change password successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const handleUpdateUser = (data: UpdateUserSchema) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.image) {
      formData.append("image", data.image);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    updateUser({ data: formData, userId: user?.id || "" });
  };

  const handleChangePassword = (data: ChangePasswordSchema) => {
    console.log("CHANGE PASSWORD", data);
    updatePassword({ data, userId: user?.id || "" });
  };

  return (
    <div className="w-full">
      <h1 className="mb-11 text-[28px] font-semibold text-white">My Profile</h1>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-4xl bg-[#333333] p-5 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              {user?.photo_profile ? (
                <AvatarImage src={user.photo_profile} alt={user.name} />
              ) : null}

              <AvatarFallback className="text-muted-foreground flex items-center justify-center">
                <IoMdImage size={24} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-start gap-1.5">
              <span className="text-xl font-medium text-white">
                {user?.name || "John Doe"}
              </span>
              <span className="capitalize">
                {user?.role || session.user.role}
              </span>
            </div>
          </div>
          <Button
            size="xs"
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="w-full rounded-full md:w-fit [&_svg:not([class*='size-'])]:size-5"
          >
            {showPasswordForm ? "Edit Profile" : "Edit Password"}
          </Button>
        </div>

        {/* Plan */}
        {session.user.role === Role.TEACHER && (
          <div className="flex items-center justify-between rounded-4xl bg-[#333333] p-5">
            <div className="flex flex-col items-start justify-start gap-5">
              <h4 className="text-xl font-medium text-white">Your Plan</h4>
              <span className="border-destructive rounded-full border px-7 py-1">
                Plan XXX
              </span>
            </div>
            <Button size={"xs"} className="rounded-full">
              Change Plan
            </Button>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-6 rounded-4xl bg-[#333333] p-5">
          <h4 className="mb-4 text-xl font-medium text-white">
            {showPasswordForm ? "Change Password" : "Personal Information"}
          </h4>
          {showPasswordForm ? (
            <PasswordForm form={passwordForm} onSubmit={handleChangePassword} />
          ) : (
            <ProfileForm form={profileForm} onSubmit={handleUpdateUser} />
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default Profile;
