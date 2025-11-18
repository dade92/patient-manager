import React, {useRef, useState} from 'react';
import {Alert, Box, CircularProgress, Grid, IconButton, Tooltip, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {AssetListItem} from './AssetListItem';

interface Props {
    assets: string[];
    onAddAsset: (file: File) => Promise<void>;
}

export const OperationAssets: React.FC<Props> = ({assets, onAddAsset}) => {
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
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    return (
        <Grid item xs={12} data-testid={'operation-assets'}>
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
                        {uploadLoading ? <CircularProgress size={24}/> : <AddIcon/>}
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

            {assets.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{fontStyle: 'italic'}}>
                    No assets attached
                </Typography>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, max-content))',
                    gap: 0.5,
                    alignItems: 'start',
                    justifyContent: 'start'
                }}>
                    {assets.map((asset, index) => (
                        <AssetListItem
                            key={index}
                            asset={asset}
                        />
                    ))}
                </Box>
            )}
        </Grid>
    );
};
