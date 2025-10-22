import {ListItem, ListItemText, Chip} from "@mui/material";
import {formatAmount} from "../../utils/currencyUtils";
import React, {FC} from "react";
import {ToothDetail, ToothType} from "../../types/ToothDetail";

interface Props {
    detail: ToothDetail;
    index: number;
    isLast: boolean;
}

export const ToothDetailListItem: FC<Props> = ({detail, index, isLast}) => {
    const toothTypeDisplay = detail.toothType === ToothType.DECIDUOUS ? 'Baby' : 'Permanent';
    const chipColor = detail.toothType === ToothType.DECIDUOUS
        ? 'info'
        : 'success';

    return (
        <ListItem key={index} divider={!isLast}>
            <ListItemText
                primary={
                    <>
                        Tooth <strong>{detail.toothNumber}</strong>
                        <Chip
                            label={toothTypeDisplay}
                            color={chipColor}
                            size="small"
                            sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }}
                        />
                    </>
                }
                secondary={formatAmount(detail.estimatedCost.amount, detail.estimatedCost.currency)}
            />
        </ListItem>
    );
};
