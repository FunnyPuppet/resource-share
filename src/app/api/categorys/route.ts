"use server"

import { NextResponse } from 'next/server'
import { getCategory } from '@/app/lib/server/dao/categoryDao'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'pan'

  try {
    const result = await getCategory(type)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
