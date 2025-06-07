export interface ApiResponse<T> {
    data: T | null
    error: string | null
}

export async function apiRequest<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            ...(body && { body: JSON.stringify(body) }),
        })

        if (!res.ok) {
            const errorText = await res.text()
            return { data: null, error: `HTTP ${res.status}: ${errorText}` }
        }

        const data = await res.json()
        return { data, error: null }
    } catch (err) {
        return {
            data: null,
            error: err instanceof Error ? err.message : '未知错误',
        }
    }
}
