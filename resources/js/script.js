const WIDTH = 640, HEIGHT = 480;
const CELL_SIZE = 32;
const COLS = Math.floor(WIDTH  / CELL_SIZE);
const ROWS = Math.floor(HEIGHT / CELL_SIZE);

const STEP_TIME = 1 / 60;

const canvas = document.querySelector("#game");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const snake = {};
var board = {};

var startTime = 0, accum = 0;

const step = (time) => {
    requestAnimationFrame(step);
    
    let coords = {};
    const diff = time - startTime;
    startTime = time;
    const dt = diff / 1000;
    accum += dt;
    while (accum >= STEP_TIME) {
        accum -= STEP_TIME;

        // Update
        snake.time += 0.03 + 0.001 * snake.score;
        if (snake.time >= 1) {
            snake.time = 0;
            let index;
            if(Math.random() < 0.075) {
                index = Math.floor(Math.random() * COLS * ROWS);
                if(!snake.map[index]) board[index] = 1;
            }
            let lastIndex = snake.body[0];
            toCoords(lastIndex, coords);
            let x = coords.x + (snake.dir > 1 ? 0 : (snake.dir === 1 ? 1 : -1));
            let y = coords.y + (snake.dir < 2 ? 0 : (snake.dir === 2 ? 1 : -1));
            index = toIndex(x, y);
            if (snake.map[index] // body collision
            || x < 0 || y < 0 || x >= COLS || y >= ROWS) { // bounds collision
                // game over
                init();
                // alert(`Game Over (Score: ${snake.score})`);
                return;
            }
            if(board[index]) {
                snake.score += board[index];
                snake.body.push(0);
                board[index] = 2;
            }
            delete board[snake.body[snake.body.length - 1]];
            snake.body[0] = index;
            snake.map = {};
            for (let i = 1; i < snake.body.length; ++i) {
                index = snake.body[i];
                snake.body[i] = lastIndex;
                snake.map[lastIndex] = true;
                lastIndex = index;
            }
 
        }

    }

    // Render
    ctx.fillStyle = "#a5ce08";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
    for (let i = 0; i < snake.body.length; ++i) {
        toCoords(snake.body[i], coords);
        ctx.fillStyle = i % 2 === 0 ? "#0F0" : "#9F9";
        ctx.beginPath();
        if(board[snake.body[i]] !== 2) {
            ctx.fillRect(
                coords.x * CELL_SIZE,
                coords.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        } else {
            let hs = CELL_SIZE * 0.5;
            ctx.arc(coords.x * CELL_SIZE + hs,
                    coords.y * CELL_SIZE + hs,
                    hs * 1.35, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    Object.keys(board).map((cell)=> {
        toCoords(cell, coords);
        ctx.beginPath();
        if(board[cell] === 1) {
            ctx.fillStyle = "#00F";
            ctx.fillRect(
                coords.x * CELL_SIZE,
                coords.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
            ctx.stroke();
        }
    });
    ctx.strokeStyle = "#87a81d";
    ctx.beginPath();
    for(let i = 1; i < COLS; ++i) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CELL_SIZE * ROWS);
       
    }
    ctx.stroke();
    ctx.beginPath();
    for(let i = 1; i < ROWS; ++i) {
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CELL_SIZE * COLS, i * CELL_SIZE);
    }
    ctx.stroke();
}

const toIndex = (x, y) => {
    return y * COLS + x;
}

const toCoords = (index, result) => {
    if (!result) result = {};
    result.x = index % COLS;
    result.y = (index / COLS) >> 0;
    return result;
}

const newGame = () => {
    snake.score = 0;
    let index = toIndex(COLS >> 1, ROWS >> 1);
    snake.body = [];
    for(let i = 0; i < 4; ++i) snake.body[i] = index;
    snake.dir = 1; // Right
    snake.time = 0;
    snake.map = {};

    board = {};
}

const init = () => {

    document.addEventListener("keydown", (e) => {
        const lastDir = snake.dir;
        switch (e.code) {
            case "ArrowLeft":
                if(snake.dir !== 1) {
                    snake.dir = 0;
                }
                break;
            case "ArrowRight":
                if(snake.dir !== 0) {
                  snake.dir = 1;
                }
                break;
            case "ArrowDown":
                if(snake.dir !== 3) {
                  snake.dir = 2;
                }
                break;
            case "ArrowUp":
                if(snake.dir !== 2) {
                  snake.dir = 3;
                }
                break;
        }
        if(lastDir !== snake.dir) snake.time = 1;
    });

    newGame();
    step(0);
}

init();