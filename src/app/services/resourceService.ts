interface Resource {
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

export const getResources = async (page: number, limit: number): Promise<PaginatedResources> => {
  const res = await fetch(`/api/resource?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch resources')
  return res.json()
}

export const createResource = async (resource: Omit<Resource, 'id'>): Promise<Resource> => {
  const res = await fetch('/api/resource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resource)
  })
  if (!res.ok) throw new Error('Failed to create resource')
  return res.json()
}

export const updateResource = async (id: number, resource: Partial<Resource>): Promise<Resource> => {
  const res = await fetch(`/api/resource/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resource)
  })
  if (!res.ok) throw new Error('Failed to update resource')
  return res.json()
}

export const getResourceById = async (id: number): Promise<Resource> => {
  const res = await fetch(`/api/resource/${id}`)
  if (!res.ok) throw new Error('Failed to fetch resource')
  return res.json()
}

export const deleteResource = async (id: number): Promise<void> => {
  const res = await fetch(`/api/resource/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete resource')
}
