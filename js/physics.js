// Physics constants and collision detection

const PHYSICS = {
    friction: 0.999,
    minSpeed: 0.1,
    maxSpeed: 15,
    wellStrengthMin: 50,
    wellStrengthMax: 300,
    wellStrengthDefault: 150,
    blackHoleStrength: 400,
    bumperForce: 8
};

// Check if line of sight between two points is blocked by an obstacle
function isBlockedByObstacle(x1, y1, x2, y2, obstacles) {
    for (const obs of obstacles) {
        if (lineIntersectsRect(x1, y1, x2, y2, obs.x, obs.y, obs.width, obs.height)) {
            return true;
        }
    }
    return false;
}

// Check if a line segment intersects a rectangle
function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // Check if line intersects any of the 4 edges of the rectangle
    return lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
           lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh) ||
           lineIntersectsLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh) ||
           lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
}

// Check if two line segments intersect
function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    if (denom === 0) return false;

    const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denom;
    const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denom;

    return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
}

// Get current max speed (considering cheat mode)
function getMaxSpeed() {
    return state.cheatsEnabled ? PHYSICS.maxSpeed * 5 : PHYSICS.maxSpeed;
}

// Export for use in other modules
window.PHYSICS = PHYSICS;
window.isBlockedByObstacle = isBlockedByObstacle;
window.lineIntersectsRect = lineIntersectsRect;
window.lineIntersectsLine = lineIntersectsLine;
window.getMaxSpeed = getMaxSpeed;
