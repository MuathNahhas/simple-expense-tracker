'use client';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Typography, TablePagination, Box, Skeleton, Button, Stack, Alert, Snackbar
} from "@mui/material";
import dayjs from "dayjs";
import {useRemoveTransaction} from "@/app/hooks/userTransactions";
import React, {useState} from "react";
import {UpdateTransactionModal} from "@/app/components/transactions/UpdateTransactionModal";


const getStatusChip = (status: string) => {
    const config: any = {
        completed: { color: 'success', label: 'Completed' },
        pending: { color: 'warning', label: 'Pending' },
    };
    const { color, label } = config[status?.toLowerCase()] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" />;
};
export default function TransactionTable({ data, isLoading, page, onPageChange,categories }:any) {
    const { mutate: removeMutate } = useRemoveTransaction();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState('')
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleEditClick = (id: string) => {
        setSelectedTransactionId(id);
        setIsModalOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleRemove = (id: number) => {
        removeMutate(id, {
            onSuccess: () => {

                setSnackbar({
                    open: true,
                    message: 'Transaction removed successfully!',
                    severity: 'success'
                });
            },
            onError: (error: any) => {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Failed to remove transaction',
                    severity: 'error'
                });
            }
        });
    };
    if (isLoading) {
        return (

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Box sx={{ width: 600, height: 400 }}>
                    <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} animation="wave" />
                    <Skeleton variant="rectangular" height={50} animation={false} />
                </Box>
            </Box>

        );
    }

    const transactions = data?.data || [];
    return (
        <>
            <UpdateTransactionModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                transactionId={selectedTransactionId}
                categories={categories}
                onSaveSuccess={() => {
                    setIsModalOpen(false);
                }}
            />
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
        <Paper sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map((row: any) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{row.type}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {row.category?.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                        {row.amount?.toLocaleString()} $
                                    </TableCell>
                                    <TableCell>{getStatusChip(row.status)}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                            {row.notes || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            spacing={{ xs: 1, sm: 2 }}
                                            direction="row"
                                            useFlexGap
                                            sx={{ flexWrap: 'wrap' }}
                                        >
                                            <div>

                                                <Button  onClick={()=>handleEditClick(row.id)}  size="small" variant="contained"
                                                          sx={{borderRadius:4,fontSize: '0.65rem',
                                                            padding: '2px 8px',
                                                            minWidth: '64px',
                                                          }}
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                            <div><Button onClick={() => handleRemove(row.id)}  size="small" variant="contained" color="error" sx={{borderRadius:4,fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                minWidth: '64px',
                                            }}>Remove</Button>
                                            </div>
                                                </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={data?.meta?.itemsPerPage}
                component="div"
                count={data?.meta?.totalItems}
                rowsPerPage={data?.meta?.itemsPerPage}
                page={page}
                onPageChange={onPageChange}
            />
        </Paper>
        </>
    );
}
