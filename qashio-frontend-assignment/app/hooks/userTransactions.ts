import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import { TransactionsResponse } from "@/app/types";
import dayjs from "dayjs";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const fetchTransactions = async (filters: any) => {
    const { page, limit = 10, search, type, startDate, endDate } = filters;

    const params: any = {
        page: page + 1,
        limit,
    };
    if (search && search.trim() !== "") params.search = search;
    if (type && type !== "" && type !== "All") params.type = type.toLowerCase();
    if (startDate) params.startDate = dayjs(startDate).format('YYYY-MM-DD');
    if (endDate) params.endDate = dayjs(endDate).format('YYYY-MM-DD');
    const { data } = await axios.get<TransactionsResponse>(`${baseURL}/transactions/all-transactions`, {
        params,
    });
    return data;
};

const createTransaction = async (newTransaction: any) => {
    const { data } = await axios.post(`${baseURL}/transactions/create`, newTransaction);
    return data;
};
const removeTransaction = async(id:number) => {
    await axios.patch(`${baseURL}/transactions/remove/${id}`)
};
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};
export const useRemoveTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },

    });
};
export const useTransactions = (filters: any) => {
    return useQuery({
        queryKey: ['transactions', { ...filters }],
        queryFn: () => fetchTransactions(filters),
        placeholderData: (previousData) => previousData,
        enabled: true,
        refetchOnWindowFocus: false,
    });
}
