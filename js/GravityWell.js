// GravityWell class - attractors and repulsors placed by player

class GravityWell {
    constructor(x, y, type = 'attractor', strength = PHYSICS.wellStrengthDefault) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.strength = strength;
        this.radius = 20;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    draw(ctx) {
        const pulse = Math.sin(this.pulsePhase + Date.now() / 200) * 0.2 + 1;
        const visualRadius = this.radius * pulse;
        const strengthRatio = (this.strength - PHYSICS.wellStrengthMin) /
                             (PHYSICS.wellStrengthMax - PHYSICS.wellStrengthMin);
        const fieldRadius = 50 + strengthRatio * 100;

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, fieldRadius);
        if (this.type === 'attractor') {
            gradient.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 100, 100, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, fieldRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw selection ring if selected
        if (state.selectedWell === this) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, visualRadius + 8, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, visualRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'attractor' ? '#4a9eff' : '#ff6b6b';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type === 'attractor' ? '+' : '-', this.x, this.y);

        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(Math.round(this.strength), this.x, this.y + visualRadius + 12);
    }

    contains(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius + 10;
    }
}

// Export for use in other modules
window.GravityWell = GravityWell;
