// Renderer module - all draw functions

// Draw the goal target
function drawGoal(ctx) {
    const goal = state.goal;

    const gradient = ctx.createRadialGradient(goal.x, goal.y, 0, goal.x, goal.y, goal.radius * 1.5);
    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.6)');
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');

    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.fill();
}

// Draw static and moving obstacles
function drawObstacles(ctx) {
    // Static obstacles
    for (const obs of state.obstacles) {
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ff6666';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Moving obstacles
    for (const obs of state.movingObstacles) {
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffcc44';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// Draw black holes with accretion disk effect
function drawBlackHoles(ctx) {
    for (const bh of state.blackHoles) {
        // Accretion disk effect
        const gradient = ctx.createRadialGradient(bh.x, bh.y, bh.radius * 0.5, bh.x, bh.y, bh.radius * 3);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.3, 'rgba(80, 0, 120, 0.8)');
        gradient.addColorStop(0.6, 'rgba(120, 0, 180, 0.4)');
        gradient.addColorStop(1, 'rgba(80, 0, 120, 0)');

        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Event horizon
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Singularity
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

// Draw portal pairs with pulsing effect
function drawPortals(ctx) {
    for (const portal of state.portals) {
        const time = Date.now() / 500;

        // Portal 1
        const gradient1 = ctx.createRadialGradient(portal.x1, portal.y1, 0, portal.x1, portal.y1, portal.radius * 1.5);
        gradient1.addColorStop(0, 'rgba(0, 255, 170, 0.8)');
        gradient1.addColorStop(0.5, 'rgba(0, 200, 150, 0.4)');
        gradient1.addColorStop(1, 'rgba(0, 255, 170, 0)');

        ctx.beginPath();
        ctx.arc(portal.x1, portal.y1, portal.radius * (1.2 + Math.sin(time) * 0.1), 0, Math.PI * 2);
        ctx.fillStyle = gradient1;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(portal.x1, portal.y1, portal.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Portal 2
        const gradient2 = ctx.createRadialGradient(portal.x2, portal.y2, 0, portal.x2, portal.y2, portal.radius * 1.5);
        gradient2.addColorStop(0, 'rgba(0, 255, 170, 0.8)');
        gradient2.addColorStop(0.5, 'rgba(0, 200, 150, 0.4)');
        gradient2.addColorStop(1, 'rgba(0, 255, 170, 0)');

        ctx.beginPath();
        ctx.arc(portal.x2, portal.y2, portal.radius * (1.2 + Math.sin(time + Math.PI) * 0.1), 0, Math.PI * 2);
        ctx.fillStyle = gradient2;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(portal.x2, portal.y2, portal.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Connection line
        ctx.beginPath();
        ctx.moveTo(portal.x1, portal.y1);
        ctx.lineTo(portal.x2, portal.y2);
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// Draw bumpers with pulsing glow
function drawBumpers(ctx) {
    for (const bumper of state.bumpers) {
        const time = Date.now() / 300;
        const pulse = 1 + Math.sin(time) * 0.1;

        // Glow
        const gradient = ctx.createRadialGradient(bumper.x, bumper.y, 0, bumper.x, bumper.y, bumper.radius * 1.5);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');

        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bumper
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#00aaff';
        ctx.fill();
        ctx.strokeStyle = '#00ddff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Draw ball trail
function drawTrail(ctx) {
    if (state.trail.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(state.trail[0].x, state.trail[0].y);

    for (let i = 1; i < state.trail.length; i++) {
        ctx.lineTo(state.trail[i].x, state.trail[i].y);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw launch direction indicator
function drawLaunchIndicator(ctx, canvas) {
    if (state.ballLaunched) return;

    const ball = state.ball;
    const level = state.isTestingLevel ? state.testLevel : levels[state.currentLevel];
    const rad = level.launchAngle * Math.PI / 180;
    const length = level.launchPower * 10;

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(
        ball.x + Math.cos(rad) * length,
        ball.y + Math.sin(rad) * length
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    const arrowX = ball.x + Math.cos(rad) * length;
    const arrowY = ball.y + Math.sin(rad) * length;

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - Math.cos(rad - 0.3) * 10,
        arrowY - Math.sin(rad - 0.3) * 10
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - Math.cos(rad + 0.3) * 10,
        arrowY - Math.sin(rad + 0.3) * 10
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
}

// Draw background stars
function drawStars(ctx, canvas) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 80; i++) {
        const x = (i * 73 + state.currentLevel * 17) % canvas.width;
        const y = (i * 137 + state.currentLevel * 23) % canvas.height;
        const size = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Main render function
function render(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars(ctx, canvas);
    drawGoal(ctx);
    drawObstacles(ctx);
    drawBlackHoles(ctx);
    drawPortals(ctx);
    drawBumpers(ctx);
    drawTrail(ctx);

    for (const well of state.wells) {
        well.draw(ctx);
    }

    drawLaunchIndicator(ctx, canvas);

    if (state.ball) {
        state.ball.draw(ctx);
    }
}

// Export for use in other modules
window.drawGoal = drawGoal;
window.drawObstacles = drawObstacles;
window.drawBlackHoles = drawBlackHoles;
window.drawPortals = drawPortals;
window.drawBumpers = drawBumpers;
window.drawTrail = drawTrail;
window.drawLaunchIndicator = drawLaunchIndicator;
window.drawStars = drawStars;
window.render = render;
