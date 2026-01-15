// Main module - entry point, game loop, and core game functions

let canvas, ctx;

// Resize canvas based on current level's pod
function resizeCanvas(levelIndex) {
    const pod = getPod(levelIndex);
    const size = CANVAS_SIZES[pod] || CANVAS_SIZES[5];
    canvas.width = size.width;
    canvas.height = size.height;
}

// Load a level
function loadLevel(index) {
    const level = levels[index];
    state.currentLevel = index;
    state.isTestingLevel = false;
    state.testLevel = null;

    resizeCanvas(index);

    state.ball = new Ball(level.ball.x, level.ball.y);
    state.goal = { ...level.goal };
    state.obstacles = (level.obstacles || []).map(o => ({ ...o }));
    state.movingObstacles = (level.movingObstacles || []).map(o => ({
        ...o,
        originalX: o.x,
        originalY: o.y,
        phase: o.phase || 0
    }));
    state.blackHoles = (level.blackHoles || []).map(bh => ({ ...bh }));
    state.portals = (level.portals || []).map(p => ({ ...p }));
    state.bumpers = (level.bumpers || []).map(b => ({ ...b }));
    state.wells = [];
    state.wellHistory = [];
    state.maxWells = state.cheatsEnabled ? 999 : level.maxWells;
    state.ballLaunched = false;
    state.gameOver = false;
    state.trail = [];
    state.gameTime = 0;
    state.lastTime = 0;
    state.accumulator = 0;
    state.currentAttempt = 1;

    document.getElementById('currentLevel').textContent = index + 1;

    // Show level-specific instructions
    const instructions = document.getElementById('instructions');
    if (index === 0) {
        instructions.innerHTML = '<strong>Attractors</strong> (blue) pull, <strong>Repulsors</strong> (red) push. Right-click to remove wells. <span id="obstacleHint"></span>';
        instructions.style.display = 'block';
    } else if (index === 1) {
        instructions.innerHTML = '<strong>Tip:</strong> Use the scroll wheel to adjust well strength. <span id="obstacleHint"></span>';
        instructions.style.display = 'block';
    } else if (index === 2) {
        instructions.innerHTML = '<strong>Tip:</strong> Click a well to select it, then use arrow keys for micro-movements. <span id="obstacleHint"></span>';
        instructions.style.display = 'block';
    } else if (index === 3) {
        instructions.innerHTML = '<strong>Shortcuts:</strong> Q = Attractor, E = Repulsor, F = Fullscreen, Space = Launch, R = Reset <span id="obstacleHint"></span>';
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
    document.getElementById('podName').textContent = POD_NAMES[getPod(index)];
    document.getElementById('obstacleHint').innerHTML = POD_HINTS[getPod(index)];
    updateWellCounter();
    updateAttemptCounter();
    hideMessage();
    saveData();
}

// Reset current level
function resetLevel(incrementAttempt = false) {
    const level = state.isTestingLevel ? state.testLevel : levels[state.currentLevel];
    state.ball = new Ball(level.ball.x, level.ball.y);
    state.ballLaunched = false;
    state.gameOver = false;
    state.trail = [];
    state.gameTime = 0;
    state.lastTime = 0;
    state.accumulator = 0;
    state.portalCooldown = 0;

    if (incrementAttempt) {
        state.currentAttempt++;
        updateAttemptCounter();
    }

    // Reset moving obstacles
    if (!state.isTestingLevel) {
        state.movingObstacles = (level.movingObstacles || []).map(o => ({
            ...o,
            originalX: o.x,
            originalY: o.y,
            phase: o.phase || 0
        }));
    }

    hideMessage();
}

// Reset test level
function resetTestLevel() {
    if (!state.testLevel) return;
    const testLevel = state.testLevel;

    state.ball = new Ball(testLevel.ball.x, testLevel.ball.y);
    state.goal = { ...testLevel.goal };
    state.obstacles = testLevel.obstacles.map(o => ({ ...o }));
    state.movingObstacles = [];
    state.blackHoles = testLevel.blackHoles.map(bh => ({ ...bh }));
    state.portals = testLevel.portals.map(p => ({ ...p }));
    state.bumpers = testLevel.bumpers.map(b => ({ ...b }));
    state.wells = [];
    state.wellHistory = [];
    state.ballLaunched = false;
    state.gameOver = false;
    state.trail = [];
    state.currentAttempt = 1;

    updateWellCounter();
    updateAttemptCounter();
    hideMessage();
}

// Launch the ball
function launchBall() {
    if (state.ballLaunched) return;

    const level = state.isTestingLevel ? state.testLevel : levels[state.currentLevel];
    state.gameTime = 0;
    state.ball.launch(level.launchAngle, level.launchPower);
    state.ballLaunched = true;
}

// Update moving obstacles
function updateMovingObstacles() {
    for (const obs of state.movingObstacles) {
        const offset = Math.sin(state.gameTime * obs.speed * 0.01 + (obs.phase || 0)) * obs.range / 2;
        if (obs.axis === 'x') {
            obs.x = obs.originalX + offset;
        } else {
            obs.y = obs.originalY + offset;
        }
    }
}

// Check portal collision
function checkPortalCollision() {
    if (state.portalCooldown > 0) {
        state.portalCooldown--;
        return;
    }

    for (const portal of state.portals) {
        const dx1 = state.ball.x - portal.x1;
        const dy1 = state.ball.y - portal.y1;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        if (dist1 < state.ball.radius + portal.radius) {
            state.ball.x = portal.x2;
            state.ball.y = portal.y2;
            state.portalCooldown = 30;
            return;
        }

        const dx2 = state.ball.x - portal.x2;
        const dy2 = state.ball.y - portal.y2;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < state.ball.radius + portal.radius) {
            state.ball.x = portal.x1;
            state.ball.y = portal.y1;
            state.portalCooldown = 30;
            return;
        }
    }
}

// Check bumper collision
function checkBumperCollision() {
    for (const bumper of state.bumpers) {
        const dx = state.ball.x - bumper.x;
        const dy = state.ball.y - bumper.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < state.ball.radius + bumper.radius) {
            const nx = dx / dist;
            const ny = dy / dist;

            state.ball.x = bumper.x + nx * (state.ball.radius + bumper.radius + 1);
            state.ball.y = bumper.y + ny * (state.ball.radius + bumper.radius + 1);

            const dot = state.ball.vx * nx + state.ball.vy * ny;
            state.ball.vx = (state.ball.vx - 2 * dot * nx) + nx * PHYSICS.bumperForce;
            state.ball.vy = (state.ball.vy - 2 * dot * ny) + ny * PHYSICS.bumperForce;
        }
    }
}

// Check all collisions
function checkCollisions() {
    if (state.gameOver) return;

    const ball = state.ball;

    // Check goal
    const gdx = ball.x - state.goal.x;
    const gdy = ball.y - state.goal.y;
    const gDist = Math.sqrt(gdx * gdx + gdy * gdy);

    if (gDist < ball.radius + state.goal.radius) {
        state.gameOver = true;
        onWin();
        return;
    }

    // Check black holes
    for (const bh of state.blackHoles) {
        const dx = ball.x - bh.x;
        const dy = ball.y - bh.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ball.radius + bh.radius) {
            state.gameOver = true;
            onFail();
            return;
        }
    }

    // Check static obstacles
    for (const obs of state.obstacles) {
        if (ball.x + ball.radius > obs.x &&
            ball.x - ball.radius < obs.x + obs.width &&
            ball.y + ball.radius > obs.y &&
            ball.y - ball.radius < obs.y + obs.height) {
            state.gameOver = true;
            onFail();
            return;
        }
    }

    // Check moving obstacles
    for (const obs of state.movingObstacles) {
        if (ball.x + ball.radius > obs.x &&
            ball.x - ball.radius < obs.x + obs.width &&
            ball.y + ball.radius > obs.y &&
            ball.y - ball.radius < obs.y + obs.height) {
            state.gameOver = true;
            onFail();
            return;
        }
    }

    checkPortalCollision();
    checkBumperCollision();

    // Check if ball stopped
    if (ball.launched && ball.isStopped()) {
        state.gameOver = true;
        onFail();
    }
}

// Handle win
function onWin() {
    if (state.isTestingLevel) {
        showMessage('TEST PASSED!', 'win');
        setTimeout(() => resetTestLevel(), 1500);
        return;
    }

    state.completedLevels.add(state.currentLevel);

    // Save level stats
    const levelKey = state.currentLevel.toString();
    const currentStats = state.levelStats[levelKey] || { attempts: Infinity, nodes: Infinity };
    if (state.currentAttempt < currentStats.attempts || state.wells.length < currentStats.nodes) {
        state.levelStats[levelKey] = {
            attempts: Math.min(state.currentAttempt, currentStats.attempts),
            nodes: Math.min(state.wells.length, currentStats.nodes)
        };
    }
    saveData();

    showMessage('NICE!', 'win');

    setTimeout(() => {
        if (state.currentLevel < levels.length - 1) {
            loadLevel(state.currentLevel + 1);
        } else {
            showMessage('YOU WIN!', 'win');

            if (state.speedrunEnabled) {
                saveSpeedrunTime(state.speedrunTime, state.speedrunStartLevel);
                state.speedrunEnabled = false;
                document.getElementById('speedrunToggle').classList.remove('active');
                document.getElementById('speedrunToggle').textContent = 'Speedrun';
            }
        }
    }, 1500);
}

// Handle fail
function onFail() {
    showMessage('MISS!', 'fail');
    state.failTimeout = setTimeout(() => resetLevel(true), 1000);
}

// Fixed timestep physics update
function fixedUpdate() {
    if (state.ball && state.ball.launched && !state.gameOver) {
        state.gameTime++;
        updateMovingObstacles();
        state.ball.update(state.wells, state.blackHoles, [...state.obstacles, ...state.movingObstacles]);

        // Update speedrun timer
        if (state.speedrunEnabled) {
            const now = Date.now();
            state.speedrunTime += now - state.speedrunLastUpdate;
            state.speedrunLastUpdate = now;
            document.getElementById('speedrunTimer').classList.add('running');
            updateSpeedrunTimer();
        }

        state.trail.push({ x: state.ball.x, y: state.ball.y });
        if (state.trail.length > state.maxTrailLength) {
            state.trail.shift();
        }

        checkCollisions();
    } else if (!state.ballLaunched) {
        state.gameTime++;
        updateMovingObstacles();

        if (state.speedrunEnabled) {
            state.speedrunLastUpdate = Date.now();
            document.getElementById('speedrunTimer').classList.remove('running');
        }
    }
}

// Main game loop
function gameLoop(currentTime) {
    fixedUpdate();
    render(ctx, canvas);
    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    loadSavedData();
    initLeaderboard();
    initEditor();
    levelTargets.fetchTargets();
    initUI(canvas);

    document.getElementById('attractorBtn').classList.add('active');
    loadLevel(state.currentLevel);
    requestAnimationFrame(gameLoop);

    console.log('Gravity Golf loaded! 60 levels of gravitational puzzle action.');
}

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for use in other modules
window.loadLevel = loadLevel;
window.resetLevel = resetLevel;
window.resetTestLevel = resetTestLevel;
window.launchBall = launchBall;
window.onWin = onWin;
window.onFail = onFail;
