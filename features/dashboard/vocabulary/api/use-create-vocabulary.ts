import { axiosInstance } from "@/lib/axios";
import { CreateVocabularyType } from "@/validators/vocabulary";
import { useMutation } from "@tanstack/react-query";

type UseCreateVocabularyProps = {
  onError: (e: Error) => void;
  onSuccess?: () => void;
};

export const useCreateVocabulary = ({
  onError,
  onSuccess,
}: UseCreateVocabularyProps) =>
  useMutation({
    mutationFn: async (payload: CreateVocabularyType) => {
      console.log("payload", payload);
      const { data } = await axiosInstance.post("/api/vocabulary", payload);
      return data;
    },
    onError,
    onSuccess,
  });
