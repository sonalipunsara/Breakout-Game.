  
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var level = 1;
var maxLevel = 3;
var lives = 3;

 
function createBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

 
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var brick = bricks[c][r];
      if (brick.status == 1) {
        if (
          x > brick.x &&
          x < brick.x + brickWidth &&
          y > brick.y &&
          y < brick.y + brickHeight
        ) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            if (level == maxLevel) {
              
              alert("Congratulations! You have completed all levels.");
              saveScore();
              document.location.reload();
            } else {
              
              level++;
              score = 0;
              lives = 3;
              createBricks();
              resetBallAndPaddle();
            }
          }
        }
      }
    }
  }
}

 
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLevel() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Level: " + level, canvas.width - 80, 20);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Lives: " + lives, canvas.width / 2 - 40, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLevel();
  drawLives();
  collisionDetection();

  
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        
        alert("Game Over");
        saveScore();
        document.location.reload();
        const highScore = localStorage.getItem('score') || 0;

        const content = `score: ${score}`;

         
        const blob = new Blob([content], { type: 'text/plain' });

        
        const url = URL.createObjectURL(blob);

         
        const link = document.createElement('a');
        link.href = url;
        link.download = 'score.txt';

         
        document.body.appendChild(link);
 
        link.click();

         
        document.body.removeChild(link);

      
        URL.revokeObjectURL(url);
      } else {
        resetBallAndPaddle();
      }
    }
  }

  
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

function resetBallAndPaddle() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
}

function saveScore() {
  var highestScore = localStorage.getItem("highestScore");
  if (highestScore === null || score > highestScore) {
    localStorage.setItem("highestScore", score);
  }
}

 
createBricks();
draw();
 
var highestScore = localStorage.getItem("highestScore");
var scoreDisplay = document.getElementById("scoreDisplay");
if (highestScore) {
  scoreDisplay.textContent = "Highest Score: " + highestScore;
}
