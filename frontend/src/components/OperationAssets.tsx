import React from 'react';
import {
    Box,
    Link,
    Typography,
    Grid,
    Tooltip,
    IconButton
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import { ExpandableChip } from './ExpandableChip';

interface OperationAssetsProps {
    assets: string[];
    onAddAsset?: () => void; // Optional callback for adding assets
}

export const OperationAssets: React.FC<OperationAssetsProps> = ({ assets, onAddAsset }) => {
    return (
        <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" color="textSecondary">
                    Assets
                </Typography>
                {onAddAsset && (
                    <Tooltip title="Upload File">
                        <IconButton color="primary" size="small" onClick={onAddAsset}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {(!assets || assets.length === 0) ? (
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    No assets attached
                </Typography>
            ) : (
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
            )}
        </Grid>
    );
};
