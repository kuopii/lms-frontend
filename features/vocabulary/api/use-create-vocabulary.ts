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
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateVocabularyType;
      accessToken?: string;
    }) => {
      console.log("payload", payload);
      const { data } = await axiosInstance.post("/vocab/create", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    },
    onError,
    onSuccess,
  });
