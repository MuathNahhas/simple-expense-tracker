'use client';
import {AppBar, Toolbar, Typography, Box, Button, TextField, Snackbar, Alert} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useCreateCategory} from "@/app/hooks/useCategories";
import React, {useState} from "react";
    interface NavBarProps {
        onAddClick?: () => void;
    }
export default function NavBar({ onAddClick }: NavBarProps) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [name, setName] = useState('');
    const { mutate, isPending } = useCreateCategory();
    const handleAdd = () => {
        const cleanName = name.trim();
        if (cleanName) {
            mutate(cleanName, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: 'Category added successfully!',
                        severity: 'success'
                    });
                    setName('')
                },
                onError: (error: any) => {
                    setSnackbar({
                        open: true,
                        message: error.response?.data?.message || 'Failed to add Category',
                        severity: 'error'
                    });
                }
            });
        }
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
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "#FFFFFF" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1,color:"#A78F65" }}>
          Qashio
        </Typography>
        <Box sx={{ my: 1, mx: 'auto', p: 2 }}>
            <Button
                onClick={onAddClick}
            startIcon={<AddIcon />}
              sx={{
                color: 'black',
                borderRadius: 2,
                border: '2px solid #5856d6',
                textTransform: 'none',
                padding: '6px 16px',
                '&:hover': {
                  backgroundColor: '#5856d6',
                  color: 'white',
                  border: '2px solid #5856d6',
                },
              }}
          >
            New Transaction
          </Button>
        </Box>
          <Box
              sx={{
                  borderRadius: '12px',
                  border: '1px solid #eef0f2',
                  transition: 'all 0.2s ease-in-out',
                  maxWidth: 400,
                  '&:focus-within': {
                      bgcolor: '#fff',
                      borderColor: '#5856d6',
                      boxShadow: '0 4px 12px rgba(88, 86, 214, 0.08)'
                  }
              }}
          >
              <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1, p: 0.5,
                  bgcolor: '#f9f9fb', borderRadius: '12px', border: '1px solid #eef0f2',
                  maxWidth: 400
              }}>
                  <TextField
                      variant="standard"
                      placeholder={isPending ? "Creating..." : "Category name..."}
                      fullWidth
                      value={name}
                      disabled={isPending}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{ disableUnderline: true, sx: { px: 1.5 } }}
                  />

                  <Button
                      variant="contained"
                      onClick={handleAdd}
                      disabled={isPending || !name.trim()}
                      sx={{
                          bgcolor: '#5856d6',
                          borderRadius: '8px',
                          textTransform: 'none',
                          minWidth: '80px'
                      }}
                  >
                      {isPending ? '...' : 'Add'}
                  </Button>
              </Box>
          </Box>
      </Toolbar>
    </AppBar>
      </>
  );
}
