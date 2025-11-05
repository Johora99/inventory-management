import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';


export default function useAllInventory() {
  const axiosPublic = useAxiosPublic()
  const { data: allInventory = [], isLoading, refetch } = useQuery({
    queryKey: ['allInventory'],
    queryFn: async () => {
      const { data } = await axiosPublic.get('/api/inventory/all-inventories');
      return data.data; 
    },
  });

  return { allInventory, isLoading, refetch };
}
