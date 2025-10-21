export const generateFdiTeethNumbers = (): number[] => {
  return [
    ...Array.from({ length: 8 }, (_, i) => 11 + i), // Quadrant 1: 11-18
    ...Array.from({ length: 8 }, (_, i) => 21 + i), // Quadrant 2: 21-28
    ...Array.from({ length: 8 }, (_, i) => 31 + i), // Quadrant 3: 31-38
    ...Array.from({ length: 8 }, (_, i) => 41 + i), // Quadrant 4: 41-48
  ];
};

export const generateFdiDeciduousTeethNumbers = (): number[] => {
  return [
    ...Array.from({ length: 5 }, (_, i) => 51 + i), // Quadrant 5: 51-55
    ...Array.from({ length: 5 }, (_, i) => 61 + i), // Quadrant 6: 61-65
    ...Array.from({ length: 5 }, (_, i) => 71 + i), // Quadrant 7: 71-75
    ...Array.from({ length: 5 }, (_, i) => 81 + i), // Quadrant 8: 81-85
  ];
};
