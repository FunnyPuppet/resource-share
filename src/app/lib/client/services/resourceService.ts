import { apiRequest } from '@/app/lib/client/apiClient'

export interface Resource {
  id: number
  title: string
  update_date: string
  pan_category: string
  resource_category: string
  resource_tags: string
  resource_link: string
  resource_detail: string
  pan_link: string
}

interface PaginatedResources {
  data: Resource[]
  total: number
  page: number
  limit: number
}

export async function getResources(page: number, limit: number, dc: string, rc: string) {
  return await apiRequest<PaginatedResources>(
    `/api/resources?page=${page}&limit=${limit}&dc=${dc}&rc=${rc}`,
    'GET'
  )
}

export async function getResourceById(id: number) {
  return await apiRequest<Resource>(
    `/api/resources/${id}`,
    'GET'
  )
}
