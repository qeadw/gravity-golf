// Level definitions - 60 levels across 6 pods

const levels = [
    // ========== POD 1: THE BASICS (1-10) ==========
    {
        name: "First Steps",
        ball: { x: 100, y: 300 },
        goal: { x: 800, y: 300, radius: 30 },
        obstacles: [],
        maxWells: 1,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Slight Curve",
        ball: { x: 100, y: 200 },
        goal: { x: 800, y: 400, radius: 30 },
        obstacles: [],
        maxWells: 2,
        launchAngle: 10,
        launchPower: 5
    },
    {
        name: "Over the Wall",
        ball: { x: 100, y: 500 },
        goal: { x: 800, y: 500, radius: 30 },
        obstacles: [
            { x: 450, y: 350, width: 30, height: 300 }
        ],
        maxWells: 3,
        launchAngle: -30,
        launchPower: 6
    },
    {
        name: "The Gap",
        ball: { x: 100, y: 150 },
        goal: { x: 800, y: 450, radius: 30 },
        obstacles: [
            { x: 400, y: 0, width: 30, height: 250 },
            { x: 400, y: 400, width: 30, height: 200 }
        ],
        maxWells: 3,
        launchAngle: 20,
        launchPower: 5
    },
    {
        name: "Zigzag",
        ball: { x: 80, y: 100 },
        goal: { x: 820, y: 500, radius: 30 },
        obstacles: [
            { x: 200, y: 0, width: 20, height: 400 },
            { x: 400, y: 200, width: 20, height: 400 },
            { x: 600, y: 0, width: 20, height: 400 }
        ],
        maxWells: 9,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Repulse",
        ball: { x: 100, y: 300 },
        goal: { x: 800, y: 300, radius: 30 },
        obstacles: [
            { x: 300, y: 200, width: 300, height: 30 },
            { x: 300, y: 370, width: 300, height: 30 },
            { x: 450, y: 230, width: 30, height: 140 }
        ],
        maxWells: 4,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "The Funnel",
        ball: { x: 250, y: 50 },
        goal: { x: 650, y: 550, radius: 25 },
        obstacles: [
            { x: 200, y: 150, width: 150, height: 20 },
            { x: 550, y: 150, width: 150, height: 20 },
            { x: 250, y: 300, width: 100, height: 20 },
            { x: 550, y: 300, width: 100, height: 20 },
            { x: 400, y: 400, width: 100, height: 20 }
        ],
        maxWells: 6,
        launchAngle: 60,
        launchPower: 4
    },
    {
        name: "Around the Block",
        ball: { x: 100, y: 300 },
        goal: { x: 800, y: 300, radius: 25 },
        obstacles: [
            { x: 350, y: 200, width: 200, height: 200 }
        ],
        maxWells: 3,
        launchAngle: -20,
        launchPower: 5
    },
    {
        name: "The Maze",
        ball: { x: 50, y: 300 },
        goal: { x: 850, y: 300, radius: 22 },
        obstacles: [
            { x: 250, y: 0, width: 15, height: 200 },
            { x: 250, y: 400, width: 15, height: 200 },
            { x: 500, y: 0, width: 15, height: 100 },
            { x: 500, y: 300, width: 15, height: 300 },
            { x: 750, y: 0, width: 15, height: 200 },
            { x: 750, y: 450, width: 15, height: 150 }
        ],
        maxWells: 8,
        launchAngle: 0,
        launchPower: 4
    },
    // BOSS LEVEL 10
    {
        name: "BOSS: Corridor",
        ball: { x: 50, y: 500 },
        goal: { x: 850, y: 100, radius: 22 },
        obstacles: [
            { x: 150, y: 0, width: 20, height: 350 },
            { x: 150, y: 450, width: 20, height: 150 },
            { x: 350, y: 0, width: 20, height: 150 },
            { x: 350, y: 250, width: 20, height: 350 },
            { x: 550, y: 0, width: 20, height: 400 },
            { x: 550, y: 500, width: 20, height: 100 },
            { x: 750, y: 0, width: 20, height: 200 },
            { x: 750, y: 300, width: 20, height: 300 }
        ],
        maxWells: 12,
        launchAngle: -30,
        launchPower: 4,
        isBoss: true
    },

    // ========== POD 2: MOVING TARGETS (11-20) ==========
    {
        name: "First Motion",
        ball: { x: 100, y: 325 },
        goal: { x: 900, y: 325, radius: 30 },
        obstacles: [],
        movingObstacles: [
            { x: 500, y: 200, width: 30, height: 150, axis: 'y', range: 200, speed: 2 }
        ],
        maxWells: 3,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Double Trouble",
        ball: { x: 100, y: 325 },
        goal: { x: 900, y: 325, radius: 30 },
        obstacles: [],
        movingObstacles: [
            { x: 350, y: 150, width: 25, height: 120, axis: 'y', range: 250, speed: 2.5 },
            { x: 650, y: 400, width: 25, height: 120, axis: 'y', range: 250, speed: 2.5 }
        ],
        maxWells: 6,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Horizontal Sweep",
        ball: { x: 100, y: 550 },
        goal: { x: 900, y: 100, radius: 28 },
        obstacles: [
            { x: 0, y: 300, width: 400, height: 20 }
        ],
        movingObstacles: [
            { x: 425, y: 350, width: 150, height: 20, axis: 'x', range: 850, speed: 3 }
        ],
        maxWells: 6,
        launchAngle: -45,
        launchPower: 5
    },
    {
        name: "The Gauntlet Run",
        ball: { x: 80, y: 325 },
        goal: { x: 920, y: 325, radius: 28 },
        obstacles: [],
        movingObstacles: [
            { x: 250, y: 100, width: 20, height: 100, axis: 'y', range: 350, speed: 3 },
            { x: 450, y: 450, width: 20, height: 100, axis: 'y', range: 350, speed: 3.5 },
            { x: 650, y: 150, width: 20, height: 100, axis: 'y', range: 300, speed: 2.5 }
        ],
        maxWells: 9,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Crossfire",
        ball: { x: 200, y: 600 },
        goal: { x: 800, y: 50, radius: 28 },
        obstacles: [],
        movingObstacles: [
            { x: 100, y: 250, width: 150, height: 20, axis: 'x', range: 300, speed: 4 },
            { x: 550, y: 350, width: 150, height: 20, axis: 'x', range: 300, speed: 4 }
        ],
        maxWells: 6,
        launchAngle: -60,
        launchPower: 5
    },
    {
        name: "Patience",
        ball: { x: 100, y: 325 },
        goal: { x: 900, y: 325, radius: 25 },
        obstacles: [
            { x: 400, y: 0, width: 20, height: 250 },
            { x: 400, y: 400, width: 20, height: 250 }
        ],
        movingObstacles: [
            { x: 385, y: 250, width: 50, height: 30, axis: 'y', range: 120, speed: 1.5 }
        ],
        maxWells: 4,
        launchAngle: 0,
        launchPower: 3
    },
    {
        name: "Windmill",
        ball: { x: 100, y: 550 },
        goal: { x: 900, y: 100, radius: 25 },
        obstacles: [],
        movingObstacles: [
            { x: 300, y: 200, width: 100, height: 20, axis: 'y', range: 300, speed: 2 },
            { x: 500, y: 400, width: 100, height: 20, axis: 'y', range: 300, speed: 2 },
            { x: 700, y: 150, width: 100, height: 20, axis: 'y', range: 300, speed: 2 }
        ],
        maxWells: 9,
        launchAngle: -30,
        launchPower: 5
    },
    {
        name: "Squeeze Play",
        ball: { x: 100, y: 550 },
        goal: { x: 900, y: 100, radius: 25 },
        obstacles: [],
        movingObstacles: [
            { x: 0, y: 100, width: 1000, height: 20, axis: 'y', range: 150, speed: 2 },
            { x: 0, y: 530, width: 1000, height: 20, axis: 'y', range: 150, speed: 2, phase: Math.PI }
        ],
        maxWells: 5,
        launchAngle: -20,
        launchPower: 5
    },
    {
        name: "The Grid",
        ball: { x: 80, y: 80 },
        goal: { x: 920, y: 570, radius: 25 },
        obstacles: [],
        movingObstacles: [
            { x: 250, y: 200, width: 20, height: 80, axis: 'y', range: 200, speed: 2 },
            { x: 500, y: 350, width: 20, height: 80, axis: 'y', range: 200, speed: 2.5 },
            { x: 750, y: 200, width: 20, height: 80, axis: 'y', range: 200, speed: 3 },
            { x: 350, y: 150, width: 80, height: 20, axis: 'x', range: 150, speed: 2 },
            { x: 600, y: 450, width: 80, height: 20, axis: 'x', range: 150, speed: 2.5 }
        ],
        maxWells: 12,
        launchAngle: 30,
        launchPower: 4
    },
    // BOSS LEVEL 20
    {
        name: "BOSS: Chaos Engine",
        ball: { x: 80, y: 325 },
        goal: { x: 920, y: 325, radius: 20 },
        obstacles: [
            { x: 200, y: 0, width: 15, height: 200 },
            { x: 200, y: 450, width: 15, height: 200 },
            { x: 800, y: 0, width: 15, height: 200 },
            { x: 800, y: 450, width: 15, height: 200 }
        ],
        movingObstacles: [
            { x: 350, y: 100, width: 25, height: 150, axis: 'y', range: 300, speed: 3 },
            { x: 500, y: 400, width: 25, height: 150, axis: 'y', range: 300, speed: 3.5 },
            { x: 650, y: 150, width: 25, height: 150, axis: 'y', range: 300, speed: 2.8 },
            { x: 300, y: 300, width: 100, height: 20, axis: 'x', range: 100, speed: 4 },
            { x: 600, y: 350, width: 100, height: 20, axis: 'x', range: 100, speed: 4 }
        ],
        maxWells: 18,
        launchAngle: 0,
        launchPower: 4,
        isBoss: true
    },

    // ========== POD 3: EVENT HORIZON (21-30) - BLACK HOLES ==========
    {
        name: "Gravitational Pull",
        ball: { x: 100, y: 350 },
        goal: { x: 1000, y: 350, radius: 30 },
        obstacles: [],
        blackHoles: [
            { x: 550, y: 350, radius: 40, strength: 60 }
        ],
        maxWells: 5,
        launchAngle: 0,
        launchPower: 6
    },
    {
        name: "Slingshot",
        ball: { x: 100, y: 600 },
        goal: { x: 1000, y: 100, radius: 28 },
        obstacles: [],
        blackHoles: [
            { x: 550, y: 350, radius: 35, strength: 60 }
        ],
        maxWells: 4,
        launchAngle: -20,
        launchPower: 5
    },
    {
        name: "Twin Suns",
        ball: { x: 100, y: 350 },
        goal: { x: 1000, y: 350, radius: 28 },
        obstacles: [],
        blackHoles: [
            { x: 400, y: 200, radius: 30, strength: 60 },
            { x: 700, y: 500, radius: 30, strength: 60 }
        ],
        maxWells: 6,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Orbital Mechanics",
        ball: { x: 550, y: 50 },
        goal: { x: 550, y: 650, radius: 28 },
        obstacles: [
            { x: 450, y: 300, width: 200, height: 20 }
        ],
        blackHoles: [
            { x: 300, y: 350, radius: 35, strength: 60 }
        ],
        maxWells: 6,
        launchAngle: 90,
        launchPower: 4
    },
    {
        name: "The Void",
        ball: { x: 100, y: 350 },
        goal: { x: 1000, y: 350, radius: 25 },
        obstacles: [],
        blackHoles: [
            { x: 550, y: 350, radius: 60, strength: 60 }
        ],
        maxWells: 4,
        launchAngle: -30,
        launchPower: 7
    },
    {
        name: "Black Hole Alley",
        ball: { x: 80, y: 350 },
        goal: { x: 1020, y: 350, radius: 25 },
        obstacles: [],
        blackHoles: [
            { x: 300, y: 200, radius: 25, strength: 60 },
            { x: 550, y: 500, radius: 25, strength: 60 },
            { x: 800, y: 200, radius: 25, strength: 60 }
        ],
        maxWells: 9,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Escape Velocity",
        ball: { x: 550, y: 650 },
        goal: { x: 550, y: 50, radius: 25 },
        obstacles: [],
        blackHoles: [
            { x: 550, y: 350, radius: 50, strength: 60 }
        ],
        maxWells: 5,
        launchAngle: -90,
        launchPower: 8
    },
    {
        name: "Constellation",
        ball: { x: 80, y: 80 },
        goal: { x: 1020, y: 620, radius: 25 },
        obstacles: [],
        blackHoles: [
            { x: 300, y: 250, radius: 25, strength: 30 },
            { x: 550, y: 450, radius: 25, strength: 30 },
            { x: 800, y: 300, radius: 25, strength: 30 },
            { x: 450, y: 150, radius: 25, strength: 30 }
        ],
        maxWells: 10,
        launchAngle: 30,
        launchPower: 5
    },
    {
        name: "Binary System",
        ball: { x: 100, y: 350 },
        goal: { x: 1000, y: 350, radius: 25 },
        obstacles: [
            { x: 500, y: 0, width: 20, height: 250 },
            { x: 500, y: 450, width: 20, height: 250 }
        ],
        blackHoles: [
            { x: 350, y: 350, radius: 35, strength: 60 },
            { x: 750, y: 350, radius: 35, strength: 60 }
        ],
        maxWells: 9,
        launchAngle: 0,
        launchPower: 5
    },
    // BOSS LEVEL 30
    {
        name: "BOSS: Singularity",
        ball: { x: 80, y: 350 },
        goal: { x: 1020, y: 350, radius: 18 },
        obstacles: [
            { x: 250, y: 0, width: 15, height: 280 },
            { x: 250, y: 420, width: 15, height: 280 }
        ],
        blackHoles: [
            { x: 550, y: 350, radius: 70, strength: 45 },
            { x: 400, y: 150, radius: 25, strength: 60 },
            { x: 700, y: 550, radius: 25, strength: 60 }
        ],
        maxWells: 15,
        launchAngle: 0,
        launchPower: 8,
        isBoss: true
    },

    // ========== POD 4: PORTAL STORM (31-40) ==========
    {
        name: "First Jump",
        ball: { x: 100, y: 375 },
        goal: { x: 1100, y: 375, radius: 30 },
        obstacles: [
            { x: 500, y: 0, width: 30, height: 750 }
        ],
        portals: [
            { x1: 400, y1: 375, x2: 600, y2: 375, radius: 25 }
        ],
        maxWells: 4,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Chain Reaction",
        ball: { x: 100, y: 650 },
        goal: { x: 1100, y: 100, radius: 28 },
        obstacles: [
            { x: 250, y: 300, width: 20, height: 400 },
            { x: 650, y: 0, width: 20, height: 350 }
        ],
        portals: [
            { x1: 350, y1: 550, x2: 550, y2: 200, radius: 25 },
            { x1: 750, y1: 300, x2: 950, y2: 150, radius: 25 }
        ],
        maxWells: 5,
        launchAngle: -20,
        launchPower: 5
    },
    {
        name: "Wrong Way",
        ball: { x: 1100, y: 375 },
        goal: { x: 100, y: 375, radius: 28 },
        obstacles: [
            { x: 300, y: 0, width: 20, height: 300 },
            { x: 300, y: 450, width: 20, height: 300 }
        ],
        portals: [
            { x1: 200, y1: 375, x2: 1000, y2: 200, radius: 25 }
        ],
        maxWells: 5,
        launchAngle: 180,
        launchPower: 5
    },
    {
        name: "Triangle",
        ball: { x: 600, y: 700 },
        goal: { x: 600, y: 50, radius: 25 },
        obstacles: [
            { x: 500, y: 300, width: 200, height: 20 },
            { x: 400, y: 550, width: 400, height: 20 }
        ],
        portals: [
            { x1: 200, y1: 500, x2: 1000, y2: 500, radius: 25 },
            { x1: 300, y1: 200, x2: 900, y2: 200, radius: 25 }
        ],
        maxWells: 5,
        launchAngle: -90,
        launchPower: 4
    },
    {
        name: "Maze Warp",
        ball: { x: 80, y: 100 },
        goal: { x: 1120, y: 650, radius: 25 },
        obstacles: [
            { x: 300, y: 0, width: 20, height: 500 },
            { x: 600, y: 250, width: 20, height: 500 },
            { x: 900, y: 0, width: 20, height: 500 }
        ],
        portals: [
            { x1: 200, y1: 400, x2: 450, y2: 600, radius: 22 },
            { x1: 500, y1: 150, x2: 750, y2: 650, radius: 22 }
        ],
        maxWells: 9,
        launchAngle: 45,
        launchPower: 4
    },
    {
        name: "Reflection",
        ball: { x: 100, y: 375 },
        goal: { x: 1100, y: 375, radius: 25 },
        obstacles: [
            { x: 580, y: 0, width: 40, height: 300 },
            { x: 580, y: 450, width: 40, height: 300 }
        ],
        portals: [
            { x1: 300, y1: 200, x2: 900, y2: 200, radius: 28 },
            { x1: 300, y1: 550, x2: 900, y2: 550, radius: 28 }
        ],
        maxWells: 6,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Four Corners",
        ball: { x: 200, y: 375 },
        goal: { x: 1050, y: 375, radius: 25 },
        obstacles: [
            { x: 400, y: 275, width: 400, height: 200 }
        ],
        portals: [
            { x1: 150, y1: 100, x2: 1050, y2: 650, radius: 22 },
            { x1: 150, y1: 650, x2: 1050, y2: 100, radius: 22 }
        ],
        maxWells: 6,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Stairway",
        ball: { x: 80, y: 700 },
        goal: { x: 1120, y: 50, radius: 25 },
        obstacles: [],
        portals: [
            { x1: 200, y1: 600, x2: 400, y2: 450, radius: 22 },
            { x1: 500, y1: 350, x2: 700, y2: 250, radius: 22 },
            { x1: 800, y1: 150, x2: 1000, y2: 100, radius: 22 }
        ],
        maxWells: 6,
        launchAngle: -30,
        launchPower: 5
    },
    {
        name: "Loop de Loop",
        ball: { x: 100, y: 375 },
        goal: { x: 300, y: 375, radius: 25 },
        obstacles: [
            { x: 200, y: 0, width: 20, height: 300 },
            { x: 200, y: 450, width: 20, height: 300 },
            { x: 500, y: 200, width: 20, height: 350 },
            { x: 800, y: 200, width: 20, height: 350 }
        ],
        portals: [
            { x1: 150, y1: 375, x2: 650, y2: 100, radius: 25 },
            { x1: 950, y1: 650, x2: 350, y2: 375, radius: 25 }
        ],
        maxWells: 8,
        launchAngle: 0,
        launchPower: 4
    },
    // BOSS LEVEL 40
    {
        name: "BOSS: Dimension Rift",
        ball: { x: 80, y: 375 },
        goal: { x: 1120, y: 375, radius: 18 },
        obstacles: [
            { x: 250, y: 0, width: 15, height: 280 },
            { x: 250, y: 470, width: 15, height: 280 },
            { x: 600, y: 0, width: 15, height: 270 },
            { x: 600, y: 480, width: 15, height: 270 },
            { x: 950, y: 0, width: 15, height: 280 },
            { x: 950, y: 470, width: 15, height: 280 }
        ],
        movingObstacles: [
            { x: 400, y: 280, width: 20, height: 80, axis: 'y', range: 150, speed: 2.5 },
            { x: 750, y: 390, width: 20, height: 80, axis: 'y', range: 150, speed: 3 }
        ],
        portals: [
            { x1: 150, y1: 200, x2: 450, y2: 600, radius: 20 },
            { x1: 500, y1: 150, x2: 800, y2: 600, radius: 20 },
            { x1: 850, y1: 200, x2: 1050, y2: 550, radius: 20 }
        ],
        blackHoles: [
            { x: 350, y: 375, radius: 25, strength: 40 },
            { x: 700, y: 375, radius: 25, strength: 40 }
        ],
        maxWells: 15,
        launchAngle: 0,
        launchPower: 4,
        isBoss: true
    },

    // ========== POD 5: PINBALL WIZARD (41-50) - BUMPERS ==========
    {
        name: "First Bounce",
        ball: { x: 100, y: 400 },
        goal: { x: 1200, y: 400, radius: 30 },
        obstacles: [],
        bumpers: [
            { x: 650, y: 400, radius: 40 }
        ],
        maxWells: 3,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Ricochet",
        ball: { x: 100, y: 700 },
        goal: { x: 1200, y: 100, radius: 28 },
        obstacles: [],
        bumpers: [
            { x: 400, y: 500, radius: 35 },
            { x: 800, y: 300, radius: 35 }
        ],
        maxWells: 5,
        launchAngle: -30,
        launchPower: 4
    },
    {
        name: "Bumper Alley",
        ball: { x: 100, y: 400 },
        goal: { x: 1200, y: 400, radius: 25 },
        obstacles: [
            { x: 600, y: 0, width: 15, height: 300 },
            { x: 600, y: 500, width: 15, height: 300 }
        ],
        bumpers: [
            { x: 300, y: 250, radius: 35 },
            { x: 300, y: 550, radius: 35 },
            { x: 500, y: 400, radius: 30 },
            { x: 750, y: 300, radius: 35 },
            { x: 750, y: 500, radius: 35 },
            { x: 950, y: 400, radius: 30 },
            { x: 1100, y: 250, radius: 30 },
            { x: 1100, y: 550, radius: 30 }
        ],
        maxWells: 10,
        launchAngle: 0,
        launchPower: 3
    },
    {
        name: "Pinball Classic",
        ball: { x: 650, y: 750 },
        goal: { x: 650, y: 50, radius: 28 },
        obstacles: [
            { x: 0, y: 400, width: 300, height: 20 },
            { x: 1000, y: 400, width: 300, height: 20 }
        ],
        bumpers: [
            { x: 400, y: 300, radius: 35 },
            { x: 650, y: 450, radius: 35 },
            { x: 900, y: 300, radius: 35 },
            { x: 550, y: 200, radius: 25 },
            { x: 750, y: 200, radius: 25 }
        ],
        maxWells: 10,
        launchAngle: -90,
        launchPower: 5
    },
    {
        name: "The Gauntlet",
        ball: { x: 80, y: 400 },
        goal: { x: 1220, y: 400, radius: 25 },
        obstacles: [
            { x: 600, y: 0, width: 20, height: 300 },
            { x: 600, y: 500, width: 20, height: 300 }
        ],
        bumpers: [
            { x: 300, y: 250, radius: 30 },
            { x: 300, y: 550, radius: 30 },
            { x: 500, y: 400, radius: 40 },
            { x: 800, y: 400, radius: 40 },
            { x: 1000, y: 250, radius: 30 },
            { x: 1000, y: 550, radius: 30 }
        ],
        maxWells: 10,
        launchAngle: 0,
        launchPower: 4
    },
    {
        name: "Multiball",
        ball: { x: 650, y: 400 },
        goal: { x: 1200, y: 700, radius: 22 },
        obstacles: [
            { x: 1050, y: 500, width: 15, height: 300 }
        ],
        bumpers: [
            { x: 500, y: 400, radius: 30 },
            { x: 800, y: 400, radius: 30 },
            { x: 650, y: 200, radius: 30 },
            { x: 650, y: 600, radius: 30 },
            { x: 350, y: 250, radius: 35 },
            { x: 950, y: 550, radius: 35 },
            { x: 350, y: 550, radius: 30 },
            { x: 950, y: 250, radius: 30 }
        ],
        blackHoles: [
            { x: 200, y: 400, radius: 30, strength: 50 }
        ],
        maxWells: 12,
        launchAngle: 45,
        launchPower: 4
    },
    {
        name: "Cascade",
        ball: { x: 100, y: 100 },
        goal: { x: 1200, y: 700, radius: 25 },
        obstacles: [],
        movingObstacles: [
            { x: 200, y: 150, width: 150, height: 8, axis: 'x', range: 200, speed: 3 },
            { x: 600, y: 300, width: 150, height: 8, axis: 'x', range: 200, speed: 3.5 },
            { x: 400, y: 500, width: 150, height: 8, axis: 'x', range: 250, speed: 2.5 },
            { x: 900, y: 600, width: 150, height: 8, axis: 'x', range: 200, speed: 3 }
        ],
        bumpers: [
            { x: 300, y: 200, radius: 30 },
            { x: 500, y: 350, radius: 30 },
            { x: 700, y: 250, radius: 30 },
            { x: 900, y: 400, radius: 30 },
            { x: 1100, y: 550, radius: 30 }
        ],
        maxWells: 10,
        launchAngle: 30,
        launchPower: 4
    },
    {
        name: "Fortress",
        ball: { x: 100, y: 400 },
        goal: { x: 650, y: 400, radius: 25 },
        obstacles: [],
        bumpers: [
            { x: 650, y: 200, radius: 35 },
            { x: 650, y: 600, radius: 35 },
            { x: 450, y: 400, radius: 35 },
            { x: 850, y: 400, radius: 35 },
            { x: 550, y: 300, radius: 25 },
            { x: 750, y: 300, radius: 25 },
            { x: 550, y: 500, radius: 25 },
            { x: 750, y: 500, radius: 25 }
        ],
        maxWells: 12,
        launchAngle: 0,
        launchPower: 5
    },
    {
        name: "Speed Run",
        ball: { x: 80, y: 750 },
        goal: { x: 1220, y: 50, radius: 22 },
        obstacles: [
            { x: 350, y: 500, width: 15, height: 200 },
            { x: 750, y: 100, width: 15, height: 250 }
        ],
        movingObstacles: [
            { x: 550, y: 350, width: 20, height: 100, axis: 'y', range: 150, speed: 3 },
            { x: 950, y: 200, width: 20, height: 80, axis: 'y', range: 120, speed: 2.5 }
        ],
        bumpers: [
            { x: 200, y: 600, radius: 35 },
            { x: 450, y: 400, radius: 30 },
            { x: 650, y: 250, radius: 30 },
            { x: 850, y: 500, radius: 30 },
            { x: 1100, y: 150, radius: 35 }
        ],
        blackHoles: [
            { x: 500, y: 550, radius: 25, strength: 45 }
        ],
        maxWells: 12,
        launchAngle: -45,
        launchPower: 5
    },
    // BOSS LEVEL 50
    {
        name: "BOSS: Pinball Pandemonium",
        ball: { x: 80, y: 400 },
        goal: { x: 1220, y: 400, radius: 18 },
        obstacles: [
            { x: 400, y: 0, width: 15, height: 300 },
            { x: 400, y: 500, width: 15, height: 300 },
            { x: 900, y: 0, width: 15, height: 300 },
            { x: 900, y: 500, width: 15, height: 300 }
        ],
        bumpers: [
            { x: 250, y: 300, radius: 35 },
            { x: 250, y: 500, radius: 35 },
            { x: 550, y: 400, radius: 40 },
            { x: 650, y: 200, radius: 30 },
            { x: 650, y: 600, radius: 30 },
            { x: 750, y: 400, radius: 40 },
            { x: 1050, y: 300, radius: 35 },
            { x: 1050, y: 500, radius: 35 }
        ],
        maxWells: 15,
        launchAngle: 0,
        launchPower: 4,
        isBoss: true
    },

    // ========== POD 6: THE GAUNTLET - CHALLENGE LEVELS (51-60) ==========
    {
        name: "Challenge: Everything",
        ball: { x: 100, y: 450 },
        goal: { x: 1400, y: 450, radius: 28 },
        obstacles: [
            { x: 500, y: 0, width: 20, height: 350 },
            { x: 1000, y: 550, width: 20, height: 350 }
        ],
        movingObstacles: [
            { x: 300, y: 200, width: 25, height: 100, axis: 'y', range: 400, speed: 2.5 }
        ],
        blackHoles: [
            { x: 750, y: 450, radius: 35, strength: 60 }
        ],
        portals: [
            { x1: 600, y1: 600, x2: 900, y2: 200, radius: 22 }
        ],
        bumpers: [
            { x: 1200, y: 350, radius: 30 },
            { x: 1200, y: 550, radius: 30 }
        ],
        maxWells: 12,
        launchAngle: 0,
        launchPower: 5,
        isChallenge: true
    },
    {
        name: "Challenge: Chaos Theory",
        ball: { x: 750, y: 850 },
        goal: { x: 750, y: 50, radius: 25 },
        obstacles: [],
        movingObstacles: [
            { x: 300, y: 300, width: 150, height: 20, axis: 'x', range: 250, speed: 3 },
            { x: 1050, y: 500, width: 150, height: 20, axis: 'x', range: 250, speed: 3 }
        ],
        blackHoles: [
            { x: 400, y: 600, radius: 30, strength: 60 },
            { x: 1100, y: 300, radius: 30, strength: 60 }
        ],
        bumpers: [
            { x: 600, y: 450, radius: 35 },
            { x: 900, y: 450, radius: 35 }
        ],
        maxWells: 10,
        launchAngle: -90,
        launchPower: 5,
        isChallenge: true
    },
    {
        name: "Challenge: Portal Madness",
        ball: { x: 100, y: 100 },
        goal: { x: 1400, y: 800, radius: 25 },
        obstacles: [
            { x: 400, y: 300, width: 300, height: 20 },
            { x: 800, y: 580, width: 300, height: 20 }
        ],
        portals: [
            { x1: 300, y1: 200, x2: 600, y2: 500, radius: 22 },
            { x1: 700, y1: 400, x2: 1000, y2: 700, radius: 22 },
            { x1: 1100, y1: 300, x2: 1300, y2: 750, radius: 22 }
        ],
        blackHoles: [
            { x: 500, y: 700, radius: 35, strength: 60 }
        ],
        bumpers: [
            { x: 900, y: 200, radius: 30 }
        ],
        maxWells: 12,
        launchAngle: 30,
        launchPower: 4,
        isChallenge: true
    },
    {
        name: "Challenge: Black Hole Sun",
        ball: { x: 100, y: 450 },
        goal: { x: 1400, y: 450, radius: 25 },
        obstacles: [
            { x: 350, y: 0, width: 15, height: 350 },
            { x: 350, y: 550, width: 15, height: 350 },
            { x: 1150, y: 0, width: 15, height: 350 },
            { x: 1150, y: 550, width: 15, height: 350 }
        ],
        blackHoles: [
            { x: 750, y: 450, radius: 60, strength: 45 },
            { x: 500, y: 200, radius: 30, strength: 45 },
            { x: 500, y: 700, radius: 30, strength: 45 },
            { x: 1000, y: 200, radius: 30, strength: 45 },
            { x: 1000, y: 700, radius: 30, strength: 45 }
        ],
        movingObstacles: [
            { x: 250, y: 350, width: 20, height: 80, axis: 'y', range: 150, speed: 2 }
        ],
        maxWells: 14,
        launchAngle: 0,
        launchPower: 7,
        isChallenge: true
    },
    {
        name: "Challenge: Bumper Kingdom",
        ball: { x: 100, y: 450 },
        goal: { x: 1400, y: 450, radius: 25 },
        obstacles: [
            { x: 700, y: 300, width: 100, height: 300 }
        ],
        bumpers: [
            { x: 300, y: 300, radius: 35 },
            { x: 300, y: 600, radius: 35 },
            { x: 500, y: 450, radius: 40 },
            { x: 900, y: 200, radius: 35 },
            { x: 900, y: 700, radius: 35 },
            { x: 1100, y: 350, radius: 30 },
            { x: 1100, y: 550, radius: 30 },
            { x: 1250, y: 450, radius: 35 }
        ],
        portals: [
            { x1: 600, y1: 150, x2: 850, y2: 750, radius: 22 }
        ],
        movingObstacles: [
            { x: 400, y: 150, width: 100, height: 20, axis: 'y', range: 100, speed: 2 }
        ],
        maxWells: 16,
        launchAngle: 0,
        launchPower: 4,
        isChallenge: true
    },
    {
        name: "Challenge: The Labyrinth",
        ball: { x: 80, y: 80 },
        goal: { x: 1420, y: 820, radius: 22 },
        obstacles: [
            { x: 200, y: 0, width: 15, height: 600 },
            { x: 400, y: 300, width: 15, height: 600 },
            { x: 600, y: 0, width: 15, height: 500 },
            { x: 800, y: 400, width: 15, height: 500 },
            { x: 1000, y: 0, width: 15, height: 600 },
            { x: 1200, y: 300, width: 15, height: 600 }
        ],
        portals: [
            { x1: 100, y1: 600, x2: 300, y2: 100, radius: 20 },
            { x1: 500, y1: 750, x2: 700, y2: 150, radius: 20 },
            { x1: 900, y1: 800, x2: 1100, y2: 100, radius: 20 }
        ],
        blackHoles: [
            { x: 300, y: 450, radius: 25, strength: 40 },
            { x: 700, y: 450, radius: 25, strength: 40 },
            { x: 1100, y: 450, radius: 25, strength: 40 }
        ],
        maxWells: 18,
        launchAngle: 45,
        launchPower: 4,
        isChallenge: true
    },
    {
        name: "Challenge: TemporalRift",
        ball: { x: 750, y: 450 },
        goal: { x: 100, y: 450, radius: 22 },
        obstacles: [],
        movingObstacles: [
            { x: 300, y: 200, width: 25, height: 120, axis: 'y', range: 400, speed: 3 },
            { x: 600, y: 500, width: 25, height: 120, axis: 'y', range: 400, speed: 3.5 },
            { x: 900, y: 150, width: 25, height: 120, axis: 'y', range: 400, speed: 2.5 },
            { x: 1200, y: 400, width: 25, height: 120, axis: 'y', range: 400, speed: 4 }
        ],
        portals: [
            { x1: 650, y1: 450, x2: 1350, y2: 450, radius: 25 }
        ],
        blackHoles: [
            { x: 450, y: 300, radius: 30, strength: 60 },
            { x: 1050, y: 600, radius: 30, strength: 60 }
        ],
        bumpers: [
            { x: 200, y: 300, radius: 30 },
            { x: 200, y: 600, radius: 30 }
        ],
        maxWells: 15,
        launchAngle: 180,
        launchPower: 5,
        isChallenge: true
    },
    {
        name: "Challenge: Orbit Trap",
        ball: { x: 750, y: 850 },
        goal: { x: 750, y: 50, radius: 22 },
        obstacles: [
            { x: 600, y: 350, width: 300, height: 200 }
        ],
        blackHoles: [
            { x: 750, y: 450, radius: 50, strength: 60 }
        ],
        bumpers: [
            { x: 400, y: 300, radius: 35 },
            { x: 400, y: 600, radius: 35 },
            { x: 1100, y: 300, radius: 35 },
            { x: 1100, y: 600, radius: 35 }
        ],
        portals: [
            { x1: 250, y1: 450, x2: 1250, y2: 450, radius: 25 }
        ],
        movingObstacles: [
            { x: 550, y: 150, width: 100, height: 20, axis: 'x', range: 200, speed: 3 },
            { x: 850, y: 700, width: 100, height: 20, axis: 'x', range: 200, speed: 3 }
        ],
        maxWells: 15,
        launchAngle: -90,
        launchPower: 6,
        isChallenge: true
    },
    {
        name: "Challenge: Singularity Storm",
        ball: { x: 100, y: 450 },
        goal: { x: 1400, y: 450, radius: 20 },
        obstacles: [
            { x: 300, y: 0, width: 15, height: 350 },
            { x: 300, y: 550, width: 15, height: 350 },
            { x: 700, y: 200, width: 15, height: 250 },
            { x: 700, y: 550, width: 15, height: 250 },
            { x: 1100, y: 0, width: 15, height: 350 },
            { x: 1100, y: 550, width: 15, height: 350 }
        ],
        blackHoles: [
            { x: 500, y: 450, radius: 45, strength: 45 },
            { x: 900, y: 450, radius: 45, strength: 45 }
        ],
        movingObstacles: [
            { x: 400, y: 350, width: 20, height: 60, axis: 'y', range: 150, speed: 2.5 },
            { x: 800, y: 500, width: 20, height: 60, axis: 'y', range: 150, speed: 2.5 },
            { x: 1200, y: 350, width: 20, height: 60, axis: 'y', range: 150, speed: 2.5 }
        ],
        portals: [
            { x1: 200, y1: 200, x2: 600, y2: 700, radius: 20 },
            { x1: 1000, y1: 200, x2: 1300, y2: 650, radius: 20 }
        ],
        bumpers: [
            { x: 200, y: 450, radius: 25 },
            { x: 1300, y: 300, radius: 25 },
            { x: 1300, y: 600, radius: 25 }
        ],
        maxWells: 20,
        launchAngle: 0,
        launchPower: 7,
        isChallenge: true
    },
    // FINAL BOSS LEVEL 60
    {
        name: "FINAL: The Impossibility",
        ball: { x: 80, y: 450 },
        goal: { x: 1420, y: 450, radius: 18 },
        obstacles: [
            { x: 250, y: 0, width: 12, height: 380 },
            { x: 250, y: 520, width: 12, height: 380 },
            { x: 500, y: 150, width: 12, height: 300 },
            { x: 500, y: 550, width: 12, height: 300 },
            { x: 750, y: 0, width: 12, height: 400 },
            { x: 750, y: 500, width: 12, height: 400 },
            { x: 1000, y: 100, width: 12, height: 350 },
            { x: 1000, y: 550, width: 12, height: 350 },
            { x: 1250, y: 0, width: 12, height: 380 },
            { x: 1250, y: 520, width: 12, height: 380 }
        ],
        movingObstacles: [
            { x: 350, y: 380, width: 20, height: 50, axis: 'y', range: 100, speed: 2 },
            { x: 600, y: 450, width: 20, height: 50, axis: 'y', range: 100, speed: 2.5 },
            { x: 850, y: 400, width: 20, height: 50, axis: 'y', range: 100, speed: 2 },
            { x: 1100, y: 450, width: 20, height: 50, axis: 'y', range: 100, speed: 2.5 }
        ],
        blackHoles: [
            { x: 400, y: 250, radius: 30, strength: 45 },
            { x: 650, y: 650, radius: 30, strength: 45 },
            { x: 900, y: 250, radius: 30, strength: 45 },
            { x: 1150, y: 650, radius: 30, strength: 45 }
        ],
        portals: [
            { x1: 150, y1: 200, x2: 300, y2: 700, radius: 18 },
            { x1: 550, y1: 100, x2: 700, y2: 800, radius: 18 },
            { x1: 950, y1: 100, x2: 1100, y2: 800, radius: 18 },
            { x1: 1350, y1: 200, x2: 1350, y2: 700, radius: 18 }
        ],
        bumpers: [
            { x: 180, y: 450, radius: 25 },
            { x: 420, y: 450, radius: 25 },
            { x: 680, y: 450, radius: 25 },
            { x: 820, y: 450, radius: 25 },
            { x: 1080, y: 450, radius: 25 },
            { x: 1320, y: 450, radius: 25 }
        ],
        maxWells: 25,
        launchAngle: 0,
        launchPower: 6,
        isBoss: true,
        isChallenge: true
    }
];

// Helper function to get pod index from level index
function getPod(levelIndex) {
    return Math.floor(levelIndex / 10);
}

// Export for use in other modules
window.levels = levels;
window.getPod = getPod;
