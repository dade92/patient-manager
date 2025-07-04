import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { PatientSearch } from './components/PatientSearch';
import { PatientDetail } from './pages/PatientDetail';
import { NewPatient } from './pages/NewPatient';

const App: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Patient Manager
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            edge="end"
            aria-label="menu"
            aria-controls={open ? 'actions-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="actions-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'actions-button',
            }}
          >
            <MenuItem
              component={Link}
              to="/new-patient"
              onClick={handleClose}
            >
              New Patient
            </MenuItem>
            {/* Add more menu items here in the future */}
          </Menu>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={
            <Box sx={{ my: 4 }}>
              <PatientSearch />
            </Box>
          } />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/new-patient" element={<NewPatient />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
