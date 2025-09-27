export interface ApiError extends Error {
    status: number;
    message: string;
    body?: any;
}

