import { axiosInstance } from "@/lib/axios";
import { CreateClassFormSchema } from "@/validators/class";
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
      teacherId,
    }: {
      data: CreateClassFormSchema;
      teacherId: string;
    }) => {
      const payload = {
        teacherId,
        ...data,
      };
      const { data: response } = await axiosInstance.post(`/class`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    },
    onSuccess,
    onError,
  });
};
