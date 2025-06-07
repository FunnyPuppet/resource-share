"use server"

import pool from '@/app/lib/server/db'

export async function getCategory(type: string | undefined) {
    const client = await pool.connect()
    try {
        let tableName = "resource_category"
        if (type == "pan") {
            tableName = "disk_category"
        }

        const sql = `SELECT code, name FROM ${tableName}`
        const res = await client.query(sql)

        return res.rows
    } finally {
        client.release()
    }
}