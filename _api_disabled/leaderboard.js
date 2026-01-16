// GET /api/leaderboard - Get leaderboard data
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type = 'overall', limit = 100, level, player } = req.query;
        const limitNum = Math.min(parseInt(limit) || 100, 1000);

        // Get specific player's rank
        if (player) {
            const playerResult = await sql`
                SELECT id, name, completed_levels, total_attempts, total_nodes, score,
                       (SELECT COUNT(*) + 1 FROM players p2 WHERE p2.score > players.score) as rank
                FROM players
                WHERE name = ${player}
            `;

            if (playerResult.rows.length === 0) {
                return res.status(404).json({ error: 'Player not found' });
            }

            return res.status(200).json({
                player: playerResult.rows[0],
                rank: parseInt(playerResult.rows[0].rank)
            });
        }

        // Get level-specific leaderboard
        if (level !== undefined) {
            const levelIndex = parseInt(level);
            const levelResult = await sql`
                SELECT p.name, ls.attempts, ls.nodes
                FROM level_stats ls
                JOIN players p ON ls.player_id = p.id
                WHERE ls.level_index = ${levelIndex}
                ORDER BY ls.nodes ASC, ls.attempts ASC
                LIMIT ${limitNum}
            `;

            return res.status(200).json({
                level: levelIndex,
                players: levelResult.rows
            });
        }

        // Get global leaderboard by type
        let result;
        if (type === 'efficiency') {
            result = await sql`
                SELECT name, array_length(completed_levels, 1) as completed, total_attempts, total_nodes, score
                FROM players
                WHERE array_length(completed_levels, 1) > 0
                ORDER BY array_length(completed_levels, 1) DESC, total_nodes ASC
                LIMIT ${limitNum}
            `;
        } else {
            // Overall (by score)
            result = await sql`
                SELECT name, array_length(completed_levels, 1) as completed, total_attempts, total_nodes, score
                FROM players
                ORDER BY score DESC
                LIMIT ${limitNum}
            `;
        }

        return res.status(200).json({
            type,
            players: result.rows
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error', message: error.message });
    }
}
