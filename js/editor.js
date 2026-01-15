// Level Editor module

const editor = {
    canvas: null,
    ctx: null,
    tool: 'ball',
    ball: { x: 100, y: 300 },
    goal: { x: 800, y: 300, radius: 30 },
    obstacles: [],
    blackHoles: [],
    portals: [],
    bumpers: [],
    portalStart: null,
    dragStart: null,
    selectedObject: null,
    zoomScale: 1,
    isDragging: false,
    draggedObject: null
};

function initEditor() {
    editor.canvas = document.getElementById('editorCanvas');
    editor.ctx = editor.canvas.getContext('2d');

    // Tool buttons
    document.querySelectorAll('.editor-tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.editor-tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            editor.tool = btn.dataset.tool;
            editor.portalStart = null;
        });
    });

    // Canvas size
    document.getElementById('applyCanvasSize').addEventListener('click', () => {
        editor.canvas.width = parseInt(document.getElementById('editorWidth').value);
        editor.canvas.height = parseInt(document.getElementById('editorHeight').value);
        applyEditorZoom();
        renderEditor();
    });

    setupEditorEvents();
}

function applyEditorZoom() {
    const container = document.querySelector('.editor-canvas-container');
    const sidebar = document.querySelector('.editor-sidebar');
    const availableWidth = window.innerWidth - sidebar.offsetWidth - 60;
    const availableHeight = window.innerHeight - 60;

    const scaleX = availableWidth / editor.canvas.width;
    const scaleY = availableHeight / editor.canvas.height;
    const scale = Math.min(scaleX, scaleY, 1);

    if (scale < 1) {
        editor.canvas.style.transform = `scale(${scale})`;
        editor.canvas.style.transformOrigin = 'top left';
        editor.zoomScale = scale;
    } else {
        editor.canvas.style.transform = '';
        editor.zoomScale = 1;
    }
}

function getEditorMousePos(e) {
    const rect = editor.canvas.getBoundingClientRect();
    const scale = editor.zoomScale || 1;
    return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale
    };
}

function findObjectAt(x, y) {
    // Check black holes
    for (const bh of editor.blackHoles) {
        const dx = x - bh.x;
        const dy = y - bh.y;
        if (Math.sqrt(dx*dx + dy*dy) < bh.radius + 10) {
            return { type: 'blackhole', obj: bh };
        }
    }
    // Check bumpers
    for (const b of editor.bumpers) {
        const dx = x - b.x;
        const dy = y - b.y;
        if (Math.sqrt(dx*dx + dy*dy) < b.radius + 10) {
            return { type: 'bumper', obj: b };
        }
    }
    // Check portals
    for (const p of editor.portals) {
        const dx1 = x - p.x1, dy1 = y - p.y1;
        const dx2 = x - p.x2, dy2 = y - p.y2;
        if (Math.sqrt(dx1*dx1 + dy1*dy1) < p.radius + 10) {
            return { type: 'portal1', obj: p };
        }
        if (Math.sqrt(dx2*dx2 + dy2*dy2) < p.radius + 10) {
            return { type: 'portal2', obj: p };
        }
    }
    // Check obstacles
    for (const o of editor.obstacles) {
        if (x >= o.x && x <= o.x + o.width && y >= o.y && y <= o.y + o.height) {
            return { type: 'obstacle', obj: o };
        }
    }
    // Check ball
    const bdx = x - editor.ball.x, bdy = y - editor.ball.y;
    if (Math.sqrt(bdx*bdx + bdy*bdy) < 15) {
        return { type: 'ball', obj: editor.ball };
    }
    // Check goal
    const gdx = x - editor.goal.x, gdy = y - editor.goal.y;
    if (Math.sqrt(gdx*gdx + gdy*gdy) < editor.goal.radius + 10) {
        return { type: 'goal', obj: editor.goal };
    }
    return null;
}

function setupEditorEvents() {
    // Canvas click
    editor.canvas.addEventListener('mousedown', (e) => {
        const pos = getEditorMousePos(e);
        const x = pos.x, y = pos.y;

        const found = findObjectAt(x, y);
        if (found && editor.tool !== 'delete') {
            editor.isDragging = true;
            editor.draggedObject = found;
            editor.selectedObject = found;
            return;
        }

        if (editor.tool === 'ball') {
            editor.ball = { x, y };
        } else if (editor.tool === 'goal') {
            editor.goal = { x, y, radius: 30 };
        } else if (editor.tool === 'obstacle') {
            editor.dragStart = { x, y };
        } else if (editor.tool === 'blackhole') {
            editor.blackHoles.push({ x, y, radius: 35, strength: 60 });
        } else if (editor.tool === 'portal') {
            if (!editor.portalStart) {
                editor.portalStart = { x, y };
            } else {
                editor.portals.push({ x1: editor.portalStart.x, y1: editor.portalStart.y, x2: x, y2: y, radius: 25 });
                editor.portalStart = null;
            }
        } else if (editor.tool === 'bumper') {
            editor.bumpers.push({ x, y, radius: 35 });
        } else if (editor.tool === 'delete') {
            deleteObjectAt(x, y);
        }
        updateObjectList();
        renderEditor();
    });

    editor.canvas.addEventListener('mouseup', (e) => {
        if (editor.isDragging) {
            editor.isDragging = false;
            editor.draggedObject = null;
            updateObjectList();
            renderEditor();
            return;
        }

        if (editor.tool === 'obstacle' && editor.dragStart) {
            const pos = getEditorMousePos(e);
            const x = pos.x, y = pos.y;

            const minX = Math.min(editor.dragStart.x, x);
            const minY = Math.min(editor.dragStart.y, y);
            const width = Math.abs(x - editor.dragStart.x);
            const height = Math.abs(y - editor.dragStart.y);

            if (width > 5 && height > 5) {
                editor.obstacles.push({ x: minX, y: minY, width, height });
            }
            editor.dragStart = null;
            updateObjectList();
            renderEditor();
        }
    });

    editor.canvas.addEventListener('mousemove', (e) => {
        const pos = getEditorMousePos(e);
        const x = pos.x, y = pos.y;

        if (editor.isDragging && editor.draggedObject) {
            const obj = editor.draggedObject;
            if (obj.type === 'ball') {
                editor.ball.x = x;
                editor.ball.y = y;
            } else if (obj.type === 'goal') {
                editor.goal.x = x;
                editor.goal.y = y;
            } else if (obj.type === 'blackhole' || obj.type === 'bumper') {
                obj.obj.x = x;
                obj.obj.y = y;
            } else if (obj.type === 'portal1') {
                obj.obj.x1 = x;
                obj.obj.y1 = y;
            } else if (obj.type === 'portal2') {
                obj.obj.x2 = x;
                obj.obj.y2 = y;
            } else if (obj.type === 'obstacle') {
                obj.obj.x = x - obj.obj.width / 2;
                obj.obj.y = y - obj.obj.height / 2;
            }
            renderEditor();
            return;
        }

        if (editor.tool === 'obstacle' && editor.dragStart) {
            renderEditor();
            editor.ctx.strokeStyle = 'rgba(255, 68, 68, 0.5)';
            editor.ctx.lineWidth = 2;
            editor.ctx.strokeRect(
                Math.min(editor.dragStart.x, x),
                Math.min(editor.dragStart.y, y),
                Math.abs(x - editor.dragStart.x),
                Math.abs(y - editor.dragStart.y)
            );
        }
    });

    // Right-click to delete
    editor.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const pos = getEditorMousePos(e);
        deleteObjectAt(pos.x, pos.y);
        updateObjectList();
        renderEditor();
    });

    // Scroll to resize selected object
    editor.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const pos = getEditorMousePos(e);
        const found = findObjectAt(pos.x, pos.y);

        if (found) {
            const delta = e.deltaY > 0 ? -5 : 5;
            if (found.type === 'blackhole') {
                found.obj.radius = Math.max(15, Math.min(80, found.obj.radius + delta));
                found.obj.strength = Math.max(20, Math.min(100, found.obj.strength + delta));
            } else if (found.type === 'bumper') {
                found.obj.radius = Math.max(15, Math.min(60, found.obj.radius + delta));
            } else if (found.type === 'goal') {
                editor.goal.radius = Math.max(15, Math.min(50, editor.goal.radius + delta));
            } else if (found.type.startsWith('portal')) {
                found.obj.radius = Math.max(15, Math.min(40, found.obj.radius + delta));
            } else if (found.type === 'obstacle') {
                found.obj.width = Math.max(10, found.obj.width + delta * 2);
                found.obj.height = Math.max(10, found.obj.height + delta * 2);
            }
            updateObjectList();
            renderEditor();
        }
    });

    // Export
    document.getElementById('exportLevel').addEventListener('click', exportLevel);
    document.getElementById('copyJson').addEventListener('click', () => {
        const output = document.getElementById('editorOutput');
        output.select();
        document.execCommand('copy');
    });

    // Import
    document.getElementById('importLevel').addEventListener('click', importLevel);

    // Test level
    document.getElementById('testLevel').addEventListener('click', testEditorLevel);

    // Close editor
    document.getElementById('closeEditor').addEventListener('click', () => {
        document.getElementById('levelEditor').classList.remove('show');
    });

    // Open editor
    document.getElementById('openEditorBtn').addEventListener('click', () => {
        document.getElementById('levelSelect').classList.remove('show');
        document.getElementById('levelEditor').classList.add('show');
        applyEditorZoom();
        updateObjectList();
        renderEditor();
    });
}

function deleteObjectAt(x, y) {
    for (let i = editor.blackHoles.length - 1; i >= 0; i--) {
        const bh = editor.blackHoles[i];
        const dx = x - bh.x;
        const dy = y - bh.y;
        if (Math.sqrt(dx*dx + dy*dy) < bh.radius + 10) {
            editor.blackHoles.splice(i, 1);
            return;
        }
    }
    for (let i = editor.bumpers.length - 1; i >= 0; i--) {
        const b = editor.bumpers[i];
        const dx = x - b.x;
        const dy = y - b.y;
        if (Math.sqrt(dx*dx + dy*dy) < b.radius + 10) {
            editor.bumpers.splice(i, 1);
            return;
        }
    }
    for (let i = editor.portals.length - 1; i >= 0; i--) {
        const p = editor.portals[i];
        const dx1 = x - p.x1, dy1 = y - p.y1;
        const dx2 = x - p.x2, dy2 = y - p.y2;
        if (Math.sqrt(dx1*dx1 + dy1*dy1) < p.radius + 10 ||
            Math.sqrt(dx2*dx2 + dy2*dy2) < p.radius + 10) {
            editor.portals.splice(i, 1);
            return;
        }
    }
    for (let i = editor.obstacles.length - 1; i >= 0; i--) {
        const o = editor.obstacles[i];
        if (x >= o.x && x <= o.x + o.width && y >= o.y && y <= o.y + o.height) {
            editor.obstacles.splice(i, 1);
            return;
        }
    }
}

function updateObjectList() {
    const list = document.getElementById('objectList');
    list.innerHTML = '';

    editor.obstacles.forEach((o, i) => {
        const div = document.createElement('div');
        div.className = 'object-item';
        div.innerHTML = `<span>Wall ${i+1}: ${Math.round(o.width)}x${Math.round(o.height)}</span>`;
        list.appendChild(div);
    });

    editor.blackHoles.forEach((bh, i) => {
        const div = document.createElement('div');
        div.className = 'object-item';
        div.innerHTML = `<span>Black Hole ${i+1}: str=${bh.strength}</span>`;
        list.appendChild(div);
    });

    editor.portals.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'object-item';
        div.innerHTML = `<span>Portal ${i+1}</span>`;
        list.appendChild(div);
    });

    editor.bumpers.forEach((b, i) => {
        const div = document.createElement('div');
        div.className = 'object-item';
        div.innerHTML = `<span>Bumper ${i+1}</span>`;
        list.appendChild(div);
    });
}

function renderEditor() {
    const ctx = editor.ctx;
    ctx.clearRect(0, 0, editor.canvas.width, editor.canvas.height);

    // Draw goal
    ctx.beginPath();
    ctx.arc(editor.goal.x, editor.goal.y, editor.goal.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw obstacles
    ctx.fillStyle = '#ff4444';
    for (const o of editor.obstacles) {
        ctx.fillRect(o.x, o.y, o.width, o.height);
    }

    // Draw black holes
    for (const bh of editor.blackHoles) {
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw portals
    for (const p of editor.portals) {
        ctx.beginPath();
        ctx.arc(p.x1, p.y1, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x2, p.y2, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Draw portal start
    if (editor.portalStart) {
        ctx.beginPath();
        ctx.arc(editor.portalStart.x, editor.portalStart.y, 25, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw bumpers
    for (const b of editor.bumpers) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00aaff';
        ctx.fill();
        ctx.strokeStyle = '#00ddff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(editor.ball.x, editor.ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Draw launch direction
    const angle = parseInt(document.getElementById('editorLaunchAngle').value) * Math.PI / 180;
    const power = parseInt(document.getElementById('editorLaunchPower').value);
    ctx.beginPath();
    ctx.moveTo(editor.ball.x, editor.ball.y);
    ctx.lineTo(editor.ball.x + Math.cos(angle) * power * 10, editor.ball.y + Math.sin(angle) * power * 10);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
}

function exportLevel() {
    const level = {
        name: "Custom Level",
        ball: { x: Math.round(editor.ball.x), y: Math.round(editor.ball.y) },
        goal: { x: Math.round(editor.goal.x), y: Math.round(editor.goal.y), radius: editor.goal.radius },
        obstacles: editor.obstacles.map(o => ({
            x: Math.round(o.x), y: Math.round(o.y),
            width: Math.round(o.width), height: Math.round(o.height)
        })),
        maxWells: parseInt(document.getElementById('editorMaxWells').value),
        launchAngle: parseInt(document.getElementById('editorLaunchAngle').value),
        launchPower: parseInt(document.getElementById('editorLaunchPower').value)
    };

    if (editor.blackHoles.length > 0) {
        level.blackHoles = editor.blackHoles.map(bh => ({
            x: Math.round(bh.x), y: Math.round(bh.y), radius: bh.radius, strength: bh.strength
        }));
    }

    if (editor.portals.length > 0) {
        level.portals = editor.portals.map(p => ({
            x1: Math.round(p.x1), y1: Math.round(p.y1),
            x2: Math.round(p.x2), y2: Math.round(p.y2), radius: p.radius
        }));
    }

    if (editor.bumpers.length > 0) {
        level.bumpers = editor.bumpers.map(b => ({
            x: Math.round(b.x), y: Math.round(b.y), radius: b.radius
        }));
    }

    document.getElementById('editorOutput').value = JSON.stringify(level, null, 2);
}

function importLevel() {
    try {
        const json = document.getElementById('editorImport').value.trim();
        if (!json) {
            alert('Please paste level JSON first');
            return;
        }

        const level = JSON.parse(json);

        if (!level.ball || !level.goal) {
            alert('Invalid level: missing ball or goal');
            return;
        }

        editor.ball = { x: level.ball.x, y: level.ball.y };
        editor.goal = { x: level.goal.x, y: level.goal.y, radius: level.goal.radius || 30 };
        editor.obstacles = (level.obstacles || []).map(o => ({ ...o }));
        editor.blackHoles = (level.blackHoles || []).map(bh => ({ ...bh }));
        editor.portals = (level.portals || []).map(p => ({ ...p }));
        editor.bumpers = (level.bumpers || []).map(b => ({ ...b }));

        if (level.maxWells) {
            document.getElementById('editorMaxWells').value = level.maxWells;
        }
        if (level.launchAngle !== undefined) {
            document.getElementById('editorLaunchAngle').value = level.launchAngle;
        }
        if (level.launchPower) {
            document.getElementById('editorLaunchPower').value = level.launchPower;
        }

        updateObjectList();
        renderEditor();
        alert('Level imported successfully!');
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

function testEditorLevel() {
    const canvas = document.getElementById('gameCanvas');
    const testLevel = {
        name: "Test Level",
        ball: { x: Math.round(editor.ball.x), y: Math.round(editor.ball.y) },
        goal: { x: Math.round(editor.goal.x), y: Math.round(editor.goal.y), radius: editor.goal.radius },
        obstacles: editor.obstacles.map(o => ({
            x: Math.round(o.x), y: Math.round(o.y),
            width: Math.round(o.width), height: Math.round(o.height)
        })),
        blackHoles: editor.blackHoles.map(bh => ({
            x: Math.round(bh.x), y: Math.round(bh.y), radius: bh.radius, strength: bh.strength
        })),
        portals: editor.portals.map(p => ({
            x1: Math.round(p.x1), y1: Math.round(p.y1),
            x2: Math.round(p.x2), y2: Math.round(p.y2), radius: p.radius
        })),
        bumpers: editor.bumpers.map(b => ({
            x: Math.round(b.x), y: Math.round(b.y), radius: b.radius
        })),
        maxWells: parseInt(document.getElementById('editorMaxWells').value),
        launchAngle: parseInt(document.getElementById('editorLaunchAngle').value),
        launchPower: parseInt(document.getElementById('editorLaunchPower').value)
    };

    canvas.width = editor.canvas.width;
    canvas.height = editor.canvas.height;

    document.getElementById('levelEditor').classList.remove('show');

    state.isTestingLevel = true;
    state.testLevel = testLevel;

    state.ball = new Ball(testLevel.ball.x, testLevel.ball.y);
    state.goal = { ...testLevel.goal };
    state.obstacles = testLevel.obstacles.map(o => ({ ...o }));
    state.movingObstacles = [];
    state.blackHoles = testLevel.blackHoles.map(bh => ({ ...bh }));
    state.portals = testLevel.portals.map(p => ({ ...p }));
    state.bumpers = testLevel.bumpers.map(b => ({ ...b }));
    state.wells = [];
    state.wellHistory = [];
    state.maxWells = testLevel.maxWells;
    state.ballLaunched = false;
    state.gameOver = false;
    state.trail = [];
    state.currentAttempt = 1;

    document.getElementById('currentLevel').textContent = 'TEST';
    document.getElementById('podName').textContent = 'Custom Level';
    updateWellCounter();
    updateAttemptCounter();
}

// Export for use in other modules
window.editor = editor;
window.initEditor = initEditor;
window.renderEditor = renderEditor;
window.exportLevel = exportLevel;
window.importLevel = importLevel;
window.testEditorLevel = testEditorLevel;
