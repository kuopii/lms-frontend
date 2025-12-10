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

      try {
        // Try to call backend logout API
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

        // Always clear NextAuth session, even if backend call succeeds
        await signOut({ callbackUrl: "/auth/sign-in" });

        return response;
      } catch (error) {
        // Even if backend logout fails, we should still clear the session
        // This ensures user can always logout even if backend is down
        await signOut({ callbackUrl: "/auth/sign-in" });

        // Re-throw the error so onError can handle it (but session is already cleared)
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};
