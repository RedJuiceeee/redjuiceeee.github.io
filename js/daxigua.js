const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events;

let engine, render, runner;
let isGameRunning = false;
let score = 0;
let time = 0;
let timerInterval = null;
let gameLoopInterval = null;
let isGameOver = false;
let cutoffTime = 0;
let currentFruitPath = null;
let nextFruits = [];
let maxLevels = 11;
let canDrop = true;

const FRUIT_RADII = [16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112];
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

document.addEventListener("DOMContentLoaded", () => {
    // Generate initial next fruits
    generateNextFruits();
});

function openGameModal() {
    document.getElementById("gameModal").style.display = "flex";
}

function closeGameModal() {
    document.getElementById("gameModal").style.display = "none";
    if (isGameRunning) resetGame(false);
}

function generateNextFruits() {
    while (nextFruits.length < 3) {
        nextFruits.push(Math.floor(Math.random() * 5)); // First 5 levels
    }
    updateNextFruitsUI();
}

function updateNextFruitsUI() {
    const container = document.getElementById("nextFruitsContainer");
    container.innerHTML = "";
    nextFruits.forEach(lvl => {
        const img = document.createElement("img");
        img.src = `images/fruits/${lvl}.png`;
        container.appendChild(img);
    });
}

function startGame() {
    if (isGameRunning) return;
    document.getElementById("startGameBtn").disabled = true;
    
    // Clear canvas if exists
    const gameBody = document.getElementById("gameBody");
    gameBody.innerHTML = "";

    engine = Engine.create();
    render = Render.create({
        element: gameBody,
        engine: engine,
        options: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            wireframes: false,
            background: "#ffeec8"
        }
    });

    const wallOptions = { 
        isStatic: true, 
        render: { fillStyle: "#673ab7" } 
    };
    
    const ground = Bodies.rectangle(CANVAS_WIDTH/2, CANVAS_HEIGHT + 25, CANVAS_WIDTH, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, CANVAS_HEIGHT/2, 50, CANVAS_HEIGHT, wallOptions);
    const rightWall = Bodies.rectangle(CANVAS_WIDTH+25, CANVAS_HEIGHT/2, 50, CANVAS_HEIGHT, wallOptions);
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Collision Logic
    Events.on(engine, 'collisionStart', function(event) {
        const pairs = event.pairs;
        
        for (let i = 0; i < pairs.length; i++) {
            const bodyA = pairs[i].bodyA;
            const bodyB = pairs[i].bodyB;

            if (bodyA.fruitLevel !== undefined && bodyB.fruitLevel !== undefined) {
                if (bodyA.fruitLevel === bodyB.fruitLevel && !bodyA.isMerging && !bodyB.isMerging) {
                    if (bodyA.fruitLevel < maxLevels - 1) {
                        bodyA.isMerging = true;
                        bodyB.isMerging = true;

                        const newLevel = bodyA.fruitLevel + 1;
                        score += newLevel * 2;
                        document.getElementById("gameScoreView").innerText = score;

                        const posX = (bodyA.position.x + bodyB.position.x) / 2;
                        const posY = (bodyA.position.y + bodyB.position.y) / 2;

                        Composite.remove(engine.world, [bodyA, bodyB]);
                        createNewFruit(posX, Math.max(posY, FRUIT_RADII[newLevel]), newLevel);
                    }
                }
            }
        }
    });

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);

    // Append cutoff line dynamically
    const line = document.createElement("div");
    line.id = "cutoffLine";
    line.style.cssText = "position: absolute; top: 120px; left: 0; width: 100%; height: 2px; border-top: 2px dashed #ff4c4c; z-index: 10; pointer-events: none;";
    gameBody.appendChild(line);

    // Mouse drop logic
    gameBody.addEventListener("click", handleDrop);

    isGameRunning = true;
    isGameOver = false;
    cutoffTime = 0;
    score = 0;
    time = 0;
    
    document.getElementById("gameScoreView").innerText = score;
    document.getElementById("gameTimerView").innerText = time;

    timerInterval = setInterval(() => {
        time++;
        document.getElementById("gameTimerView").innerText = time;
    }, 1000);

    gameLoopInterval = setInterval(() => {
        if (!isGameRunning || isGameOver) return;
        
        let anyFruitAbove = false;
        const bodies = Composite.allBodies(engine.world);
        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            if (body.fruitLevel !== undefined) {
                let r = FRUIT_RADII[body.fruitLevel];
                let topY = body.position.y - r;
                // Check if top edge is above the cutoff line (120) and fruit is resting (speed < 1.5)
                // Exclude the actively dropping fruit (y > 60 since spawn height is 50)
                if (topY < 120 && body.speed < 1.5 && body.position.y > 60) {
                    anyFruitAbove = true;
                    break;
                }
            }
        }

        if (anyFruitAbove) {
            cutoffTime += 100;
            if (cutoffTime >= 1000) {
                triggerGameOver();
            }
        } else {
            cutoffTime = 0;
        }
    }, 100);
}

function triggerGameOver() {
    isGameOver = true;
    isGameRunning = false;
    clearInterval(timerInterval);
    clearInterval(gameLoopInterval);
    if (runner) Runner.stop(runner);
    alert(`【游戏结束】\n您的最终得分是: ${score}\n存活时间: ${time}秒`);
    document.getElementById("startGameBtn").disabled = false;
    canDrop = true;
}

function handleDrop(e) {
    if (!isGameRunning || !canDrop || isGameOver) return;
    canDrop = false;

    const gameBody = document.getElementById("gameBody");
    const rect = gameBody.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 50), CANVAS_WIDTH - 50);

    const level = nextFruits.shift();
    generateNextFruits();

    const dX = x;
    const dY = 50;

    createNewFruit(dX, dY, level);
    
    setTimeout(() => {
        canDrop = true;
    }, 600);
}

function createNewFruit(x, y, level) {
    const r = FRUIT_RADII[level];
    const fruit = Bodies.circle(x, y, r, {
        restitution: 0.3,
        friction: 0.1,
        render: {
            sprite: {
                texture: `images/fruits/${level}.png`,
                xScale: (r * 2) / 72,
                yScale: (r * 2) / 72
            }
        }
    });
    fruit.fruitLevel = level;
    Composite.add(engine.world, fruit);
}

function resetGame(restart = true) {
    if (timerInterval) clearInterval(timerInterval);
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (render) {
        Render.stop(render);
        render.canvas.remove();
    }
    if (runner) {
        Runner.stop(runner);
    }
    if (engine) {
        Engine.clear(engine);
    }
    isGameRunning = false;
    document.getElementById("startGameBtn").disabled = false;
    document.getElementById("gameScoreView").innerText = "0";
    document.getElementById("gameTimerView").innerText = "0";
    
    // Clear next fruits to start fresh
    nextFruits = [];
    generateNextFruits();

    if (restart) {
        startGame();
    }
}
