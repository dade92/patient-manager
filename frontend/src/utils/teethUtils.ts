export const generateFdiTeethNumbers = (): number[][] => [
    // Upper jaw: 18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
    [
        ...Array.from({length: 8}, (_, i) => 18 - i), // 18 to 11
        ...Array.from({length: 8}, (_, i) => 21 + i)  // 21 to 28
    ],
    // Lower jaw: 48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
    [
        ...Array.from({length: 8}, (_, i) => 48 - i), // 48 to 41
        ...Array.from({length: 8}, (_, i) => 31 + i)  // 31 to 38
    ]
];

export const generateFdiDeciduousTeethNumbers = (): number[][] => [
    // Upper jaw: 55 54 53 52 51 | 61 62 63 64 65
    [
        ...Array.from({length: 5}, (_, i) => 55 - i), // 55 to 51
        ...Array.from({length: 5}, (_, i) => 61 + i)  // 61 to 65
    ],
    // Lower jaw: 85 84 83 82 81 | 71 72 73 74 75
    [
        ...Array.from({length: 5}, (_, i) => 85 - i), // 85 to 81
        ...Array.from({length: 5}, (_, i) => 71 + i)  // 71 to 75
    ]
];
