let runCanvas, runCtx;
let runIsRunning = false;
let runIsGameOver = false;
let runAnimationId = null;
let runTimerInterval = null;

let runTime = 0;
let runScore = 0;

let playerLane = 1; // 0: left, 1: center, 2: right
let runSpeed = 1;
let runItems = [];
let runFrameCount = 0;

const LANES = [66.6, 200, 333.3];
const PLAYER_Y = 400;
const ITEM_RADIUS = 20;

function openRunGameModal() {
    document.getElementById("runGameModal").style.display = "flex";
    if (!runCanvas) {
        runCanvas = document.getElementById("runGameCanvas");
        runCtx = runCanvas.getContext("2d");
        
        // Controls
        window.addEventListener("keydown", (e) => {
            if (!runIsRunning || runIsGameOver) return;
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                if (playerLane > 0) playerLane--;
            } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                if (playerLane < 2) playerLane++;
            }
        });

        runCanvas.addEventListener("touchstart", (e) => {
            if (!runIsRunning || runIsGameOver) return;
            const rect = runCanvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            if (touchX < runCanvas.width / 2) {
                if (playerLane > 0) playerLane--;
            } else {
                if (playerLane < 2) playerLane++;
            }
        });

        runCanvas.addEventListener("mousedown", (e) => {
            if (!runIsRunning || runIsGameOver) return;
            const rect = runCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < runCanvas.width / 2) {
                if (playerLane > 0) playerLane--;
            } else {
                if (playerLane < 2) playerLane++;
            }
        });
        
        drawRunGame(); // Initial empty state draw
    }
}

function moveRunPlayerLeft() {
    if (!runIsRunning || runIsGameOver) return;
    if (playerLane > 0) playerLane--;
}

function moveRunPlayerRight() {
    if (!runIsRunning || runIsGameOver) return;
    if (playerLane < 2) playerLane++;
}

function closeRunGameModal() {
    document.getElementById("runGameModal").style.display = "none";
    if (runIsRunning) resetRunGame(false);
}

function startRunGame() {
    if (runIsRunning) return;
    document.getElementById("startRunGameBtn").disabled = true;
    
    runIsRunning = true;
    runIsGameOver = false;
    runTime = 0;
    runScore = 0;
    playerLane = 1;
    runSpeed = 1; // 初始速度慢80%
    runItems = [];
    runFrameCount = 0;
    
    document.getElementById("runGameScoreView").innerText = runScore;
    document.getElementById("runGameTimerView").innerText = runTime;

    runTimerInterval = setInterval(() => {
        runTime++;
        document.getElementById("runGameTimerView").innerText = runTime;
        // 随时间流逝逐渐不断加速
        runSpeed += 0.15; 
    }, 1000);

    runGameLoop();
}

function resetRunGame(restart = true) {
    runIsRunning = false;
    runIsGameOver = false;
    if (runTimerInterval) clearInterval(runTimerInterval);
    if (runAnimationId) cancelAnimationFrame(runAnimationId);
    
    runTime = 0;
    runScore = 0;
    document.getElementById("runGameScoreView").innerText = "0";
    document.getElementById("runGameTimerView").innerText = "0";
    document.getElementById("startRunGameBtn").disabled = false;
    runItems = [];
    
    if (runCtx) {
        drawRunGame();
    }
    
    if (restart) {
        startRunGame();
    }
}

function runGameLoop() {
    if (!runIsRunning) return;
    
    updateRunGame();
    drawRunGame();
    
    if (!runIsGameOver) {
        runAnimationId = requestAnimationFrame(runGameLoop);
    }
}

function updateRunGame() {
    runFrameCount++;
    
    // 生成物品的间隔随速度动态调整，保证有固定的躲避间距
    const spawnInterval = Math.max(20, Math.floor(120 / runSpeed));
    if (runFrameCount % spawnInterval === 0) {
        spawnItem();
    }
    
    // Move items and check collisions
    const playerX = LANES[playerLane];
    
    for (let i = runItems.length - 1; i >= 0; i--) {
        let item = runItems[i];
        item.y += runSpeed;
        
        // Check collision bounding box simple
        if (Math.abs(item.y - PLAYER_Y) < 30 && item.lane === playerLane) {
            if (item.type === 'coin') {
                runScore++;
                document.getElementById("runGameScoreView").innerText = runScore;
                runItems.splice(i, 1);
                continue;
            } else if (item.type === 'obstacle') {
                triggerRunGameOver();
                return;
            }
        }
        
        // Remove off-screen items
        if (item.y > runCanvas.height + 50) {
            runItems.splice(i, 1);
        }
    }
}

function spawnItem() {
    const lane = Math.floor(Math.random() * 3);
    const isCoin = Math.random() > 0.6; // 40% chance for coin, 60% for obstacle
    runItems.push({
        lane: lane,
        x: LANES[lane],
        y: -40,
        type: isCoin ? 'coin' : 'obstacle'
    });
}

function drawRunGame() {
    if (!runCtx) return;
    
    // Clear background
    runCtx.fillStyle = '#87CEEB'; // Sky blue
    runCtx.fillRect(0, 0, runCanvas.width, runCanvas.height);
    
    // Draw Lanes
    runCtx.fillStyle = '#A0522D'; // Dirt road
    runCtx.fillRect(0, 0, runCanvas.width, runCanvas.height);
    
    // Lane dividers
    runCtx.strokeStyle = '#DEB887';
    runCtx.lineWidth = 5;
    runCtx.setLineDash([20, 20]);
    runCtx.beginPath();
    runCtx.moveTo(runCanvas.width / 3, 0);
    runCtx.lineTo(runCanvas.width / 3, runCanvas.height);
    runCtx.stroke();
    
    runCtx.beginPath();
    runCtx.moveTo((runCanvas.width / 3) * 2, 0);
    runCtx.lineTo((runCanvas.width / 3) * 2, runCanvas.height);
    runCtx.stroke();
    runCtx.setLineDash([]);
    
    // Draw Items
    runCtx.font = "30px Arial";
    runCtx.textAlign = "center";
    runCtx.textBaseline = "middle";
    for (let item of runItems) {
        if (item.type === 'coin') {
            runCtx.fillText("🪙", item.x, item.y);
        } else {
            runCtx.fillText("🪵", item.x, item.y);
        }
    }
    
    // Draw Player (Xiong Da)
    runCtx.font = "40px Arial";
    runCtx.fillText("🐻", LANES[playerLane], PLAYER_Y);
}

function triggerRunGameOver() {
    runIsGameOver = true;
    runIsRunning = false;
    clearInterval(runTimerInterval);
    cancelAnimationFrame(runAnimationId);
    
    document.getElementById("startRunGameBtn").disabled = false;
    
    // Slight delay for alert to render frame first
    setTimeout(() => {
        alert(`【游戏结束】\n熊大被绊倒了！\n生存时间: ${runTime}秒\n收集金币: ${runScore} 分`);
    }, 50);
}
