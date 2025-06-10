"use server"

import { NextResponse } from 'next/server'
import { getTags } from '@/app/lib/server/dao/tagDao'

export async function GET(_: Request) {
  try {
    const result = await getTags()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
