
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

let snake, food, score, dx, dy, gameLoop, speed;

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

function pauseGame() {
  clearInterval(gameLoop);
}

function resumeGame() {
  clearInterval(gameLoop);
  gameLoop = setInterval(draw, speed);
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.fillStyle = "#00ffcc";
  snake.forEach(s => ctx.fillRect(s.x, s.y, box, box));

  let headX = snake[0].x + dx;
  let headY = snake[0].y + dy;

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

  snake.unshift({ x: headX, y: headY });

  if (headX === food.x && headY === food.y) {
    score++;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
    document.getElementById('score').innerText = "Score: " + score;

    // 🧠 Increase speed every 10 score
    if (score % 10 === 0 && speed > 60) {
      speed -= 10;
      clearInterval(gameLoop);
      gameLoop = setInterval(draw, speed);
    }

  } else {
    snake.pop();
  }
}

// ✅ Auto-start game when page loads
window.onload = resetGame;
