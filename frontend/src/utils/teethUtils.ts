export const generateFdiTeethNumbers = (): number[][] => [
    [
        ...Array.from({length: 8}, (_, i) => 18 - i),
        ...Array.from({length: 8}, (_, i) => 21 + i)
    ],
    [
        ...Array.from({length: 8}, (_, i) => 48 - i),
        ...Array.from({length: 8}, (_, i) => 31 + i)
    ]
];

export const generateFdiDeciduousTeethNumbers = (): number[][] => [
    [
        ...Array.from({length: 5}, (_, i) => 55 - i),
        ...Array.from({length: 5}, (_, i) => 61 + i)
    ],
    [
        ...Array.from({length: 5}, (_, i) => 85 - i),
        ...Array.from({length: 5}, (_, i) => 71 + i)
    ]
];
