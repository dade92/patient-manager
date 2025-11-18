import React from 'react';
import {Link} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {ExpandableChip} from '../atoms/ExpandableChip';

interface Props {
    asset: string;
}

export const AssetListItem: React.FC<Props> = ({ asset }) => (
    <Link
        href={`/files?filename=${asset}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        data-testid="asset-link"
    >
        <ExpandableChip
            icon={<AttachFileIcon/>}
            label={asset}
            variant="outlined"
            clickable
            data-testid="asset-chip"
        />
    </Link>
);
