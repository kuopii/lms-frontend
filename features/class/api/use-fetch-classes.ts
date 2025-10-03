import { axiosInstance } from "@/lib/axios";
import { Class } from "@/types/class";
import { useQuery } from "@tanstack/react-query";

export const useFetchClasses = ({
  onError,
  accessToken,
}: {
  onError: (e: Error) => void;
  accessToken?: string;
}) => {
  return useQuery({
    queryFn: async () => {
      console.log("accessToken", accessToken);
      try {
        const { data } = await axiosInstance.get("/classes", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return data as Class[];
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!accessToken,
    queryKey: ["class", accessToken],
  });
};
