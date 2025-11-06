import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export default function useAllUsers() {
  const axiosSecure = useAxiosSecure()
  const { data: allUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/api/auth/allUsers');
      return data.users; 
    },
  });

  return { allUsers, isLoading, refetch };
}
