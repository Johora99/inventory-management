import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export default function useMyInventory() {
  const axiosSecure = useAxiosSecure();

  const { data: myInventory = [], isLoading, refetch } = useQuery({
    queryKey: ['myInventory'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/api/inventory/my-inventories');
      return data; 
    },
  });

  return { myInventory, isLoading, refetch };
}
