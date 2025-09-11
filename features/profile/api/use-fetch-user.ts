import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserById = ({
  onError,
  userId,
}: {
  onError: (e: Error) => void;
  userId: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}`);
        return data as User;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId,
    queryKey: ["profile"],
  });
};
