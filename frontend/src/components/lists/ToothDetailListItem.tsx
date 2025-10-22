import {ListItem, ListItemText, Typography} from "@mui/material";
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

    return (
        <ListItem key={index} divider={!isLast}>
            <ListItemText
                primary={
                    <>
                        Tooth <strong>{detail.toothNumber}</strong>
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                        >
                            ({toothTypeDisplay})
                        </Typography>
                    </>
                }
                secondary={formatAmount(detail.estimatedCost.amount, detail.estimatedCost.currency)}
            />
        </ListItem>
    );
};
