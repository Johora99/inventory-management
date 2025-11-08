import React from 'react'
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
export default function useAccessInventory() {
  const axiosSecure = useAxiosSecure()
  const { data: accessInventory = [], isLoading, refetch } = useQuery({
    queryKey: ['accessInventory'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/api/inventory/access');
      return data.data; 
    },
  });
  return { accessInventory, isLoading, refetch};
}


