import React from 'react';
import {
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import { formatAmount } from '../../utils/currencyUtils';
import {ToothDetail} from "../../types/operation";
import {ToothDetailListItem} from "./ToothDetailListItem";

interface Props {
    details: ToothDetail[];
}

export const ToothDetailsList: React.FC<Props> = ({ details }) => {
    if (!details || details.length === 0) {
        return (
            <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">Tooth Details</Typography>
                <Typography variant="body1" color="text.secondary">No tooth details available</Typography>
            </Grid>
        );
    }

    const totalAmount = details.reduce((sum, detail) => sum + detail.estimatedCost.amount, 0);
    const currency = details.length > 0 ? details[0].estimatedCost.currency : 'EUR';

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">Tooth Details</Typography>
            <Paper variant="outlined" sx={{ mt: 1, mb: 2 }}>
                <List dense>
                    {details.map((detail, index) => (
                        <ToothDetailListItem detail={detail} index={index} isLast={index < details.length - 1} />
                    ))}
                    <ListItem sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <ListItemText
                            primary="Total"
                            secondary={formatAmount(totalAmount, currency)}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                            secondaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                    </ListItem>
                </List>
            </Paper>
        </Grid>
    );
};
