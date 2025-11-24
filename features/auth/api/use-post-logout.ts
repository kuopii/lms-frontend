import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

type UsePostLogout = {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
  accessToken?: string;
};

export const usePostLogout = ({
  accessToken,
  onSuccess,
  onError,
}: UsePostLogout) => {
  return useMutation({
    mutationFn: async () => {
      // ✅ DEV MODE (no backend token)
      if (!accessToken) {
        await signOut({ callbackUrl: "/auth/sign-in" });
        return { devLogout: true };
      }

      const { data: response } = await axiosInstance.post(
        `/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // Then clear NextAuth session
      await signOut({ callbackUrl: "/auth/sign-in" });

      return response;
    },
    onSuccess,
    onError,
  });
};
