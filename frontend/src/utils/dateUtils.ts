export const formatDateEuropean = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

export const formatDateTimeEuropean = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
