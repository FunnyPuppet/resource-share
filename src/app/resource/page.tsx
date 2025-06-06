"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getResources } from '../services/resourceService'

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

export default function ResourceShare() {
  const [resources, setResources] = useState<Resource[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, total } = await getResources(page, limit)
        setResources(data)
        setTotal(total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit])

  return (
    <main className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">标题</th>
              <th className="py-2 px-4 border">更新日期</th>
              <th className="py-2 px-4 border">网盘类型</th>
              <th className="py-2 px-4 border">资源类型</th>
              <th className="py-2 px-4 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-4 text-center">加载中...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : resources?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center">暂无数据</td>
              </tr>
            ) : (
              resources.map((resource, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{resource.title}</td>
                  <td className="py-2 px-4 border">{new Date(resource.update_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{resource.pan_category}</td>
                  <td className="py-2 px-4 border">{resource.resource_category}</td>
                  <td className="py-2 px-4 border">
                    <Link 
                      href={`/resource/${resource.id}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      查看
                    </Link>
                    <a 
                      href={resource.pan_link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      下载
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span>第 {page} 页 / 共 {Math.ceil(total / limit)} 页</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(total / limit)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </main>
  )
}
