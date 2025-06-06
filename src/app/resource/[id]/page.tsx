"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getResourceById } from '../../services/resourceService'

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

import { use } from 'react'

async function getData(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise
  try {
    const data = await getResourceById(Number(params.id))
    return { resource: data, error: null }
  } catch (err) {
    return { resource: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export default function ResourceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { resource, error } = use(getData(Promise.resolve(params)))
  
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!resource) return <div className="p-4">资源不存在</div>

  return (
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
          <a 
            href={resource.pan_link} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            下载资源
          </a>
          <Link 
            href="/resource" 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            返回列表
          </Link>
        </div>
      </div>
    </div>
  )
}
