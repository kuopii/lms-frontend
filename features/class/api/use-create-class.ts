import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useCreateClass = ({
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
        `/classes/create`,
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
