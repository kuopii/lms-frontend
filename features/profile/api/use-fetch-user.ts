import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserById = ({
  onError,
  userId,
  accessToken,
}: {
  onError: (e: Error) => void;
  userId?: string;
  accessToken?: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        // If userId is provided, get specific user, otherwise get own profile
        const endpoint = userId ? `/profile/${userId}` : `/profile`;
        const { data } = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return data as User;
      } catch (error) {
        onError(error as Error);
        throw error;
      }
    },
    enabled: !!userId,
    queryKey: ["profile", userId],
    staleTime: 1000 * 60 * 5, // data fresh 5 menit
    gcTime: 1000 * 60 * 10, // cache hilang setelah 10 menit tidak dipakai
  });
};
