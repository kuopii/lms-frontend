import { ModuleType } from "@/types/class";
import { useQuery } from "@tanstack/react-query";
import { Test } from "@/types/discover-test";

const dummyTests: Test[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1565022536102-f7645c84354a",
    name: "Grammar Essentials",
    attempts: 145,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1552321046-a54642dc0cb8",
    name: "Vocabulary Builder",
    attempts: 298,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
    name: "English Reading Test",
    attempts: 73,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1477865300989-86ba6d4adcab",
    name: "Listening Comprehension",
    attempts: 202,
  },
  { id: "5", image: null, name: "TOEFL Practice Test", attempts: 87 },
];

export const useFetchTests = ({
  onError,
  search,
  type,
  sort,
  level,
  questionType,
}: {
  onError: (e: Error) => void;
  search: string;
  type: ModuleType;
  sort: string;
  level: string;
  questionType?: string | null;
}) => {
  return useQuery<Test[]>({
    queryFn: async () => {
      const obj = {
        search,
        type,
        sort,
        level,
        questionType,
      };
      console.log("OBJ", obj);
      try {
        const data = dummyTests;
        return data;
      } catch (error) {
        onError(error as Error);
        throw error;
      }
    },
    queryKey: ["tests", search, type, sort, level, questionType],
  });
};
