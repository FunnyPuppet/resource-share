"use server"

import { NextResponse } from 'next/server'
import { getResourceById } from '@/app/lib/server/dao/resourceDao'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  try {
    const res = await getResourceById(id)

    if (res.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json(res[0])
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}
