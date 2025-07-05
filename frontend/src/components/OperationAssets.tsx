import React from 'react';
import {
    Box,
    Link,
    Typography,
    Grid
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ExpandableChip } from './ExpandableChip';

interface OperationAssetsProps {
    assets: string[];
}

export const OperationAssets: React.FC<OperationAssetsProps> = ({ assets }) => {
    if (!assets || assets.length === 0) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Assets
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {assets.map((asset, index) => (
                    <Link
                        key={index}
                        href={`/files?filename=${asset}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                    >
                        <ExpandableChip
                            icon={<AttachFileIcon />}
                            label={asset}
                            variant="outlined"
                            clickable
                        />
                    </Link>
                ))}
            </Box>
        </Grid>
    );
};
