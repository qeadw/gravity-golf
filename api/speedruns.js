// GET/POST /api/speedruns - Speedrun times
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { limit = 100 } = req.query;
            const limitNum = Math.min(parseInt(limit) || 100, 1000);

            const result = await sql`
                SELECT player_name, time_ms, start_level, completed_at
                FROM speedruns
                ORDER BY time_ms ASC
                LIMIT ${limitNum}
            `;

            return res.status(200).json({
                speedruns: result.rows.map(row => ({
                    playerName: row.player_name,
                    time: row.time_ms,
                    startLevel: row.start_level,
                    date: row.completed_at
                }))
            });
        }

        if (req.method === 'POST') {
            const { playerName, time, startLevel, timestamp } = req.body;

            if (!playerName || time === undefined || startLevel === undefined) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const result = await sql`
                INSERT INTO speedruns (player_name, time_ms, start_level, completed_at)
                VALUES (${playerName}, ${time}, ${startLevel}, NOW())
                RETURNING id
            `;

            // Get rank
            const rankResult = await sql`
                SELECT COUNT(*) + 1 as rank
                FROM speedruns
                WHERE time_ms < ${time}
            `;

            return res.status(200).json({
                success: true,
                id: result.rows[0].id,
                rank: parseInt(rankResult.rows[0].rank)
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error', message: error.message });
    }
}
