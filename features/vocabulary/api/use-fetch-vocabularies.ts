// import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ClassData } from "../pages/vocabulary-page";

// Dummy data when API is not available
const classData: ClassData[] = [
  {
    id: 1,
    name: "class-A",
  },
  {
    id: 2,
    name: "class-B",
  },
  {
    id: 3,
    name: "class-C",
  },
  {
    id: 4,
    name: "class-D",
  },
];

interface UseFetchVocabulariesProps {
  class?: null | string;
  search?: string | null;
  onError: (e: Error) => void;
}

export const useFetchVocabularies = ({
  class: _class,
  search,
  onError,
}: UseFetchVocabulariesProps) => {
  return useQuery({
    queryFn: async () => {
      try {
        console.log({
          search,
          class: _class,
        });
        // const { data } = await axiosInstance.get("/api/vocabulary", {
        //   params: { class: _class, search },
        // });
        return classData;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    queryKey: ["vocabulary", _class, search],
  });
};
