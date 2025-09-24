import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

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
      if (!accessToken) throw new Error("No access token provided");

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

      return response;
    },
    onSuccess,
    onError,
  });
};
