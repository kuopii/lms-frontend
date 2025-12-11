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
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: EditVocabularyType;
      accessToken?: string;
    }) => {
      console.log("payload", payload);
      const { data } = await axiosInstance.patch(
        `/vocab/update/${payload.vocab_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    },
    onError,
    onSuccess,
  });
