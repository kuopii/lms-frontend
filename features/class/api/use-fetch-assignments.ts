import { classAssignments } from "@/data/dummy-class-data";
import { useQuery } from "@tanstack/react-query";

export const useFetchAssignments = ({
  onError,
  classId,
  userId,
}: {
  onError: (e: Error) => void;
  classId: string;
  userId: string;
}) =>
  useQuery({
    queryFn: async () => {
      try {
        const data = classAssignments;
        // const { data } = await axiosInstance.get(`/class/assignments${userId}/${classId}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!classId && !!userId,
    queryKey: ["class", classId, userId],
  });
