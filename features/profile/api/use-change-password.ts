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
      accessToken,
    }: {
      data: ChangePasswordSchema;
      accessToken?: string;
    }) => {
      const { data: response } = await axiosInstance.patch(
        "/change-password",
        data,
        {
          headers: {
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
