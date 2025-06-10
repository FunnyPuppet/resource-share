"use server"

import pool from '@/app/lib/server/db'

export async function getTags() {
    const client = await pool.connect()
    try {
        const res = await client.query(
            'select id, name from tag limit 50',
        )

        return res.rows
    } finally {
        client.release()
    }
}