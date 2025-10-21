import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';

interface TeethGridProps {
  teeth: number[];
  selectedTooth: number | null;
  onToothSelect: (toothNumber: number) => void;
}

const TeethGrid: React.FC<TeethGridProps> = ({
  teeth,
  selectedTooth,
  onToothSelect
}) =>
    (
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
    );
export default TeethGrid
