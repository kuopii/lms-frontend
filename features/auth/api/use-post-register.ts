import { axiosInstance } from "@/lib/axios";
import { RegisterSchema } from "@/validators/auth";
import { useMutation } from "@tanstack/react-query";

type UsePostRegister = {
  onSuccess?: (variables: RegisterSchema) => void | Promise<void>;
  onError?: (e: Error) => void;
};

export const usePostRegister = ({ onSuccess, onError }: UsePostRegister) => {
  return useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const { data: response } = await axiosInstance.post(
        `/auth/register`,
        data,
      );
      return response;
    },
    onSuccess: (data, variables) => {
      onSuccess?.(variables);
    },
    onError,
  });
};
