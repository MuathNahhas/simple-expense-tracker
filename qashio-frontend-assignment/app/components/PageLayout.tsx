'use client';

import { Container, Box, Paper } from '@mui/material';
import NavBar from './NavBar';
import { ReactNode } from 'react';
import Sidebar from "@/app/components/layout/Sidebar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1,mr:5}}>
        <Sidebar />
        <Paper
          elevation={2}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2
          }}
        >
          {children}
        </Paper>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            © {new Date().getFullYear()} Qashio
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
