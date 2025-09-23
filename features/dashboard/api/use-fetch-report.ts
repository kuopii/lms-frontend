import { useQuery } from "@tanstack/react-query";
import { teacher_dashboard } from "@/data/dashboard-data";

type UseFetchReport = {
  id: string;
  onError: (e: Error) => void;
};

export const useFetchReport = ({ id, onError }: UseFetchReport) => {
  return useQuery({
    queryFn: async () => {
      try {
        const data = teacher_dashboard.find((report) => report.id === id);
        return data;
      } catch (error) {
        onError(error as Error);
        throw error;
      }
    },
    queryKey: ["reports"],
    enabled: !!id,
  });
};
