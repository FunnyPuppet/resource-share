"use server"

import { NextResponse } from 'next/server'
import { getResources } from '@/app/lib/server/dao/resourceDao'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const dc = searchParams.get('dc') || 'all'
  const rc = searchParams.get('rc') || 'all'
  const keyword = searchParams.get('keyword') || ''

  try {
    const result = await getResources(page, limit, dc, rc, keyword)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
