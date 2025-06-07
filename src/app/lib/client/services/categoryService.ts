import { apiRequest } from '@/app/lib/client/apiClient'

export interface Category {
    code: string,
    name: string
}

export async function getCategory(type: string) {
    return await apiRequest<Category[]>(
        `/api/categorys?type=${type}`,
        'GET'
    )
}