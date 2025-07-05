import React from 'react';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {AppBar, Box, Container, Toolbar, Typography} from '@mui/material';
import {PatientSearch} from '../components/PatientSearch';
import {PatientDetail} from './PatientDetail';
import {NewPatient} from './NewPatient';
import {OperationDetail} from './OperationDetail';
import {CacheProvider} from '../context/CacheContext';
import {PatientManagerMenu} from '../components/PatientManagerMenu';

const Welcome: React.FC = () =>
    <CacheProvider>
        <BrowserRouter>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{flexGrow: 1, textDecoration: 'none', color: 'inherit'}}
                    >
                        Patient Manager
                    </Typography>
                    <PatientManagerMenu/>
                </Toolbar>
            </AppBar>

            <Container>
                <Routes>
                    <Route path="/" element={
                        <Box sx={{my: 4}}>
                            <PatientSearch/>
                        </Box>
                    }/>
                    <Route path="/patient/:patientId" element={<PatientDetail/>}/>
                    <Route path="/new-patient" element={<NewPatient/>}/>
                    <Route path="/operation/:operationId" element={<OperationDetail/>}/>
                </Routes>
            </Container>
        </BrowserRouter>
    </CacheProvider>

export default Welcome;
