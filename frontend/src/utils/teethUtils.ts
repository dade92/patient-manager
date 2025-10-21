export const generateFdiTeethNumbers = (): number[] => {
  return [
    ...Array.from({ length: 8 }, (_, i) => 11 + i), // Quadrant 1: 11-18
    ...Array.from({ length: 8 }, (_, i) => 21 + i), // Quadrant 2: 21-28
    ...Array.from({ length: 8 }, (_, i) => 31 + i), // Quadrant 3: 31-38
    ...Array.from({ length: 8 }, (_, i) => 41 + i), // Quadrant 4: 41-48
  ];
};

