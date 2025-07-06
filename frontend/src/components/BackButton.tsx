import React from 'react';
import {Button, Tooltip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
    onClick: () => void;
    sx?: React.CSSProperties | any;
}

export const BackButton: React.FC<BackButtonProps> = ({onClick, sx}) => {
    return (
        <Tooltip title="Go back">
            <Button
                startIcon={<ArrowBackIcon/>}
                onClick={onClick}
                sx={sx}
                aria-label="Go back"
            />
        </Tooltip>
    );
};
