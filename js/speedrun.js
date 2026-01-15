// Speedrun module - speedrun timer logic

// Format speedrun time as MM:SS.mmm
function formatSpeedrunTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

// Update speedrun timer display
function updateSpeedrunTimer() {
    const timerEl = document.getElementById('speedrunTimer');
    timerEl.textContent = formatSpeedrunTime(state.speedrunTime);
}

// Toggle speedrun mode
function toggleSpeedrun() {
    state.speedrunEnabled = !state.speedrunEnabled;
    const timerEl = document.getElementById('speedrunTimer');
    const toggleBtn = document.getElementById('speedrunToggle');

    if (state.speedrunEnabled) {
        state.speedrunTime = 0;
        state.speedrunStartLevel = state.currentLevel;
        state.speedrunLastUpdate = Date.now();
        timerEl.classList.add('active');
        toggleBtn.classList.add('active');
        toggleBtn.textContent = 'Stop Run';
    } else {
        timerEl.classList.remove('active', 'running');
        toggleBtn.classList.remove('active');
        toggleBtn.textContent = 'Speedrun';
    }
    updateSpeedrunTimer();
}

// Save speedrun time to local storage
function saveSpeedrunTime(time, startLevel) {
    try {
        const speedruns = JSON.parse(localStorage.getItem('gravityGolfSpeedruns') || '[]');
        speedruns.push({
            time: time,
            startLevel: startLevel,
            date: Date.now(),
            playerName: leaderboardData.playerName
        });
        // Keep only best 100 runs
        speedruns.sort((a, b) => a.time - b.time);
        speedruns.splice(100);
        localStorage.setItem('gravityGolfSpeedruns', JSON.stringify(speedruns));
        console.log(`Speedrun complete! Time: ${formatSpeedrunTime(time)}`);
    } catch (e) {
        console.log('Could not save speedrun time');
    }
}

// Export for use in other modules
window.formatSpeedrunTime = formatSpeedrunTime;
window.updateSpeedrunTimer = updateSpeedrunTimer;
window.toggleSpeedrun = toggleSpeedrun;
window.saveSpeedrunTime = saveSpeedrunTime;
