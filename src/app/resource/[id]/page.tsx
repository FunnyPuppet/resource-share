"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Resource, getResourceById } from '@/app/lib/client/services/resourceService'

export default function ResourceDetail() {
  const params = useParams()
  const id = Number(params.id)

  const [resource, setResources] = useState<Resource|null>()
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
          <div className="p-4">加载中...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : resource ? (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{resource.title}</h1>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="font-semibold">基本信息</h2>
                  <p>更新日期: {new Date(resource.update_date).toLocaleDateString()}</p>
                  <p>网盘类型: {resource.pan_category}</p>
                  <p>资源类型: {resource.resource_category}</p>
                </div>
                <div>
                  <h2 className="font-semibold">标签</h2>
                  <p>{resource.resource_tags}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold">资源详情</h2>
                <p className="whitespace-pre-line">{resource.resource_detail}</p>
              </div>

              <div className="flex space-x-4">
                {resource.pan_link?.split(';').map((tag, idx) => (
                  <a
                    key={idx}
                    href={tag.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {tag.trim()}
                  </a>
                ))}
                <a
                  href="/"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  返回列表
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">加载中...</div>
        )
      }
    </main>
  )
}
