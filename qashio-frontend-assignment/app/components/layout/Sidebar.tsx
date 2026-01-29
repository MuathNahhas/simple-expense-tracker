'use client';
import { Box, Drawer, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 'auto',
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: "auto",
                    boxSizing: 'border-box',
                    bgcolor: '#f8f9fa',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #eee'
                },
            }}
        >
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="800" color="black" fontSize='30px'>
                    Company
                </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={() => router.push('/transaction')}
                    selected={pathname === '/transaction'}
                    disableRipple
                    sx={{
                        borderRadius: 3,
                        bgcolor: '#A78F65',
                        color: '#fff',
                        '&:hover': {
                            bgcolor: '#A78F65',
                        },
                        '&.Mui-selected': {
                            bgcolor: '#A78F65',
                            color: '#fff',
                            '&:hover': {
                                bgcolor: '#A78F65',
                            }
                        }
                    }}
                >
                    <ListItemIcon>
                        <Box
                            component="img"
                            src="/icon/Vector.png"
                            alt="Icon"
                            sx={{ width: 24, height: 24 }}
                        />

                    </ListItemIcon>
                    <ListItemText
                        primary="Transactions"
                        primaryTypographyProps={{ fontWeight: '600' }}
                    />
                </ListItemButton>
            </Box>
        </Drawer>
    );
}
