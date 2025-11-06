import React from 'react';
import {Button, Tooltip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";

interface Props {
    sx?: React.CSSProperties | any;
}

export const BackButton: React.FC<Props> = ({sx}) => {
    const navigate = useNavigate();
    return (
        <Tooltip title="Go back">
            <Button
                startIcon={<ArrowBackIcon/>}
                onClick={() => navigate(-1)}
                sx={sx}
                aria-label="Go back"
            />
        </Tooltip>
    );
};
