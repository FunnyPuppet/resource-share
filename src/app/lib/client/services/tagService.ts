import { apiRequest } from '@/app/lib/client/apiClient'

export interface Tag {
    id: number
    name: string
}

export async function getTags() {
  return await apiRequest<Tag[]>(
    `/api/tags`,
    'GET'
  )
}
