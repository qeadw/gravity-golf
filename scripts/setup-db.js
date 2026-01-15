// Database setup script for Vercel Postgres
// Run with: npm run db:setup

import { sql } from '@vercel/postgres';

async function setupDatabase() {
    console.log('Setting up database tables...');

    try {
        // Create players table
        await sql`
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                completed_levels INTEGER[] DEFAULT '{}',
                total_attempts INTEGER DEFAULT 0,
                total_nodes INTEGER DEFAULT 0,
                score INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('Created players table');

        // Create level_stats table
        await sql`
            CREATE TABLE IF NOT EXISTS level_stats (
                id SERIAL PRIMARY KEY,
                player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
                level_index INTEGER NOT NULL,
                attempts INTEGER NOT NULL,
                nodes INTEGER NOT NULL,
                completed_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(player_id, level_index)
            )
        `;
        console.log('Created level_stats table');

        // Create speedruns table
        await sql`
            CREATE TABLE IF NOT EXISTS speedruns (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(50) NOT NULL,
                time_ms INTEGER NOT NULL,
                start_level INTEGER DEFAULT 0,
                completed_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('Created speedruns table');

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_players_score ON players(score DESC)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_players_name ON players(name)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_level_stats_level ON level_stats(level_index)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_speedruns_time ON speedruns(time_ms ASC)`;
        console.log('Created indexes');

        console.log('Database setup complete!');
    } catch (error) {
        console.error('Database setup error:', error);
        process.exit(1);
    }
}

setupDatabase();
