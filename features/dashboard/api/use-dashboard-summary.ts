import { useQuery } from "@tanstack/react-query";

type UseDashboardSummary = {
  onError: (e: Error) => void;
  search: string;
  page: number;
  size: number;
  module: string[];
  status: string[];
  class: string;
  from: string;
  to: string;
};

export const useDashboardSummary = ({
  module,
  page,
  search,
  size,
  status,
  class: classParam,
  from,
  to,
  onError,
}: UseDashboardSummary) => {
  return useQuery({
    queryFn: async () => {
      const obj = {
        search: search || undefined,
        page,
        size,
        module: module.length > 0 ? module : undefined,
        status: status.length > 0 ? status : undefined,
        class: classParam || undefined,
        from: from || undefined,
        to: to || undefined,
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
      "dashboard-summary",
      search,
      page,
      size,
      module,
      status,
      classParam,
      from,
      to,
    ],
  });
};
