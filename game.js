// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Snake and food
let snake;
let food;

window.onload = function() {
    canvas.width = 400; // Set the canvas width
    canvas.height = 400; // Set the canvas height
    snake = new Snake();
    food = new Food();
    window.setInterval(gameLoop, 1000 / 15); // Call the gameLoop function 15 times per second
};

// Snake constructor
function Snake() {
    this.snakeArray = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    this.direction = "RIGHT";
    this.changeDirection = function(event) {
        if (event.keyCode == 37 && this.direction != "RIGHT") {
            this.direction = "LEFT";
        } else if (event.keyCode == 38 && this.direction != "DOWN") {
            this.direction = "UP";
        } else if (event.keyCode == 39 && this.direction != "LEFT") {
            this.direction = "RIGHT";
        } else if (event.keyCode == 40 && this.direction != "UP") {
            this.direction = "DOWN";
        }
    };
    this.move = function() {
        const head = { ...this.snakeArray[0] };

        if (this.direction == "LEFT") head.x -= 1;
        if (this.direction == "UP") head.y -= 1;
        if (this.direction == "RIGHT") head.x += 1;
        if (this.direction == "DOWN") head.y += 1;

        this.snakeArray.unshift(head);
        this.snakeArray.pop();
    };

    this.grow = function() {
        const head = { ...this.snakeArray[0] };
        this.snakeArray.unshift(head);
    };

    this.collision = function() {
        const head = this.snakeArray[0];
        if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows) {
            return true; // Collision with wall
        }

        for (let i = 1; i < this.snakeArray.length; i++) {
            if (head.x === this.snakeArray[i].x && head.y === this.snakeArray[i].y) {
                return true; // Collision with body
            }
        }
        return false;
    };

    this.draw = function() {
        ctx.fillStyle = "green";
        for (let i = 0; i < this.snakeArray.length; i++) {
            ctx.fillRect(this.snakeArray[i].x * scale, this.snakeArray[i].y * scale, scale, scale);
        }
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.randomize = function() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    };

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    snake.move();
    if (snake.collision()) {
        alert("Game Over!");
        snake = new Snake(); // Reset snake
        food.randomize(); // Randomize food position
    }
    if (snake.snakeArray[0].x === food.x && snake.snakeArray[0].y === food.y) {
        snake.grow();
        food.randomize();
    }
    snake.draw();
    food.draw();
}

// Add event listener for keypress to control the snake direction
window.addEventListener("keydown", function(event) {
    snake.changeDirection(event);
});
