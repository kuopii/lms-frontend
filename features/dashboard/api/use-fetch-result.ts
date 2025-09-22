import { useQuery } from "@tanstack/react-query";

type UseFetchResult = {
  onError: (e: Error) => void;
  search: string;
  page: number;
  size: number;
  status: string[];
  from: string;
  to: string;
  minScore: number | null;
  maxScore: number | null;
};

export const useFetchResult = ({
  page,
  search,
  size,
  status,
  from,
  to,
  minScore,
  maxScore,
  onError,
}: UseFetchResult) => {
  return useQuery({
    queryFn: async () => {
      const obj = {
        search: search || undefined,
        page,
        size,
        status: status.length > 0 ? status : undefined,
        from: from || undefined,
        to: to || undefined,
        minScore: minScore || undefined,
        maxScore: maxScore || undefined,
      };
      console.log("OBJ", obj);
      try {
        // TODO: Replace with actual API call
        // const response = await api.getDashboardSummary(obj);
        // return response.data;
        return null;
      } catch (error) {
        onError(error as Error);
        throw error;
      }
    },
    queryKey: [
      "dashboard-result",
      search,
      page,
      size,
      status,
      from,
      to,
      minScore,
      maxScore,
    ],
  });
};
