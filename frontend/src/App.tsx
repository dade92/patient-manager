import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { PatientSearch } from './components/PatientSearch';
import { PatientDetail } from './pages/PatientDetail';
import { NewPatient } from './pages/NewPatient';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Patient Manager
          </Typography>
          <Button color="inherit" component={Link} to="/new-patient">
            New Patient
          </Button>
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
