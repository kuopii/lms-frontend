import { axiosInstance } from "@/lib/axios";
import { ChangePasswordSchema } from "@/validators/profile";
import { useMutation } from "@tanstack/react-query";

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
