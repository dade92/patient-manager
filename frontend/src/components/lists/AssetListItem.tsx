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
    >
        <ExpandableChip
            icon={<AttachFileIcon/>}
            label={asset}
            variant="outlined"
            clickable
        />
    </Link>
);
