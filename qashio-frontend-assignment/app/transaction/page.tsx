'use client';
import React, { useState } from 'react';
import {Container, Typography, Box, Snackbar, Alert} from "@mui/material";
import {useCreateTransaction, useTransactions} from "@/app/hooks/userTransactions";
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilter';
import { useDebounce } from 'use-debounce';
import TransactionModal from "@/app/components/transactions/TransactionModal";
import NavBar from "@/app/components/NavBar";
import {useCategories} from "@/app/hooks/useCategories";
export default function TransactionsPage() {
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({
        page: 0,
        search: '',
        type: '',
        status:''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debouncedSearch] = useDebounce(filters.search, 2500);
    const { data, isLoading } = useTransactions({
        ...filters,
        search: debouncedSearch,
        page: page
    });
    const { data: categories } = useCategories();
    const { mutate, isPending } = useCreateTransaction();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleSaveTransaction = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setSnackbar({
                    open: true,
                    message: 'Transaction added successfully!',
                    severity: 'success'
                });
            },
            onError: (error: any) => {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Failed to add transactions',
                    severity: 'error'
                });
            }
        });
    };    const updateFilter = (key: string, value: any) => {
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
        <>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '8px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
                <NavBar onAddClick={() => setIsModalOpen(true)} />
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700">Transactions</Typography>
                <Typography color="text.secondary">View and manage your recent activity</Typography>
            </Box>

            <TransactionFilters
                search={filters.search}
                onSearchChange={(val:any) => updateFilter('search', val)}
                type={filters.type}
                onTransactionTypeChange={(val:any) => updateFilter('type', val)}
                onDateChange={handleDateChange}
                onTransactionStatusChange={(val:any) => updateFilter('status', val)}
                status={filters.status}
            />

            <TransactionTable
                data={data}
                isLoading={isLoading}
                page={page}
                onPageChange={(e:any, newPage:any) => setPage(newPage)}
                categories={categories}
            />
            <TransactionModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                categories={categories || []}
                onSave={handleSaveTransaction}
            />
        </Container>
            </>
    );
}
