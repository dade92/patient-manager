import React, { useState } from 'react';
import { Grid, Button, Tooltip, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { generateFdiTeethNumbers, generateFdiDeciduousTeethNumbers } from '../../utils/teethUtils';

interface Props {
  selectedTooth: number | null;
  onToothSelect: (toothNumber: number) => void;
}

const TeethGrid: React.FC<Props> = ({
  selectedTooth,
  onToothSelect
}) => {
    const [teethType, setTeethType] = useState<'permanent' | 'deciduous'>('permanent');

    const permanentTeeth = generateFdiTeethNumbers();
    const deciduousTeeth = generateFdiDeciduousTeethNumbers();

    const teeth = teethType === 'permanent' ? permanentTeeth : deciduousTeeth;

    const handleTeethTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newTeethType: 'permanent' | 'deciduous' | null
    ) => {
        if (newTeethType !== null) {
            setTeethType(newTeethType);
        }
    };

    return (
        <Box>
            <ToggleButtonGroup
                value={teethType}
                exclusive
                onChange={handleTeethTypeChange}
                aria-label="teeth type"
                size="small"
                sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}
            >
                <ToggleButton value="permanent" aria-label="permanent teeth">
                    Permanent
                </ToggleButton>
                <ToggleButton value="deciduous" aria-label="deciduous teeth">
                    Baby
                </ToggleButton>
            </ToggleButtonGroup>

            <Grid container spacing={1} sx={{maxHeight: '120px', overflowY: 'auto'}}>
                {teeth.map((tooth) => (
                    <Grid item key={tooth}>
                        <Tooltip title={`Tooth ${tooth}`}>
                            <Button
                                variant={selectedTooth === tooth ? "contained" : "outlined"}
                                size="small"
                                onClick={() => onToothSelect(tooth)}
                                sx={{
                                    minWidth: '36px',
                                    height: '36px',
                                    p: 0
                                }}
                            >
                                {tooth}
                            </Button>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeethGrid;
