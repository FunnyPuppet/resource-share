"use server"

import pool from '@/app/lib/server/db'

export async function getTags() {
    const client = await pool.connect()
    try {
        const res = await client.query(
            'select id, name from tag limit 30',
        )

        return res.rows
    } finally {
        client.release()
    }
}

export async function getTagIdByName(tags: string[]) {
    const client = await pool.connect()
    try {
        const tagResult = await client.query(
            `
            select id from tag where name = any($1)
            `,
            [tags]
        )

        return tagResult.rows.map((row) => row.id)
    } finally {
        client.release()
    }
}

export async function addTags(tags: string[]) {
    const client = await pool.connect()
    try {
        await client.query(
            `
            insert into tag (name)
            values ${tags.map((_, i) => `($${i + 1})`).join(',')}
            on conflict (name) do nothing
            `,
            tags
        )
    } finally {
        client.release()
    }
}