// UI module - event handlers and counters

// Update well counter display
function updateWellCounter() {
    document.getElementById('wellCounter').textContent =
        `Wells: ${state.wells.length} / ${state.maxWells}`;
}

// Update attempt counter display
function updateAttemptCounter() {
    document.getElementById('attemptCounter').textContent = `Attempt: ${state.currentAttempt}`;
}

// Show message overlay
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'show ' + type;
}

// Hide message overlay
function hideMessage() {
    document.getElementById('message').className = '';
}

// Update level grid in level select modal
function updateLevelGrid() {
    const container = document.getElementById('levelGridContainer');
    container.innerHTML = '';

    for (let pod = 0; pod < 6; pod++) {
        const label = document.createElement('div');
        label.className = 'pod-label';
        label.textContent = `${POD_NAMES[pod]} (${pod * 10 + 1}-${pod * 10 + 10})`;
        container.appendChild(label);

        // Calculate pod totals
        let podAttempts = 0;
        let podNodes = 0;
        let podCompleted = 0;
        for (let i = 0; i < 10; i++) {
            const levelIndex = pod * 10 + i;
            if (levelIndex >= levels.length) break;
            if (state.completedLevels.has(levelIndex)) {
                podCompleted++;
                const stats = state.levelStats[levelIndex.toString()];
                if (stats) {
                    podAttempts += stats.attempts;
                    podNodes += stats.nodes;
                }
            }
        }

        // Add pod goals
        const goals = POD_GOALS[pod];
        const goalsDiv = document.createElement('div');
        goalsDiv.className = 'pod-goals';
        const attemptsGoal = podCompleted === 10 && podAttempts <= goals.maxAttempts;
        const nodesGoal = podCompleted === 10 && podNodes <= goals.maxNodes;
        if (podCompleted === 10 && attemptsGoal && nodesGoal) {
            goalsDiv.classList.add('achieved');
        }
        goalsDiv.innerHTML = `Goals: ${podAttempts}/${goals.maxAttempts} attempts | ${podNodes}/${goals.maxNodes} nodes`;
        container.appendChild(goalsDiv);

        const grid = document.createElement('div');
        grid.className = 'level-grid';

        for (let i = 0; i < 10; i++) {
            const levelIndex = pod * 10 + i;
            if (levelIndex >= levels.length) break;

            const level = levels[levelIndex];
            const btn = document.createElement('button');
            btn.className = 'btn level-btn';

            // Create level number span
            const numSpan = document.createElement('span');
            numSpan.className = 'level-num';
            numSpan.textContent = levelIndex + 1;
            btn.appendChild(numSpan);

            // Add stats if completed
            const stats = state.levelStats[levelIndex.toString()];
            if (stats) {
                const statsSpan = document.createElement('span');
                statsSpan.className = 'level-stats';
                statsSpan.textContent = `${stats.attempts}/${stats.nodes}`;
                btn.appendChild(statsSpan);
            }

            if (state.completedLevels.has(levelIndex)) {
                btn.classList.add('completed');
            }

            if (level.isBoss) {
                btn.classList.add('boss');
            }

            if (level.isChallenge && !level.isBoss) {
                btn.classList.add('challenge');
            }

            const isUnlocked = state.cheatsEnabled ||
                              levelIndex === 0 ||
                              state.completedLevels.has(levelIndex - 1) ||
                              state.completedLevels.has(levelIndex);

            if (!isUnlocked) {
                btn.classList.add('locked');
            } else {
                btn.addEventListener('click', () => {
                    loadLevel(levelIndex);
                    document.getElementById('levelSelect').classList.remove('show');
                });
            }

            grid.appendChild(btn);
        }

        container.appendChild(grid);
    }
}

// Initialize UI event handlers
function initUI(canvas) {
    // Button event handlers
    document.getElementById('launchBtn').addEventListener('click', launchBall);
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (state.failTimeout) {
            clearTimeout(state.failTimeout);
            state.failTimeout = null;
        }
        const shouldIncrement = state.ballLaunched && !state.gameOver;
        resetLevel(shouldIncrement);
    });

    document.getElementById('attractorBtn').addEventListener('click', () => {
        state.wellMode = 'attractor';
        document.getElementById('attractorBtn').classList.add('active');
        document.getElementById('repulsorBtn').classList.remove('active');
    });

    document.getElementById('repulsorBtn').addEventListener('click', () => {
        state.wellMode = 'repulsor';
        document.getElementById('repulsorBtn').classList.add('active');
        document.getElementById('attractorBtn').classList.remove('active');
    });

    document.getElementById('clearWellsBtn').addEventListener('click', () => {
        if (state.wells.length > 0) {
            state.wellHistory.push([...state.wells.map(w => ({ x: w.x, y: w.y, type: w.type, strength: w.strength }))]);
        }
        state.wells = [];
        updateWellCounter();
    });

    document.getElementById('undoBtn').addEventListener('click', () => {
        if (state.wellHistory.length > 0) {
            const previous = state.wellHistory.pop();
            state.wells = previous.map(w => new GravityWell(w.x, w.y, w.type, w.strength));
            updateWellCounter();
        } else if (state.wells.length > 0) {
            state.wells.pop();
            updateWellCounter();
        }
    });

    document.getElementById('levelSelectBtn').addEventListener('click', () => {
        updateLevelGrid();
        document.getElementById('levelSelect').classList.add('show');
    });

    document.getElementById('speedrunToggle').addEventListener('click', toggleSpeedrun);

    document.getElementById('closeLevelSelect').addEventListener('click', () => {
        document.getElementById('levelSelect').classList.remove('show');
    });

    // Canvas event handlers
    canvas.addEventListener('click', (e) => {
        if (state.ballLaunched) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        for (let i = state.wells.length - 1; i >= 0; i--) {
            if (state.wells[i].contains(x, y)) {
                state.selectedWell = state.wells[i];
                return;
            }
        }

        if (state.wells.length < state.maxWells) {
            state.wellHistory.push([...state.wells.map(w => ({ x: w.x, y: w.y, type: w.type, strength: w.strength }))]);
            const well = new GravityWell(x, y, state.wellMode);
            state.wells.push(well);
            updateWellCounter();
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        for (let i = state.wells.length - 1; i >= 0; i--) {
            if (state.wells[i].contains(x, y)) {
                state.wells.splice(i, 1);
                state.wellHistory = [];
                updateWellCounter();
                return;
            }
        }
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        for (const well of state.wells) {
            if (well.contains(x, y)) {
                well.strength += e.deltaY > 0 ? -20 : 20;
                well.strength = Math.max(PHYSICS.wellStrengthMin,
                               Math.min(PHYSICS.wellStrengthMax, well.strength));
                return;
            }
        }
    });

    // Keyboard event handlers
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            launchBall();
        } else if (e.code === 'KeyR') {
            if (state.failTimeout) {
                clearTimeout(state.failTimeout);
                state.failTimeout = null;
            }
            const shouldIncrement = state.ballLaunched && !state.gameOver;
            resetLevel(shouldIncrement);
        } else if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.getElementById('undoBtn').click();
        } else if (e.code === 'KeyQ') {
            state.wellMode = 'attractor';
            document.getElementById('attractorBtn').classList.add('active');
            document.getElementById('repulsorBtn').classList.remove('active');
        } else if (e.code === 'KeyE') {
            state.wellMode = 'repulsor';
            document.getElementById('repulsorBtn').classList.add('active');
            document.getElementById('attractorBtn').classList.remove('active');
        } else if (e.code === 'KeyF') {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        }

        // Arrow keys move selected well
        if (state.selectedWell && !state.ballLaunched) {
            const moveAmount = e.shiftKey ? 10 : 1;
            let dx = 0, dy = 0;
            if (e.code === 'ArrowLeft') { e.preventDefault(); dx = -moveAmount; }
            else if (e.code === 'ArrowRight') { e.preventDefault(); dx = moveAmount; }
            else if (e.code === 'ArrowUp') { e.preventDefault(); dy = -moveAmount; }
            else if (e.code === 'ArrowDown') { e.preventDefault(); dy = moveAmount; }

            if (dx !== 0 || dy !== 0) {
                const newX = state.selectedWell.x + dx;
                const newY = state.selectedWell.y + dy;
                const collides = !state.cheatsEnabled && state.wells.some(w => {
                    if (w === state.selectedWell) return false;
                    const dist = Math.sqrt((newX - w.x) ** 2 + (newY - w.y) ** 2);
                    return dist < w.radius + 10;
                });
                if (!collides) {
                    state.selectedWell.x = newX;
                    state.selectedWell.y = newY;
                }
            }
        }

        // Cheat code detection
        if (e.key.length === 1) {
            state.cheatBuffer += e.key.toLowerCase();
            if (state.cheatBuffer.length > 7) {
                state.cheatBuffer = state.cheatBuffer.slice(-7);
            }
            if (state.cheatBuffer === 'cheater') {
                state.cheatsEnabled = !state.cheatsEnabled;
                state.cheatBuffer = '';
                if (state.cheatsEnabled) {
                    state.maxWells = 999;
                    document.getElementById('wellCounter').style.color = '#ffd700';
                    console.log('Cheats enabled: Infinite wells, all levels unlocked');
                } else {
                    state.maxWells = levels[state.currentLevel].maxWells;
                    document.getElementById('wellCounter').style.color = '';
                    console.log('Cheats disabled');
                }
                updateWellCounter();
            }
        }
    });
}

// Export for use in other modules
window.updateWellCounter = updateWellCounter;
window.updateAttemptCounter = updateAttemptCounter;
window.showMessage = showMessage;
window.hideMessage = hideMessage;
window.updateLevelGrid = updateLevelGrid;
window.initUI = initUI;
