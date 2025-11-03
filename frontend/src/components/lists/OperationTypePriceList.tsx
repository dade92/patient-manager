import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import { OperationType } from '../../types/OperationType';

interface Props {
    operationTypes: OperationType[];
    loading: boolean;
    error: string | null;
}

export const OperationTypePriceList: React.FC<Props> = ({
    operationTypes,
    loading,
    error
}) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (operationTypes.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No operation types available
            </Typography>
        );
    }

    return (
        <List>
            {operationTypes.map((operationType, index) => (
                <React.Fragment key={operationType.type}>
                    <ListItem>
                        <ListItemText
                            primary={operationType.type}
                            secondary={operationType.description}
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                        <Typography variant="h6" color="primary">
                            {operationType.estimatedBaseCost.currency} {operationType.estimatedBaseCost.amount.toFixed(2)}
                        </Typography>
                    </ListItem>
                    {index < operationTypes.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </List>
    );
};
