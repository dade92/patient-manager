export const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatAmountPlain = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
