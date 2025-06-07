"use server"

import pool from '@/app/lib/server/db'

export async function getResources(page: number, limit: number) {
    const offset = (page - 1) * limit
    const client = await pool.connect()
    try {
        const res = await client.query(
            `SELECT
              *
          FROM resource_data_all
          ORDER BY update_date DESC
          LIMIT $1 OFFSET $2
          `,
            [limit, offset]
        )
        const countRes = await client.query(`SELECT count(1) FROM resource_data_all`)
        return {
            data: res.rows,
            total: parseInt(countRes.rows[0].count),
            page,
            limit
        }
    } finally {
        client.release()
    }
}

export async function getResourceById(id: string | undefined) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            'SELECT * FROM resource_data_all WHERE id = $1',
            [id]
        )

        return res.rows
    } finally {
        client.release()
    }
}