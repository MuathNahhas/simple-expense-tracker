
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from 'axios';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/all-category`);
            return data;
        },
        enabled: true,
        refetchOnWindowFocus: false,
    });
};
const createCategory = async (name: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories/create`, { name });
    return response.data;
};

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
