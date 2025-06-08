"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Pagination from '@/app/components/Pagination'
import { Resource, getResources } from '@/app/lib/client/services/resourceService'
import { Category, getCategory } from '@/app/lib/client/services/categoryService'

export default function ResourceShare() {
  const router = useRouter()
  const [panCategorys, setPanCategorys] = useState<Category[]>([])
  const [resourceCategorys, setResourceCategorys] = useState<Category[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const limit = 10

  const goToDetail = (id: number | undefined) => {
    router.push(`/resource/${id}`)
  }

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
    <main>
      <div className="flex gap-4">
        <div className="flex-1 overflow-x-auto">
          <div className='bg-white p-4'>
            <div className="mb-4 flex px-4">
              <input
                type="text"
                placeholder="请输入关键词搜索"
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="min-w-[100px] bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">搜索</button>
            </div>
            <div className="mb-4 flex px-4">
              <div className="text-gray-700 min-w-[75px]">网盘类型: </div>
              <div className="flex flex-wrap gap-4">
                {
                  panCategorys.map((category, index) => (
                    <div key={index} className="hover:text-blue-300 text-gray-700">{category.name}</div>
                  ))
                }
              </div>
            </div>
            <div className="mb-4 flex px-4">
              <div className="text-gray-700 min-w-[75px]">资源类型: </div>
              <div className="flex flex-wrap gap-4">
                {
                  resourceCategorys.map((category, index) => (
                    <div key={index} className="hover:text-blue-300 text-gray-700">{category.name}</div>
                  ))
                }
              </div>
            </div>
          </div>


          <div className="flex mt-4 p-4 text-gray-700 bg-white">
            当前数据(<span className="text-red-500">{total}</span>)条
          </div>

          <div className="bg-white mt-4 p-4">
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
                <div key={index} className="h-18 flex items-center border-b border-gray-100 px-4 hover:bg-gray-100 hover:shadow-lg transition cursor-pointer" onClick={() => { goToDetail(resource.id) }}>
                  <div className='flex justify-center'>
                    <div className="bg-green-300 p-1 pl-2 pr-2 rounded text-white lg:flex hidden">{resource.pan_category}</div>
                    {/* <div className="flex items-center justify-center text-center text-gray-500 text-lg ml-6 lg:flex hidden">{new Date(resource.update_date).toLocaleDateString()}</div> */}
                    <div className="text-left text-gray-500 text-lg ml-0 lg:ml-6 flex items-center justify-center text-center" title={resource.title}>{resource.title}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-4">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-4 max-w-[260px]">
          <div className="p-4 bg-white text-gray-700 flex flex-col gap-2">
            <p className="border-b border-gray-300 py-1 font-bold">网站公告</p>
            <p className="text-sm">亲爱的用户，欢迎访问本资源分享平台！</p>
            <p className="text-sm">本网站致力于整理和分享优质的网盘资源，涵盖视频、音频、文档、软件等多个类型，供大家学习与交流使用</p>
          </div>

          <div className="p-4 bg-white">
            游戏 AI 视频
          </div>

          <div className="p-4 bg-white">
            热门
          </div>
        </div>
      </div>
    </main>
  )
}
