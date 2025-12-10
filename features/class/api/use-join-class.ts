import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useJoinClass = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      classCode,
      accessToken,
    }: {
      classCode: string;
      accessToken?: string;
    }) => {
      const { data: response } = await axiosInstance.post(
        `/enrollments/create`,
        {
          class_code: classCode,
        },
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
