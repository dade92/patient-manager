import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(() => ({
  maxWidth: '150px',
  transition: 'max-width 0.3s ease-in-out',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '&:hover': {
    maxWidth: '300px',
  },
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
