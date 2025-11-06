import React, {useState} from 'react';
import {Alert, Box, Card, CardContent, CircularProgress, Collapse, List, Typography} from '@mui/material';
import {InvoiceListItem} from './InvoiceListItem';
import {PatientInvoicesHeader} from '../headers/PatientInvoicesHeader';
import {usePatientInvoices} from '../../hooks/usePatientInvoices';
import {InvoiceStatus} from "../../types/invoice";

interface Props {
    patientId: string;
    refreshTrigger: number;
}

export const PatientInvoices: React.FC<Props> = ({patientId, refreshTrigger}) => {
    const [expanded, setExpanded] = useState(false);
    const {
        invoices,
        loading,
        error,
        updatingPaidInvoice,
        updatingCancelledInvoice,
        changeInvoiceStatus
    } = usePatientInvoices(patientId, refreshTrigger);

    return (
        <Card>
            <CardContent>
                <PatientInvoicesHeader
                    expanded={expanded}
                    pendingInvoicesCount={invoices.filter(invoice => invoice.status === InvoiceStatus.PENDING).length}
                    onToggleExpanded={() => setExpanded(!expanded)}
                />

                <Collapse in={expanded}>
                    <Box sx={{mt: 2}}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" my={2}>
                                <CircularProgress/>
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{mb: 2}}>
                                {error}
                            </Alert>
                        ) : invoices.length === 0 ? (
                            <Typography color="textSecondary">
                                No invoices found for this patient.
                            </Typography>
                        ) : (
                            <List>
                                {invoices.map((invoice, index) => (
                                    <InvoiceListItem
                                        key={invoice.id}
                                        invoice={invoice}
                                        isLast={index === invoices.length - 1}
                                        isUpdatingOnPaid={invoice.id === updatingPaidInvoice}
                                        isUpdatingOnCancel={invoice.id === updatingCancelledInvoice}
                                        onChangeInvoiceStatus={changeInvoiceStatus}
                                    />
                                ))}
                            </List>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};
