import { classData } from "@/data/dummy-class-data";
import { useQuery } from "@tanstack/react-query";

export const useFetchClasses = ({
  onError,
  userId,
}: {
  onError: (e: Error) => void;
  userId: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        // const data = [];
        const data = classData;
        // const { data } = await axiosInstance.get(`/class/${userId}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId,
    queryKey: ["class", userId],
  });
};
