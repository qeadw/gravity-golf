// GET /api/level-stats - Get level averages from top players
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
        const { top = 100 } = req.query;
        const topN = Math.min(parseInt(top) || 100, 1000);

        // Get pod averages from top N players by score
        // For each pod (0-5), calculate average attempts and nodes for those who completed all 10 levels
        const podAverages = {};

        for (let pod = 0; pod < 6; pod++) {
            const startLevel = pod * 10;
            const endLevel = startLevel + 9;

            // Get top players who completed all levels in this pod
            const result = await sql`
                WITH top_players AS (
                    SELECT id
                    FROM players
                    ORDER BY score DESC
                    LIMIT ${topN}
                ),
                pod_completers AS (
                    SELECT ls.player_id,
                           SUM(ls.attempts) as total_attempts,
                           SUM(ls.nodes) as total_nodes,
                           COUNT(*) as level_count
                    FROM level_stats ls
                    WHERE ls.player_id IN (SELECT id FROM top_players)
                      AND ls.level_index >= ${startLevel}
                      AND ls.level_index <= ${endLevel}
                    GROUP BY ls.player_id
                    HAVING COUNT(*) = 10
                )
                SELECT AVG(total_attempts) as avg_attempts,
                       AVG(total_nodes) as avg_nodes,
                       COUNT(*) as player_count
                FROM pod_completers
            `;

            if (result.rows[0] && result.rows[0].player_count > 0) {
                podAverages[pod] = {
                    avgAttempts: parseFloat(result.rows[0].avg_attempts) || 0,
                    avgNodes: parseFloat(result.rows[0].avg_nodes) || 0,
                    count: parseInt(result.rows[0].player_count) || 0
                };
            }
        }

        return res.status(200).json({
            podAverages,
            topN
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error', message: error.message });
    }
}
