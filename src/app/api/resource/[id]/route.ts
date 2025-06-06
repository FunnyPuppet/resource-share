import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  const client = await pool.connect()
  try {
    const res = await client.query(
      'SELECT * FROM resource_data_all WHERE id = $1',
      [id]
    )

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json(res.rows[0])
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
