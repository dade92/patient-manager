const LOCALE = 'it-IT';
const YEAR_FORMAT = 'numeric';
const MONTH_FORMAT = '2-digit';
const DAY_FORMAT = '2-digit';

export const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString(LOCALE, {
        year: YEAR_FORMAT,
        month: MONTH_FORMAT,
        day: DAY_FORMAT
    });