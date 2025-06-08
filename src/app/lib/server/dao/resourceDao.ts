"use server"

import pool from '@/app/lib/server/db'

export async function getResources(page: number, limit: number) {
    const offset = (page - 1) * limit
    const client = await pool.connect()
    try {
        const res = await client.query(
            `
            select data.id,
                data.title,
                data.resource_category,
                data.update_date,
                string_agg(DISTINCT dc.name, ',') AS pan_category
            from (select id, title, resource_category, update_date
                from resource_data
                order by update_date desc
                limit $1 offset $2) data
                    left join pan_link pl on pl.resource_id = data.id
                    left join disk_category dc on dc.code = pl.category_code
            group by data.id, data.title, data.resource_category, data.update_date
            `,
            [limit, offset]
        )
        const countRes = await client.query(`select count(1) from resource_data`)
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
            'SELECT * FROM resource_data WHERE id = $1',
            [id]
        )

        return res.rows
    } finally {
        client.release()
    }
}