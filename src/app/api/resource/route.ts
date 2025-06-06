import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Database service layer
const resourceService = {
  async getResources(page: number, limit: number) {
    const offset = (page - 1) * limit
    const client = await pool.connect()
    try {
      const res = await client.query(
        `SELECT * FROM resource_data ORDER BY update_date DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      )
      const countRes = await client.query('SELECT COUNT(*) FROM resource_data')
      return {
        data: res.rows,
        total: parseInt(countRes.rows[0].count),
        page,
        limit
      }
    } finally {
      client.release()
    }
  },

  async createResource(resource: any) {
    const client = await pool.connect()
    try {
      const res = await client.query(
        `INSERT INTO resource_data 
        (title, update_date, pan_category, resource_category, resource_tags, resource_link, resource_detail, pan_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          resource.title,
          resource.update_date,
          resource.pan_category,
          resource.resource_category,
          resource.resource_tags,
          resource.resource_link,
          resource.resource_detail,
          resource.pan_link
        ]
      )
      return res.rows[0]
    } finally {
      client.release()
    }
  }
}

// API Handlers
async function handleGET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  try {
    const result = await resourceService.getResources(page, limit)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: Request) {
  try {
    const resource = await request.json()
    const result = await resourceService.createResource(resource)
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  return handleGET(request)
}

export async function POST(request: Request) {
  return handlePOST(request)
}

export async function PUT(request: Request) {
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  )
}

export async function DELETE(request: Request) {
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  )
}
