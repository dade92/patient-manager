import React, {useRef, useState} from 'react';
import {Box, Grid, IconButton, Link, Tooltip, Typography, CircularProgress, Alert} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import {ExpandableChip} from './ExpandableChip';

interface OperationAssetsProps {
    assets: string[];
    onAddAsset: (file: File) => Promise<void>;
}

export const OperationAssets: React.FC<OperationAssetsProps> = ({assets, onAddAsset}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);
        setUploadError(null);

        try {
            await onAddAsset(file);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
        } finally {
            setUploadLoading(false);
            // Reset the file input
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    return (
        <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Typography variant="subtitle1" color="textSecondary">
                    Assets
                </Typography>
                <Tooltip title="Upload File">
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click();
                            }
                        }}
                        disabled={uploadLoading}
                    >
                        {uploadLoading ? <CircularProgress size={24} /> : <AddIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            <input
                type="file"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileUpload}
            />

            {uploadError && (
                <Alert severity="error" sx={{mt: 1, mb: 1}}>
                    {uploadError}
                </Alert>
            )}

            {(!assets || assets.length === 0) ? (
                <Typography variant="body2" color="textSecondary" sx={{fontStyle: 'italic'}}>
                    No assets attached
                </Typography>
            ) : (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {assets.map((asset, index) => (
                        <Link
                            key={index}
                            href={`/files?filename=${asset}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                        >
                            <ExpandableChip
                                icon={<AttachFileIcon/>}
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
