'use client';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Typography, TablePagination, Box, Skeleton
} from '@mui/material';

const getStatusChip = (status: string) => {
    const config: any = {
        completed: { color: 'success', label: 'Completed' },
        pending: { color: 'warning', label: 'Pending' },
        failed: { color: 'error', label: 'Failed' },
    };
    const { color, label } = config[status?.toLowerCase()] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" />;
};

export default function TransactionTable({ data, isLoading, page, onPageChange }) {

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

    const rawTransactions = data?.data || [];
    const statusTest = ['completed', 'pending', 'failed'];

    const transactions = rawTransactions.map((transaction: any) => ({
        ...transaction,
        status: transaction.status || statusTest[Math.floor(Math.random() * statusTest.length)],
    }));

    return (
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
                                            {row.category?.name || 'Uncategorized'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{new Date(row.date).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                        {row.amount?.toLocaleString()} $
                                    </TableCell>
                                    <TableCell>{getStatusChip(row.status)}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                            {row.notes || '-'}
                                        </Typography>
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
    );
}
