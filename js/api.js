// Database API client - communicates with serverless functions

const DatabaseAPI = {
    baseUrl: '/api',

    // Submit score to database
    async submitScore(playerName, levelStats, completedLevels) {
        try {
            const response = await fetch(`${this.baseUrl}/scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName,
                    levelStats,
                    completedLevels: Array.from(completedLevels),
                    timestamp: Date.now()
                })
            });
            return response.json();
        } catch (e) {
            console.log('Database not connected. Score saved locally.');
            return { success: true, local: true };
        }
    },

    // Get global leaderboard
    async getLeaderboard(type = 'overall', limit = 100) {
        try {
            const response = await fetch(`${this.baseUrl}/leaderboard?type=${type}&limit=${limit}`);
            return response.json();
        } catch (e) {
            return { players: leaderboardData.demoPlayers, local: true };
        }
    },

    // Get leaderboard for specific level
    async getLevelLeaderboard(levelIndex, limit = 50) {
        try {
            const response = await fetch(`${this.baseUrl}/leaderboard?level=${levelIndex}&limit=${limit}`);
            return response.json();
        } catch (e) {
            return { players: [], local: true };
        }
    },

    // Get player's rank
    async getPlayerRank(playerName) {
        try {
            const response = await fetch(`${this.baseUrl}/leaderboard?player=${encodeURIComponent(playerName)}`);
            return response.json();
        } catch (e) {
            return { rank: null, local: true };
        }
    },

    // Get average attempts/nodes for each level from top N players
    async getLevelAverages(topN = 100) {
        try {
            const response = await fetch(`${this.baseUrl}/level-stats?top=${topN}`);
            const data = await response.json();
            return data;
        } catch (e) {
            return { averages: {}, local: true };
        }
    },

    // Submit speedrun time
    async submitSpeedrun(playerName, time, startLevel) {
        try {
            const response = await fetch(`${this.baseUrl}/speedruns`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName,
                    time,
                    startLevel,
                    timestamp: Date.now()
                })
            });
            return response.json();
        } catch (e) {
            console.log('Could not submit speedrun to database');
            return { success: false, local: true };
        }
    },

    // Get speedrun leaderboard
    async getSpeedruns(limit = 100) {
        try {
            const response = await fetch(`${this.baseUrl}/speedruns?limit=${limit}`);
            return response.json();
        } catch (e) {
            return { speedruns: [], local: true };
        }
    }
};

// Export for use in other modules
window.DatabaseAPI = DatabaseAPI;
