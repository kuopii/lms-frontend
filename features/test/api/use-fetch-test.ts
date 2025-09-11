import { dataTest } from "@/data/dummy-test";
import { useQuery } from "@tanstack/react-query";
import { DataTest } from "@/data/dummy-test";

type UseFetchTest = {
  onError: (e: Error) => void;
  testId: string;
  userId: string;
};

export const useFetchTest = ({ onError, testId, userId }: UseFetchTest) => {
  return useQuery({
    queryFn: async () => {
      try {
        const data: DataTest | undefined = dataTest.find(
          (test) => test.id === testId,
        );
        // const { data } = await axiosInstance.get(`/class/${userId}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!testId,
    queryKey: ["test", testId, userId],
  });
};
