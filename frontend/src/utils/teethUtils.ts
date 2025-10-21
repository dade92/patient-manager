export const generateFdiTeethNumbers = (): number[] => {
  return [
    ...Array.from({ length: 8 }, (_, i) => 11 + i),
    ...Array.from({ length: 8 }, (_, i) => 21 + i),
    ...Array.from({ length: 8 }, (_, i) => 31 + i),
    ...Array.from({ length: 8 }, (_, i) => 41 + i),
  ];
};

