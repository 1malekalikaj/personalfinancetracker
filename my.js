// Get the canvas element and its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverBox = document.getElementById('gameOverBox');
const scoreMessage = document.getElementById('scoreMessage');

// Game variables
const box = 20; // Size of each square (snake segment and food)
let snake = [{ x: 9 * box, y: 10 * box }]; // Initial snake position
let direction = 'RIGHT'; // Initial direction
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let score = 0;
let game;

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFD700' : '#FFFF00'; // Gold for the head, Yellow for the body
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.lineWidth = 1; // Set border width to 1 pixel
        ctx.strokeStyle = '#FFFFFF'; // White border for contrast
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = '#FF0000'; // Red color for the apple
    ctx.fillRect(food.x, food.y, box, box);
}

// Update the game state
function update() {
    // Move the snake
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    // Add new head to the snake
    snake.unshift(head);

    // Check for collisions
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
    }
}

// Listen for key presses
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    update();
}

// Start the game
function startGame() {
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    gameOverBox.style.display = 'none';
    game = setInterval(gameLoop, 100);
}

// Game over function
function gameOver() {
    clearInterval(game);
    scoreMessage.textContent = 'Your Score: ' + score;
    gameOverBox.style.display = 'block';
}

// Restart the game
function restartGame() {
    startGame();
}

// Exit the game (close the window)
function exitGame() {
    window.close();
}

// Start the game for the first time
startGame();