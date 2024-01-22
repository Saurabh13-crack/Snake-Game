const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 20;
const gridSize = canvas.width / boxSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = 'right';

function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawWalls();
    
        snake.forEach((segment, index) => {
            if (index === 0) {
                drawSnakeHead(segment.x, segment.y);
            } else {
                ctx.fillStyle = '#2ecc71';
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 2;
    
                ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
                ctx.strokeRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
            }
        });
    
        ctx.fillStyle = '#e74c3c'; 
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        const appleSize = boxSize * 0.8;
        ctx.beginPath();
        ctx.arc(food.x * boxSize + boxSize / 2, food.y * boxSize + boxSize / 2, appleSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        resetGame();
        return;
    }

    if (isCollision(head, snake.slice(1))) {
        resetGame();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift({ x: food.x, y: food.y });
        generateFood();
    } else {
        snake.unshift(head);
        snake.pop();
    }
}

function isCollision(point, array) {
    return array.some(segment => segment.x === point.x && segment.y === point.y);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };

    while (isCollision(food, snake)) {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    }
}

function drawWalls() {
    ctx.fillStyle = '#3498db'; 
    ctx.fillRect(0, 0, canvas.width, boxSize); 
    ctx.fillRect(0, 0, boxSize, canvas.height); 
    ctx.fillRect(canvas.width - boxSize, 0, boxSize, canvas.height); 
    ctx.fillRect(0, canvas.height - boxSize, canvas.width, boxSize); 
}

function drawSnakeHead(x, y) {
    const headSize = boxSize;
    const eyeSize = headSize / 6;

    ctx.fillStyle = '#27ae60';
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;

    ctx.fillRect(x * boxSize, y * boxSize, headSize, headSize);
    ctx.strokeRect(x * boxSize, y * boxSize, headSize, headSize);

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc((x + 0.3) * boxSize, (y + 0.3) * boxSize, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((x + 0.7) * boxSize, (y + 0.3) * boxSize, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((x + 0.7) * boxSize, (y + 0.9) * boxSize, eyeSize, 0, Math.PI);
    ctx.stroke();

    ctx.fillStyle = 'black'; 
    drawHorn(x + 0.2, y - 0.1, eyeSize * 2, true);
    drawHorn(x + 0.8, y - 0.1, eyeSize * 2, true);
}

function drawHorn(x, y, size, flip = false) {
    ctx.beginPath();
    const startY = y * boxSize;
    const endY = (y - 0.3) * boxSize * (flip ? 1 : -1);
    ctx.moveTo(x * boxSize, startY);
    ctx.lineTo(x * boxSize, endY);
    ctx.stroke();
}
function drawStars(x, y) {
    const starSize = boxSize / 2;
    ctx.fillStyle = 'yellow'; 
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * (2 * Math.PI);
        const starX = x * boxSize + boxSize / 2 + Math.cos(angle) * starSize * 2;
        const starY = y * boxSize + boxSize / 2 + Math.sin(angle) * starSize * 2;

        ctx.beginPath();
        ctx.moveTo(starX, starY - starSize);
        for (let j = 0; j < 5; j++) {
            const innerRadius = j % 2 === 0 ? starSize / 2 : starSize;
            const innerAngle = (j / 5) * (2 * Math.PI);
            const innerX = starX + Math.cos(innerAngle) * innerRadius;
            const innerY = starY + Math.sin(innerAngle) * innerRadius;
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
function resetGame() {
    drawStars(snake[0].x, snake[0].y);
    alert('Game Over! Your score: ' + (snake.length - 1));
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
}
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });
    generateFood();
    setInterval(draw, 100);