// POST /api/scores - Submit player score
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { playerName, levelStats, completedLevels, timestamp } = req.body;

        if (!playerName || !levelStats || !completedLevels) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate totals
        let totalAttempts = 0;
        let totalNodes = 0;
        for (const [level, stats] of Object.entries(levelStats)) {
            totalAttempts += stats.attempts || 0;
            totalNodes += stats.nodes || 0;
        }
        const score = (completedLevels.length * 1000) - (totalAttempts * 10) - (totalNodes * 5);

        // Upsert player
        const result = await sql`
            INSERT INTO players (name, completed_levels, total_attempts, total_nodes, score, updated_at)
            VALUES (${playerName}, ${completedLevels}, ${totalAttempts}, ${totalNodes}, ${score}, NOW())
            ON CONFLICT (name)
            DO UPDATE SET
                completed_levels = ${completedLevels},
                total_attempts = ${totalAttempts},
                total_nodes = ${totalNodes},
                score = ${score},
                updated_at = NOW()
            RETURNING id
        `;

        const playerId = result.rows[0].id;

        // Upsert level stats
        for (const [levelIndex, stats] of Object.entries(levelStats)) {
            await sql`
                INSERT INTO level_stats (player_id, level_index, attempts, nodes, completed_at)
                VALUES (${playerId}, ${parseInt(levelIndex)}, ${stats.attempts}, ${stats.nodes}, NOW())
                ON CONFLICT (player_id, level_index)
                DO UPDATE SET
                    attempts = LEAST(level_stats.attempts, ${stats.attempts}),
                    nodes = LEAST(level_stats.nodes, ${stats.nodes})
            `;
        }

        // Get player rank
        const rankResult = await sql`
            SELECT COUNT(*) + 1 as rank
            FROM players
            WHERE score > ${score}
        `;

        return res.status(200).json({
            success: true,
            playerId,
            rank: parseInt(rankResult.rows[0].rank)
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error', message: error.message });
    }
}
