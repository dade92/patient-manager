export const generateFdiTeethNumbers = (): number[] =>
    [
        ...Array.from({length: 8}, (_, i) => 11 + i),
        ...Array.from({length: 8}, (_, i) => 21 + i),
        ...Array.from({length: 8}, (_, i) => 31 + i),
        ...Array.from({length: 8}, (_, i) => 41 + i),
    ];

export const generateFdiDeciduousTeethNumbers = (): number[] =>
    [
        ...Array.from({length: 5}, (_, i) => 51 + i),
        ...Array.from({length: 5}, (_, i) => 61 + i),
        ...Array.from({length: 5}, (_, i) => 71 + i),
        ...Array.from({length: 5}, (_, i) => 81 + i),
    ];
