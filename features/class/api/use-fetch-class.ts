import { classData } from "@/data/dummy-class-data";
import { useQuery } from "@tanstack/react-query";

export const useFetchClass = ({
  onError,
  classId,
}: {
  onError: (e: Error) => void;
  classId: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        const data = classData.find((cls) => cls.id === classId);
        // const { data } = await axiosInstance.get(`/class/${userId}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!classId,
    queryKey: ["class", classId],
  });
};
