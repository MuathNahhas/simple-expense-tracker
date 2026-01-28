'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
    interface NavBarProps {
        onAddClick?: () => void;
    }
export default function NavBar({ onAddClick }: NavBarProps) {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "#FFFFFF" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1,color:"#A78F65" }}>
          Qashio
        </Typography>
        <Box>
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
      </Toolbar>
    </AppBar>
  );
}
