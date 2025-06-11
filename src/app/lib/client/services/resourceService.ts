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

export async function getResources(page: number, limit: number, dc: string, rc: string, keyword: string|undefined) {
  if (keyword == undefined) keyword = ''
  return await apiRequest<PaginatedResources>(
    `/api/resources?page=${page}&limit=${limit}&dc=${dc}&rc=${rc}&keyword=${keyword}`,
    'GET'
  )
}

export async function addResource(data: any) {
  return await apiRequest<any>(
    `/api/resources`,
    'POST',
    JSON.stringify(data)
  )
}

export async function getResourceById(id: number) {
  return await apiRequest<Resource>(
    `/api/resources/${id}`,
    'GET'
  )
}
