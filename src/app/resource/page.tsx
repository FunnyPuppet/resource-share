"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Resource, getResources } from '@/app/lib/client/services/resourceService'
import { Category, getCategory } from '@/app/lib/client/services/categoryService'

export default function ResourceShare() {
  const [panCategorys, setPanCategorys] = useState<Category[]>([])
  const [resourceCategorys, setResourceCategorys] = useState<Category[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const limit = 10

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const pcs = await getCategory("pan")
        setPanCategorys(pcs.data || [])
        const rcs = await getCategory("resource")
        setResourceCategorys(rcs.data || [])

        setLoading(true)
        setError('')
        const res = await getResources(page, limit)
        if (isMounted) {
          setResources(res.data?.data || [])
          setTotal(res.data?.total || 0)
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
  }, [page, limit])

  return (
    <main className="p-4">
      <div className="overflow-x-auto">
        <div className="mb-4 flex px-4">
          <input
            type="text"
            placeholder="请输入关键词搜索"
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="min-w-[100px] bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">搜索</button>
        </div>
        <div className="mb-4 flex px-4">
          <div className="text-gray-700">网盘类型: </div>
          {
            panCategorys.map((category, index) => (
              <div key={index} className="ml-4 hover:text-blue-300 text-gray-700">{category.name}</div>
            ))
          }
        </div>
        <div className="mb-4 flex px-4">
          <div className="text-gray-700">资源类型: </div>
          {
            resourceCategorys.map((category, index) => (
              <div key={index} className="ml-4 hover:text-blue-300 text-gray-700">{category.name}</div>
            ))
          }
        </div>

        {loading ? (
          <div className="flex items-center justify-center text-center">
            加载中...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-center">
            {error}
          </div>
        ) : resources?.length === 0 ? (
          <div className="flex items-center justify-center text-center">
            暂无数据
          </div>
        ) : (
          resources.map((resource, index) => (
            <div key={index} className="h-18 flex items-center border-b border-gray-100 px-4 hover:bg-gray-100 hover:shadow-lg transition cursor-pointer" onClick={() => { console.log(121); }}>
              <div className='flex justify-center'>
                <div className="bg-green-300 p-1 pl-2 pr-2 rounded text-white">{resource.pan_category}</div>
                <div className="flex items-center justify-center text-center text-gray-500 text-lg ml-6">{new Date(resource.update_date).toLocaleDateString()}</div>
                <div className="flex items-center justify-center text-center text-gray-500 text-lg ml-6" title={resource.title}>{resource.title}</div>
              </div>
            </div>
          ))
        )}
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
