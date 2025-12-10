import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
interface UseFetchVocabulariesProps {
  class?: null | string;
  search?: string | null;
  onError: (e: Error) => void;
  accessToken?: string;
}

export const useFetchVocabularies = ({
  class: _class,
  search,
  onError,
  accessToken,
}: UseFetchVocabulariesProps) => {
  return useQuery({
    queryFn: async () => {
      try {
        console.log({
          search,
          class: _class,
        });
        const { data } = await axiosInstance.get("/vocab/vocabularies", {
          params: { class: _class, search },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    queryKey: ["vocabulary", _class, search],
    enabled: !!accessToken,
  });
};
