import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(() => ({
  maxWidth: '150px',
  minWidth: '150px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '& .MuiChip-label': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}));

export interface Props extends ChipProps {
  fullLabel?: string;
}

export const ExpandableChip: React.FC<Props> = ({
  fullLabel,
  label,
  ...chipProps
}) =>
    <StyledChip
        label={label}
        title={fullLabel || (typeof label === 'string' ? label : undefined)}
        {...chipProps}
    />
