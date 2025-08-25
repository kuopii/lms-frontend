import { axiosInstance } from "@/lib/axios";
import { EditVocabularyType } from "@/validators/vocabulary";
import { useMutation } from "@tanstack/react-query";

type UseUpdateVocabularyProps = {
  onError: (e: Error) => void;
  onSuccess?: () => void;
};

export const useUpdateVocabulary = ({
  onError,
  onSuccess,
}: UseUpdateVocabularyProps) =>
  useMutation({
    mutationFn: async (payload: EditVocabularyType) => {
      console.log("payload", payload);
      const { data } = await axiosInstance.patch(
        `/api/vocabulary${payload.vocab_id}`,
        payload,
      );
      return data;
    },
    onError,
    onSuccess,
  });
