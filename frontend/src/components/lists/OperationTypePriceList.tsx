import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Skeleton,
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
            <List data-testid="operation-types-loading-list">
                {Array.from({ length: 2 }, (_, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemText
                                primary={<Skeleton variant="text" width="60%" data-testid="skeleton-primary" />}
                                secondary={<Skeleton variant="text" width="80%" data-testid="skeleton-secondary" />}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Skeleton variant="text" width={80} height={32} data-testid="skeleton-price" />
                            </Box>
                        </ListItem>
                        {index < 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }} data-testid="operation-types-error">
                {error}
            </Alert>
        );
    }

    if (operationTypes.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }} data-testid="operation-types-empty">
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
