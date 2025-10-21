import React, { useState } from 'react';
import { Grid, Button, Tooltip, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { generateFdiTeethNumbers, generateFdiDeciduousTeethNumbers } from '../../utils/teethUtils';

interface Props {
  selectedTooth: number | null;
  onToothSelect: (toothNumber: number) => void;
}

enum TeethType {
    PERMANENT = 'permanent',
    DECIDUOUS = 'deciduous'
}

const PERMANENT_TEETH = generateFdiTeethNumbers();
const DECIDUOUS_TEETH = generateFdiDeciduousTeethNumbers();

export const TeethGrid: React.FC<Props> = ({
  selectedTooth,
  onToothSelect
}) => {
    const [teethType, setTeethType] = useState<TeethType>(TeethType.PERMANENT);

    const teeth = teethType === TeethType.PERMANENT ? PERMANENT_TEETH : DECIDUOUS_TEETH;

    const handleTeethTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newTeethType: TeethType
    ) => {
        if (newTeethType !== null) {
            setTeethType(newTeethType);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <ToggleButtonGroup
                    value={teethType}
                    exclusive
                    onChange={handleTeethTypeChange}
                    aria-label="teeth type"
                    size="small"
                >
                    <ToggleButton value={TeethType.PERMANENT} aria-label="permanent teeth">
                        Permanent
                    </ToggleButton>
                    <ToggleButton value={TeethType.DECIDUOUS} aria-label="deciduous teeth">
                        Baby
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid
                container
                spacing={1}
                sx={{
                    maxHeight: '120px',
                    overflowY: 'auto'
                }}
            >
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