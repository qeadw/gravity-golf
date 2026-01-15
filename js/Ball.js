// Ball class - the player's golf ball

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
        this.launched = false;
    }

    launch(angle, power) {
        const rad = angle * Math.PI / 180;
        this.vx = Math.cos(rad) * power;
        this.vy = Math.sin(rad) * power;
        this.launched = true;
    }

    update(wells, blackHoles, obstacles) {
        if (!this.launched) return;

        // Apply gravity from player wells (blocked by obstacles)
        for (const well of wells) {
            // Check if wall blocks line of sight to well
            if (isBlockedByObstacle(this.x, this.y, well.x, well.y, obstacles)) {
                continue; // Gravity doesn't go through walls
            }

            const dx = well.x - this.x;
            const dy = well.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 10) {
                const force = well.strength / (dist * dist) * (well.type === 'attractor' ? 1 : -1);
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
        }

        // Apply gravity from black holes (linear falloff for stronger pull)
        for (const bh of blackHoles) {
            const dx = bh.x - this.x;
            const dy = bh.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 10) {
                // Linear falloff instead of inverse square for much stronger pull
                const force = bh.strength / dist;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
        }

        // Apply friction
        this.vx *= PHYSICS.friction;
        this.vy *= PHYSICS.friction;

        // Clamp speed (5x max speed in cheat mode)
        const maxSpeed = getMaxSpeed();
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        const canvas = document.getElementById('gameCanvas');
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -0.8;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -0.8;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -0.8;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -0.8;
        }
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(100, 100, 255, 0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    isStopped() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        return speed < PHYSICS.minSpeed;
    }
}

// Export for use in other modules
window.Ball = Ball;
