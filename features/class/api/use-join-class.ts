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
    mutationFn: async ({ classCode }: { classCode: string }) => {
      const { data: response } = await axiosInstance.post(`/class/join`, {
        classCode,
      });
      return response;
    },
    onSuccess,
    onError,
  });
};
