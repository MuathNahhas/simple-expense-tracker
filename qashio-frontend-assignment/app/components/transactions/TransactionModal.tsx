'use client';
import {
    Modal, Box, Typography, TextField, MenuItem, Button, Stack, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionSchema } from '../../schemas/transactionSchema';
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

export default function AddTransactionModal({ open, handleClose, categories, onSave, isLoading }) {

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(transactionSchema),
        defaultValues: {
            amount: '',
            type: 'expense',
            date: dayjs(),
            categoryId: '',
            notes: ''
        }
    });

    const onSubmit = (data: any) => {
        onSave({
            ...data,
            date: dayjs(data.date).toISOString(),
        });
        reset();
    };

    return (
        <Modal open={open} onClose={() => { handleClose(); reset(); }}>
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="700">Add Transaction</Typography>
                    <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
                </Box>

                <Stack spacing={2}>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Amount"
                                type="number"
                                fullWidth
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                            />
                        )}
                    />

                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Type"
                                fullWidth
                                error={!!errors.type}
                                helperText={errors.type?.message}
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </TextField>
                        )}
                    />

                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Category"
                                fullWidth
                                error={!!errors.categoryId}
                                helperText={errors.categoryId?.message}
                            >
                                {categories?.map((cat: any) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    label="Date"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.date,
                                            helperText: errors.date ? 'Invalid date' : ''
                                        }
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Notes"
                                multiline
                                rows={2}
                                fullWidth
                                error={!!errors.notes}
                                helperText={errors.notes?.message}
                            />
                        )}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isLoading}
                        onClick={handleSubmit(onSubmit)}
                        sx={{ bgcolor: '#5856d6', py: 1.5, mt: 1 }}
                    >
                        {isLoading ? 'Saving...' : 'Save Transaction'}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
