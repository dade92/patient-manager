export class RestClient {
    static async get<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            ...options,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(options?.headers || {})
            }
        });
        if (!response.ok) {
            throw {
                name: 'ApiError',
                status: response.status,
                message: `GET ${url} failed: ${response.status} ${response.statusText}`,
                body: undefined,
            };
        }

        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');

        if (contentLength === '0' || (!contentType || !contentType.includes('application/json'))) {
            return {} as T;
        }

        return response.json();
    }

    static async post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            ...options,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(options?.headers || {})
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw {
                name: 'ApiError',
                status: response.status,
                message: `POST ${url} failed: ${response.status} ${response.statusText}`,
                body: undefined,
            };
        }

        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');

        if (contentLength === '0' || (!contentType || !contentType.includes('application/json'))) {
            return {} as T;
        }

        return response.json();
    }
}
