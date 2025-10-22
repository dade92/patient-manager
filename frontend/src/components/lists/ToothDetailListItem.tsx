import {ListItem, ListItemText, Typography} from "@mui/material";
import {formatAmount} from "../../utils/currencyUtils";
import React, {FC} from "react";
import {ToothDetail} from "../../types/ToothDetail";

interface Props {
    detail: ToothDetail;
    index: number;
    isLast: boolean;
}

export const ToothDetailListItem: FC<Props> = ({detail, index, isLast}) =>
    <ListItem key={index} divider={!isLast}>
        <ListItemText
            primary={<>Tooth <strong>{detail.toothNumber}</strong></>}
            secondary={formatAmount(detail.estimatedCost.amount, detail.estimatedCost.currency)}
        />
    </ListItem>