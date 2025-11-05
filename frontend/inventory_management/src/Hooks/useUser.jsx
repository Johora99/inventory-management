// src/hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useUser() {
const axiosSecure = useAxiosSecure()
  const {user} = useAuth();
  const { data: userData = [], isLoading, refetch } = useQuery({
    queryKey: ["userData", user],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/auth/user/byEmail/${user}`);
      return data.data; 
    },
    enabled: !!user, 
  });

  return { userData, isLoading, refetch };
}