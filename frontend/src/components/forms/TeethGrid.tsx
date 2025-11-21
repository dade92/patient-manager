import React, { useState } from 'react';
import { Button, Tooltip, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { generateFdiTeethNumbers, generateFdiDeciduousTeethNumbers } from '../../utils/teethUtils';
import {ToothType} from "../../types/ToothDetail";

interface Props {
  selectedTooth: number;
  onToothSelect: (toothNumber: number, toothType: ToothType) => void;
}

const PERMANENT_TEETH = generateFdiTeethNumbers();
const DECIDUOUS_TEETH = generateFdiDeciduousTeethNumbers();

export const TeethGrid: React.FC<Props> = ({
  selectedTooth,
  onToothSelect
}) => {
    const [teethType, setTeethType] = useState<ToothType>(ToothType.PERMANENT);

    const teeth = teethType === ToothType.PERMANENT ? PERMANENT_TEETH : DECIDUOUS_TEETH;

    const handleTeethTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newTeethType: ToothType
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
        }} data-testid="teeth-grid-container">
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
                    data-testid="teeth-type-toggle-group"
                >
                    <ToggleButton value={ToothType.PERMANENT} aria-label="permanent teeth" data-testid="permanent-teeth-button">
                        Permanent
                    </ToggleButton>
                    <ToggleButton value={ToothType.DECIDUOUS} aria-label="deciduous teeth" data-testid="deciduous-teeth-button">
                        Baby
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    maxHeight: '120px',
                    overflowY: 'auto'
                }}
                data-testid="teeth-grid"
            >
                {teeth.map((row, rowIndex) => (
                    <Box key={rowIndex} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }} data-testid={`teeth-row-${rowIndex}`}>
                        {row.map((tooth) => (
                            <Tooltip key={tooth} title={`Tooth ${tooth}`}>
                                <Button
                                    variant={selectedTooth === tooth ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => onToothSelect(tooth, teethType)}
                                    sx={{
                                        minWidth: '36px',
                                        height: '36px',
                                        p: 0
                                    }}
                                    data-testid={`tooth-button-${tooth}`}
                                >
                                    {tooth}
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};