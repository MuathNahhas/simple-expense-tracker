'use client';
import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import {useTransactions} from "@/app/hooks/userTransactions";
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilter';
import { useDebounce } from 'use-debounce';
export default function TransactionsPage() {
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({
        page: 0,
        search: '',
        type: '',
    });


    const [debouncedSearch] = useDebounce(filters.search, 1000);
    const { data, isLoading } = useTransactions({
        ...filters,
        search: debouncedSearch,
        page: page
    });

    const updateFilter = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 0
        }));
    };
    const handleDateChange = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700">Transactions</Typography>
                <Typography color="text.secondary">View and manage your recent activity</Typography>
            </Box>

            <TransactionFilters
                search={filters.search}
                onSearchChange={(val) => updateFilter('search', val)}
                type={filters.type}
                onTransactionTypeChange={(val) => updateFilter('type', val)}
                onDateChange={handleDateChange}
            />

            <TransactionTable
                data={data}
                isLoading={isLoading}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
            />
        </Container>
    );
}
