const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

let snake, food, score, dx, dy, gameLoop, speed;

// 🔹 Helper: draw glowing rounded block
function drawRoundedBlock(x, y, size, color, radius = 6) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.lineJoin = "round";
  ctx.lineWidth = radius;
  ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
  ctx.shadowBlur = 0;
}

// 🔁 Reset game state
function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
  dx = box;
  dy = 0;
  score = 0;
  speed = 200;
  document.getElementById('score').innerText = 'Score: 0';
  document.getElementById('gameOverPanel').style.display = 'none';
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, speed);
}

// ⏸ Pause
function pauseGame() {
  clearInterval(gameLoop);
}

// ▶️ Resume
function resumeGame() {
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, speed);
}

// 🎮 Arrow keys (laptop)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -box;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = box;
  } else if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -box; dy = 0;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = box; dy = 0;
  }
});

// 📱 Touch button controls (mobile)
function changeDirection(dir) {
  if (dir === 'up' && dy === 0) {
    dx = 0; dy = -box;
  } else if (dir === 'down' && dy === 0) {
    dx = 0; dy = box;
  } else if (dir === 'left' && dx === 0) {
    dx = -box; dy = 0;
  } else if (dir === 'right' && dx === 0) {
    dx = box; dy = 0;
  }
}

// 🎨 Main game draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🍎 Draw apple (food)
  drawRoundedBlock(food.x, food.y, box, "#ff3333");

  // 🐍 Draw snake segments
  snake.forEach(s => drawRoundedBlock(s.x, s.y, box, "#00cc44"));

  let headX = snake[0].x + dx;
  let headY = snake[0].y + dy;

  // 💥 Collision detection
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(seg => seg.x === headX && seg.y === headY)
  ) {
    gameOverSound.play();
    clearInterval(gameLoop);
    document.getElementById('finalScore').innerText = "Your Score: " + score;
    document.getElementById('gameOverPanel').style.display = 'block';
    return;
  }

  // ➕ Move forward
  snake.unshift({ x: headX, y: headY });

  // 🍽️ Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
    document.getElementById('score').innerText = "Score: " + score;

    if (score % 10 === 0 && speed > 60) {
      speed -= 10;
      clearInterval(gameLoop);
      gameLoop = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }
}

// 🚀 Start on load
window.onload = resetGame;
