'use client';
import { Stack, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {TRANSACTION_TYPE_LIST} from "@/app/constant/typeTransaction";

export default function TransactionFilters({ search, onSearchChange, type, onTransactionTypeChange
                                                }:any) {
    return (

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search..."
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ bgcolor: 'white',width:"30%",minWidth:200 }}
                />

                <TextField
                    select
                    label="Transaction Type"
                    size="small"
                    sx={{ width:"20%",minWidth:200, bgcolor: 'white' }}
                    value={type||""}
                    onChange={(e) => onTransactionTypeChange(e.target.value)}
                >
                    {TRANSACTION_TYPE_LIST.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

    );
}
