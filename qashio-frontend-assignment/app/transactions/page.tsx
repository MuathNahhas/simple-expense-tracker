'use client';
import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import {useTransactions} from "@/app/hooks/userTransactions";
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilter';

export default function TransactionsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const { data, isLoading, isError } = useTransactions(page + 1, search);
    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700">Transactions</Typography>
                <Typography color="text.secondary">View and manage your recent activity</Typography>
            </Box>

            <TransactionFilters
                search={search}
                onSearchChange={setSearch}
                type={type}
                onTransactionTypeChange={setType}
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
