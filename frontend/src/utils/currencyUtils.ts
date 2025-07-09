export const formatAmount = (amount: number, currency: string): string =>
    new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency,
    }).format(amount);