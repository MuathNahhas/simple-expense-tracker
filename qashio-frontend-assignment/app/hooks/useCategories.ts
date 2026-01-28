
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/all-category`);
            return data;
        },
    });
};
