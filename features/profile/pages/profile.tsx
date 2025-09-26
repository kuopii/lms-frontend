"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/container/loader";
import { GeneralError } from "@/components/pages/general-error";
import { AxiosError } from "axios";

const ProfilePage = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { data: session } = useSession();

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useFetchUserById({
    onError: (e) => {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.message;
        toast.error(message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
    accessToken: session?.accessToken,
    userId: session?.user.id,
  });

  const profileForm = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: null,
    },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const { mutate: updateUser, isPending: isUpdateUserPending } = useUpdateUser({
    onSuccess: () => {
      toast.success("User updated successfully");
      refetch();
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

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useChangePassword({
      onSuccess: () => {
        toast.success("Change password successfully");
        passwordForm.reset();
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

  const handleUpdateUser = useCallback(
    (data: UpdateUserSchema) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("role", session?.user?.role || "");

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      updateUser({ data: formData, accessToken: session?.accessToken });
    },
    [updateUser, session?.accessToken, session?.user?.role],
  );

  const handleChangePassword = useCallback(
    (data: ChangePasswordSchema) => {
      updatePassword({ data, accessToken: session?.accessToken });
    },
    [updatePassword, session?.accessToken],
  );

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        avatar: null,
      });
    }
  }, [user, profileForm]);

  if (isPending) {
    return <Loader className="min-h-[80vh]" />;
  }

  if (isError || !user) {
    return (
      <GeneralError
        className="h-[75vh]"
        withBackButton={false}
        textButton="Retry"
        onClick={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-11 text-2xl font-semibold text-white">My Profile</h1>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-4xl bg-[#333333] p-5 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}

              <AvatarFallback className="text-muted-foreground flex items-center justify-center">
                <IoMdImage size={24} />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-start gap-1.5">
              <span className="text-xl font-medium text-white">
                {user?.name || <Skeleton className="h-2 w-40" />}
              </span>
              <span className="capitalize">
                {user?.role || session?.user.role}
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
        {/* {session?.user.role === Role.TEACHER && (
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
        )} */}

        {/* Form */}
        <div className="flex flex-col gap-6 rounded-4xl bg-[#333333] p-5">
          <h4 className="mb-4 text-xl font-medium text-white">
            {showPasswordForm ? "Change Password" : "Personal Information"}
          </h4>
          {showPasswordForm ? (
            <PasswordForm
              form={passwordForm}
              isLoading={isUpdatePasswordPending}
              onSubmit={handleChangePassword}
            />
          ) : (
            <ProfileForm
              isLoading={isUpdateUserPending}
              form={profileForm}
              onSubmit={handleUpdateUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
