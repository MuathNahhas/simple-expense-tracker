'use client';

import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Stack,
    IconButton,
    CircularProgress,
    Alert, Snackbar
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, {useState} from "react";
import {updateTransactionSchema} from "@/app/schemas/updateTransactionSchema";

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

export function UpdateTransactionModal({open, handleClose, transactionId, categories, onSaveSuccess}: any) {
    const queryClient = useQueryClient();

    const {control, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(updateTransactionSchema),
        defaultValues: {
            amount: undefined,
            type: 'expense',
            date: dayjs(),
            categoryId: '',
            notes: ''
        }
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const {data: transaction, isLoading} = useQuery({
        queryKey: ['transaction', transactionId],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transaction/${transactionId}`);
            return res.data;
        },
        enabled: open && !!transactionId,
    });

    React.useEffect(() => {
        if (transaction) {
            reset({
                amount: transaction.amount,
                type: transaction.type,
                categoryId: transaction.category.id,
                date: dayjs(transaction.date),
                notes: transaction.notes
            });
        }
    }, [transaction, reset]);

    const  updateMutation = useMutation({
        mutationFn: async (data: any) => {
            console.log("dfsdfsdfsdfsd");
            return await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, {
                ...data,
                date: dayjs(data.date).toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions']});
            onSaveSuccess?.();
            handleClose();
        }
    });

    const onSubmit = (data: any) => {
        updateMutation.mutate(data,{
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: 'Transaction updated successfully!',
                severity: 'success'
            });
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update transaction',
                severity: 'error'
            });
        }
    })};

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

        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="700">Update Transaction</Typography>
                    <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={4}><CircularProgress/></Box>
                ) : (
                    <Stack spacing={2}>
                        <Controller name="amount" control={control} render={({field}) => (
                            <TextField {...field} label="Amount" type="number" fullWidth error={!!errors.amount}
                                       helperText={errors.amount?.message}/>
                        )}/>

                        <Controller name="type" control={control} render={({field}) => (
                            <TextField {...field} select label="Type" fullWidth>
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </TextField>
                        )}/>

                        <Controller name="categoryId" control={control} render={({field}) => (
                            <TextField {...field} select label="Category" fullWidth>
                                {categories?.map((cat: any) => <MenuItem key={cat.id}
                                                                         value={cat.id}>{cat.name}</MenuItem>)}
                            </TextField>
                        )}/>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller name="date" control={control} render={({field}) => (
                                <DatePicker {...field} label="Date" slotProps={{textField: {fullWidth: true}}}/>
                            )}/>
                        </LocalizationProvider>

                        <Controller name="notes" control={control} render={({field}) => (
                            <TextField {...field} label="Notes" multiline rows={2} fullWidth/>
                        )}/>

                        <Button
                            variant="contained"
                            fullWidth
                            disabled={updateMutation.isPending}
                            onClick={handleSubmit(onSubmit)}
                            sx={{bgcolor: '#5856d6', py: 1.5}}
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Stack>
                )}
            </Box>
        </Modal>
        </>
    );
}
