import React from 'react';
import {Button, Tooltip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    onClick: () => void;
    sx?: React.CSSProperties | any;
}

export const BackButton: React.FC<Props> = ({onClick, sx}) =>
    (
        <Tooltip title="Go back">
            <Button
                startIcon={<ArrowBackIcon/>}
                onClick={onClick}
                sx={sx}
                aria-label="Go back"
            />
        </Tooltip>
    );
