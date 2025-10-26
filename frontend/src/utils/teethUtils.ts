export const generateFdiTeethNumbers = (): number[][] => [
    [
        ...Array.from({length: 8}, (_, i) => 18 - i), // 18 to 11
        ...Array.from({length: 8}, (_, i) => 21 + i)  // 21 to 28
    ],
    [
        ...Array.from({length: 8}, (_, i) => 48 - i), // 48 to 41
        ...Array.from({length: 8}, (_, i) => 31 + i)  // 31 to 38
    ]
];

export const generateFdiDeciduousTeethNumbers = (): number[][] => [
    [
        ...Array.from({length: 5}, (_, i) => 55 - i), // 55 to 51
        ...Array.from({length: 5}, (_, i) => 61 + i)  // 61 to 65
    ],
    [
        ...Array.from({length: 5}, (_, i) => 85 - i), // 85 to 81
        ...Array.from({length: 5}, (_, i) => 71 + i)  // 71 to 75
    ]
];
