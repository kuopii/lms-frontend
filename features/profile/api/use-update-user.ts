import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

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
      accessToken,
    }: {
      data: FormData;
      accessToken?: string;
    }) => {
      const { data: response } = await axiosInstance.post(
        "/profile/update",
        data,
        {
          params: {
            _method: "PATCH",
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
