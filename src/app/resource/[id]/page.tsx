"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Resource, getResourceById } from '@/app/lib/client/services/resourceService'

export default function ResourceDetail() {
  const params = useParams()
  const id = Number(params.id)

  const router = useRouter()

  const [resource, setResources] = useState<Resource | null>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await getResourceById(id)
        if (isMounted) {
          setResources(res.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchData()
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(debounceTimer)
    }
  }, [id])

  return (
    <main>
      {
        loading ? (
          <div className="p-4 items-center justify-center text-center">加载中...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : resource ? (
          <div className="p-4 bg-white">
            <div className="text-xl mb-2 ml-2 py-2 border-b border-gray-300">{resource.title}</div>

            <div className="p-2">
              <div className="flex flex-col gap-2 mb-4">
                <div className="text-gray-500">更新日期: {new Date(resource.update_date).toLocaleDateString()}</div>
                <div className="text-gray-500">网盘类型: {resource.pan_category}</div>
                <div className="text-gray-500">资源类型: {resource.resource_category}</div>
                <div className="text-gray-500">标签：{resource.resource_tags}</div>
              </div>

              <div className="mb-6 py-2 border-b border-gray-300">
                <h2 className="font-semibold mb-2">资源详情</h2>
                <p className="text-gray-500">{resource.resource_detail}</p>
              </div>

              <div className="space-x-4 flex flex-col gap-4">
                {resource.pan_link?.split(';').map((link, idx) => (
                  <div className="flex items-start flex-col gap-2 lg:flex-row items-center" key={idx}>
                    <div>链接: </div>
                    <div
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-[#e5f2ff] text-[#007bff] text-sm rounded hover:underline"
                      onClick={() => {window.open(link)}}
                    >
                      {link.trim()}
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => { router.back(); }}
                  className="px-4 py-2 text-center bg-gray-200 rounded hover:bg-gray-300"
                >
                  返回列表
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 items-center justify-center text-center">加载中...</div>
        )
      }
    </main>
  )
}
