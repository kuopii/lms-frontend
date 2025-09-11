"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdImage } from "react-icons/io";
import { toast } from "sonner";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { PasswordForm } from "@/features/profile/components/password-form";
import { useUpdateUser } from "@/features/profile/api/use-update-user";
import { useFetchUserById } from "@/features/profile/api/use-fetch-user";
import { useChangePassword } from "@/features/profile/api/use-change-password";
import {
  ChangePasswordSchema,
  UpdateUserSchema,
  changePasswordSchema,
  updateUserSchema,
} from "@/validators/profile";

export const ProfilePage = () => {
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

  const handleUpdateUser = useCallback(
    (data: UpdateUserSchema) => {
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
    },
    [updateUser, user?.id],
  );

  const handleChangePassword = useCallback(
    (data: ChangePasswordSchema) => {
      console.log("CHANGE PASSWORD", data);
      updatePassword({ data, userId: user?.id || "" });
    },
    [updatePassword, user?.id],
  );

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
