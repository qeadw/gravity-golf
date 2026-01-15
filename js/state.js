// Game State - Central state object for the game
const state = {
    currentLevel: 0,
    ball: null,
    goal: null,
    obstacles: [],
    movingObstacles: [],
    blackHoles: [],
    portals: [],
    bumpers: [],
    wells: [],
    wellHistory: [],
    maxWells: 5,
    wellMode: 'attractor',
    selectedWell: null,
    ballLaunched: false,
    gameOver: false,
    completedLevels: new Set(),
    trail: [],
    maxTrailLength: 50,
    gameTime: 0,
    cheatsEnabled: false,
    cheatBuffer: '',
    portalCooldown: 0,
    currentAttempt: 1,
    levelStats: {},
    failTimeout: null,
    speedrunEnabled: false,
    speedrunTime: 0,
    speedrunStartLevel: 0,
    speedrunLastUpdate: 0,
    isTestingLevel: false,
    testLevel: null
};

// Pod names for each set of 10 levels
const POD_NAMES = [
    'The Basics',
    'Moving Targets',
    'Event Horizon',
    'Portal Storm',
    'Pinball Wizard',
    'The Gauntlet'
];

// Pod hints shown in instructions
const POD_HINTS = [
    '',
    '<br><span style="color: #ffaa00;">⚠️ Moving obstacles!</span>',
    '<br><span style="color: #8800ff;">⚠️ Black holes pull and destroy!</span>',
    '<br><span style="color: #00ffaa;">⚠️ Portals teleport the ball!</span>',
    '<br><span style="color: #00aaff;">⚠️ Bumpers bounce the ball!</span>',
    '<br><span style="color: #ff4444;">⚠️ All hazards combined!</span>'
];

// Canvas sizes for each pod
const CANVAS_SIZES = {
    0: { width: 900, height: 600 },   // Pod 1
    1: { width: 1000, height: 650 },  // Pod 2
    2: { width: 1100, height: 700 },  // Pod 3
    3: { width: 1200, height: 750 },  // Pod 4
    4: { width: 1300, height: 800 },  // Pod 5
    5: { width: 1400, height: 850 }   // Pod 6
};

// Pod goals: { maxAttempts, maxNodes } - fallback when no leaderboard data
const POD_GOALS = [
    { maxAttempts: 70, maxNodes: 30 },   // Pod 1: The Basics
    { maxAttempts: 75, maxNodes: 25 },   // Pod 2: Moving Targets
    { maxAttempts: 130, maxNodes: 55 },  // Pod 3: Event Horizon
    { maxAttempts: 40, maxNodes: 70 },   // Pod 4: Portal Storm
    { maxAttempts: 50, maxNodes: 90 },   // Pod 5: Pinball Wizard
    { maxAttempts: 60, maxNodes: 120 }   // Pod 6: The Gauntlet
];

// Dynamic level targets based on top 100 leaderboard averages
const levelTargets = {
    data: {},  // { levelIndex: { avgAttempts, avgNodes, count } }
    lastFetch: 0,
    fetchInterval: 5 * 60 * 1000, // 5 minutes

    async fetchTargets() {
        try {
            const response = await fetch('/api/level-stats');
            if (response.ok) {
                const data = await response.json();
                this.data = data.podAverages || {};
                this.lastFetch = Date.now();
            }
        } catch (e) {
            console.log('Could not fetch level targets, using defaults');
        }
    },

    getGoalsForPod(podIndex) {
        if (this.data[podIndex]) {
            return {
                maxAttempts: Math.ceil(this.data[podIndex].avgAttempts),
                maxNodes: Math.ceil(this.data[podIndex].avgNodes)
            };
        }
        return POD_GOALS[podIndex] || POD_GOALS[5];
    }
};

// Save/load functions
function saveData() {
    try {
        localStorage.setItem('gravityGolfData', JSON.stringify({
            completedLevels: Array.from(state.completedLevels),
            levelStats: state.levelStats,
            currentLevel: state.currentLevel
        }));
    } catch (e) {
        console.log('Could not save game data');
    }
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('gravityGolfData');
        if (saved) {
            const data = JSON.parse(saved);
            state.completedLevels = new Set(data.completedLevels || []);
            state.levelStats = data.levelStats || {};
            state.currentLevel = data.currentLevel || 0;
        }
    } catch (e) {
        console.log('Could not load saved data');
    }
}

// Export for use in other modules
window.state = state;
window.POD_NAMES = POD_NAMES;
window.POD_HINTS = POD_HINTS;
window.CANVAS_SIZES = CANVAS_SIZES;
window.POD_GOALS = POD_GOALS;
window.levelTargets = levelTargets;
window.saveData = saveData;
window.loadSavedData = loadSavedData;
