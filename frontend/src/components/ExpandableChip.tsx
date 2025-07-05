import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
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

export interface ExpandableChipProps extends ChipProps {
  fullLabel?: string;
}

export const ExpandableChip: React.FC<ExpandableChipProps> = ({
  fullLabel,
  label,
  ...chipProps
}) => {
  return (
    <StyledChip
      label={label}
      title={fullLabel || (typeof label === 'string' ? label : undefined)}
      {...chipProps}
    />
  );
};
