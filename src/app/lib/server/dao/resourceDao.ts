"use server"

import pool from '@/app/lib/server/db'

export async function getResources(page: number, limit: number, dc: string, rc: string, keyword: string) {
    const offset = (page - 1) * limit
    const client = await pool.connect()
    let whereStr = ' where 1 = 1 '
    if (dc != 'all') whereStr += ` and pl.category_code = '${dc}' `
    if (rc != 'all') whereStr += ` and data.resource_category = '${rc}' `
    if (keyword != '' && keyword != undefined) whereStr += ` and data.title like '%${keyword}%' `
    try {
        const res = await client.query(
            `
            select data.id,
                data.title,
                data.resource_category,
                data.update_date,
                string_agg(DISTINCT dc.name, ',') AS pan_category
            from (select id, title, resource_category, update_date
                from resource_data) data
                    left join pan_link pl on pl.resource_id = data.id
                    left join disk_category dc on dc.code = pl.category_code
            ${whereStr}
            group by data.id, data.title, data.resource_category, data.update_date
            order by update_date desc
            limit $1 offset $2
            `,
            [limit, offset]
        )
        const countRes = await client.query(`
            select count(1) from (select data.id,
                data.title,
                data.resource_category,
                data.update_date,
                string_agg(DISTINCT dc.name, ',') AS pan_category
            from (select id, title, resource_category, update_date
                from resource_data) data
                    left join pan_link pl on pl.resource_id = data.id
                    left join disk_category dc on dc.code = pl.category_code
            ${whereStr}
            group by data.id, data.title, data.resource_category, data.update_date)
            `)
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
            `
            select r.id,
                r.title,
                r.update_date,
                r.resource_detail,
                rc.name                           as resource_category,
                string_agg(distinct dc.name, ',') as pan_category,
                string_agg(distinct pl.url, ';')  as pan_link,
                string_agg(distinct t.name, ' ')  as resource_tags
            from resource_data r
                    left join pan_link pl on pl.resource_id = r.id
                    left join disk_category dc on pl.category_code = dc.code
                    left join resource_category rc on r.resource_category = rc.code
                    left join resource_tag rt on r.id = rt.resource_id
                    left join tag t on rt.tag_id = t.id
            where r.id = $1
            group by r.id,
                    r.title,
                    r.update_date,
                    r.resource_detail,
                    rc.name
            `,
            [id]
        )

        return res.rows
    } finally {
        client.release()
    }
}