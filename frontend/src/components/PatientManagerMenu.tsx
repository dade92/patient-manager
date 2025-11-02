import React, {useState} from 'react';
import {IconButton, Menu, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom';

export const PatientManagerMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleMenuClick}
                edge="end"
                aria-label="menu"
                aria-controls={open ? 'actions-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MenuIcon/>
            </IconButton>
            <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'actions-button',
                }}
            >
                <MenuItem
                    component={Link}
                    to="/new-patient"
                    onClick={handleClose}
                >
                    New Patient
                </MenuItem>
                <MenuItem
                    component={Link}
                    to="/new-operation-type"
                    onClick={handleClose}
                >
                    New Operation Type
                </MenuItem>
                {/* Add more menu items here in the future */}
            </Menu>
        </>
    );
};
