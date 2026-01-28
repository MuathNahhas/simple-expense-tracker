import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import {TransactionsResponse} from "@/app/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const fetchTransactions = async (page:number, limit:number = 10) => {
    const { data } = await axios.get<TransactionsResponse>(`${baseURL}/transactions/all-transactions`, {
        params: {
            page,
            limit,
        },
    });
    return data;
};

export const useTransactions = (page:number) => {
    return useQuery({
        queryKey:['transactions',page],
        queryFn: () => fetchTransactions(page),
        placeholderData:(previousData)=>previousData
    })
}
