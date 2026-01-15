// Leaderboard module - leaderboard UI and data

const leaderboardData = {
    playerName: 'Anonymous',
    demoPlayers: [
        { name: 'SpaceAce', completed: 60, totalAttempts: 89, totalNodes: 142, levels: {} },
        { name: 'GravityMaster', completed: 58, totalAttempts: 102, totalNodes: 158, levels: {} },
        { name: 'CosmicPilot', completed: 55, totalAttempts: 95, totalNodes: 165, levels: {} },
        { name: 'StarNavigator', completed: 52, totalAttempts: 120, totalNodes: 180, levels: {} },
        { name: 'NebulaDrifter', completed: 48, totalAttempts: 135, totalNodes: 195, levels: {} },
        { name: 'OrbitRunner', completed: 45, totalAttempts: 110, totalNodes: 175, levels: {} },
        { name: 'VoidWalker', completed: 40, totalAttempts: 88, totalNodes: 145, levels: {} },
        { name: 'PlanetHopper', completed: 35, totalAttempts: 75, totalNodes: 120, levels: {} },
        { name: 'AstroNovice', completed: 25, totalAttempts: 65, totalNodes: 95, levels: {} },
        { name: 'SpaceRookie', completed: 15, totalAttempts: 45, totalNodes: 60, levels: {} }
    ]
};

// Generate demo level stats for simulated players
function generateDemoLevelStats() {
    leaderboardData.demoPlayers.forEach(player => {
        for (let i = 0; i < player.completed; i++) {
            player.levels[i] = {
                attempts: Math.floor(Math.random() * 5) + 1,
                nodes: Math.floor(Math.random() * 8) + 1
            };
        }
    });
}

// Initialize leaderboard
function initLeaderboard() {
    // Load player name
    try {
        const savedName = localStorage.getItem('gravityGolfPlayerName');
        if (savedName) {
            leaderboardData.playerName = savedName;
            document.getElementById('playerNameInput').value = savedName;
        }
    } catch (e) {}

    generateDemoLevelStats();

    // Tab switching
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.leaderboard-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
    });

    // Save player name
    document.getElementById('savePlayerName').addEventListener('click', () => {
        const name = document.getElementById('playerNameInput').value.trim();
        if (name) {
            leaderboardData.playerName = name;
            localStorage.setItem('gravityGolfPlayerName', name);
            updateLeaderboards();
        }
    });

    // Populate level select dropdown
    const select = document.getElementById('levelLeaderboardSelect');
    for (let i = 0; i < 60; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Level ${i + 1}: ${levels[i].name}`;
        select.appendChild(option);
    }
    select.addEventListener('change', () => updateLevelLeaderboard(parseInt(select.value)));

    // Open/close leaderboard
    document.getElementById('openLeaderboardBtn').addEventListener('click', () => {
        document.getElementById('levelSelect').classList.remove('show');
        updateLeaderboards();
        document.getElementById('leaderboard').classList.add('show');
    });

    document.getElementById('closeLeaderboard').addEventListener('click', () => {
        document.getElementById('leaderboard').classList.remove('show');
    });
}

// Get current player stats
function getPlayerStats() {
    let totalAttempts = 0;
    let totalNodes = 0;
    const completed = state.completedLevels.size;

    for (const [level, stats] of Object.entries(state.levelStats)) {
        totalAttempts += stats.attempts || 0;
        totalNodes += stats.nodes || 0;
    }

    return {
        name: leaderboardData.playerName,
        completed,
        totalAttempts,
        totalNodes,
        levels: state.levelStats,
        isPlayer: true
    };
}

// Calculate score from player stats
function calculateScore(player) {
    return (player.completed * 1000) - (player.totalAttempts * 10) - (player.totalNodes * 5);
}

// Update all leaderboards
function updateLeaderboards() {
    const playerStats = getPlayerStats();

    // Update global stats
    document.getElementById('totalCompleted').textContent = playerStats.completed;
    document.getElementById('totalAttempts').textContent = playerStats.totalAttempts;
    document.getElementById('totalNodes').textContent = playerStats.totalNodes;

    // Combine player with demo players
    const allPlayers = [...leaderboardData.demoPlayers, playerStats];

    // Overall leaderboard (by score)
    const overallSorted = [...allPlayers].sort((a, b) => calculateScore(b) - calculateScore(a));
    renderLeaderboard('overallLeaderboard', overallSorted, (p, rank) => `
        <td class="rank ${rank <= 3 ? 'rank-' + rank : ''}">${rank}</td>
        <td class="player-name">${p.name}${p.isPlayer ? ' (You)' : ''}</td>
        <td>${p.completed}/60</td>
        <td class="score">${calculateScore(p).toLocaleString()}</td>
    `, playerStats.name);

    // Speedrun leaderboard
    const speedruns = JSON.parse(localStorage.getItem('gravityGolfSpeedruns') || '[]');
    renderLeaderboard('speedrunLeaderboard', speedruns, (run, rank) => `
        <td class="rank ${rank <= 3 ? 'rank-' + rank : ''}">${rank}</td>
        <td class="player-name">${run.playerName}${run.playerName === leaderboardData.playerName ? ' (You)' : ''}</td>
        <td>Lvl ${run.startLevel + 1}-60</td>
        <td class="score">${formatSpeedrunTime(run.time)}</td>
    `, leaderboardData.playerName);

    // Efficiency leaderboard
    const efficiencySorted = [...allPlayers]
        .filter(p => p.completed > 0)
        .sort((a, b) => {
            if (b.completed !== a.completed) return b.completed - a.completed;
            return a.totalNodes - b.totalNodes;
        });
    renderLeaderboard('efficiencyLeaderboard', efficiencySorted, (p, rank) => `
        <td class="rank ${rank <= 3 ? 'rank-' + rank : ''}">${rank}</td>
        <td class="player-name">${p.name}${p.isPlayer ? ' (You)' : ''}</td>
        <td>${p.completed}/60</td>
        <td class="score">${p.totalNodes}</td>
    `, playerStats.name);

    // Update level leaderboard
    updateLevelLeaderboard(parseInt(document.getElementById('levelLeaderboardSelect').value));
}

// Update leaderboard for specific level
function updateLevelLeaderboard(levelIndex) {
    const playerLevelStats = state.levelStats[levelIndex.toString()];
    const levelPlayers = [];

    if (playerLevelStats) {
        levelPlayers.push({
            name: leaderboardData.playerName,
            attempts: playerLevelStats.attempts,
            nodes: playerLevelStats.nodes,
            isPlayer: true
        });
    }

    leaderboardData.demoPlayers.forEach(player => {
        if (player.levels[levelIndex]) {
            levelPlayers.push({
                name: player.name,
                attempts: player.levels[levelIndex].attempts,
                nodes: player.levels[levelIndex].nodes,
                isPlayer: false
            });
        }
    });

    levelPlayers.sort((a, b) => {
        if (a.nodes !== b.nodes) return a.nodes - b.nodes;
        return a.attempts - b.attempts;
    });

    renderLeaderboard('levelLeaderboard', levelPlayers, (p, rank) => `
        <td class="rank ${rank <= 3 ? 'rank-' + rank : ''}">${rank}</td>
        <td class="player-name">${p.name}${p.isPlayer ? ' (You)' : ''}</td>
        <td>${p.attempts}</td>
        <td class="score">${p.nodes}</td>
    `, leaderboardData.playerName);
}

// Render leaderboard table
function renderLeaderboard(tableId, players, rowTemplate, playerName) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = '';

    if (players.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666; padding: 20px;">No data yet</td></tr>';
        return;
    }

    players.forEach((player, index) => {
        const tr = document.createElement('tr');
        if (player.name === playerName || player.isPlayer) {
            tr.classList.add('you');
        }
        tr.innerHTML = rowTemplate(player, index + 1);
        tbody.appendChild(tr);
    });
}

// Export for use in other modules
window.leaderboardData = leaderboardData;
window.initLeaderboard = initLeaderboard;
window.updateLeaderboards = updateLeaderboards;
window.updateLevelLeaderboard = updateLevelLeaderboard;
window.getPlayerStats = getPlayerStats;
window.calculateScore = calculateScore;
