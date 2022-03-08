/*
 * Copyright (c) 2022, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 */

const WIDTH = 660, HEIGHT = 495;
const CELL_SIZE = 32;
const COLS = Math.floor(WIDTH  / CELL_SIZE);
const ROWS = Math.floor(HEIGHT / CELL_SIZE);

const STEP_TIME = 1 / 60;

const canvas = document.querySelector("#game");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const snake = {time:0};
var board = {};

var startTime = 0, accum = 0;

const step = (time) => {

    requestAnimationFrame(step);
    
    let index, coords = {};
    const diff = time - startTime;
    startTime = time;
    accum += diff / 1000;
    while (accum >= STEP_TIME) { // fixed fps
        accum -= STEP_TIME;
        // Update
        snake.time += 0.03 + 0.001 * snake.score; // dynamic difficulty
        if (snake.time >= 1) { // update time
            snake.time = 0;
            if(Math.random() < 0.075) { // generate food
                index = Math.floor(Math.random() * COLS * ROWS);
                if(!board[index]) board[index] = 1;
            }
            // Move head
            let lastIndex = snake.body[0];
            toCoords(lastIndex, coords);
            let x = coords.x + (snake.dir & 0x3) - 1;
            let y = coords.y + ((snake.dir >> 2) & 0x3) - 1;
            index = toIndex(x, y);
            // Check collisions
            if (board[index] === 2 // body
            || x < 0 || y < 0 || x >= COLS || y >= ROWS) { // bounds
                init();
                return;
            } else if(board[index]) { // food
                snake.score += board[index];
                snake.body.push(0);
            }
            // Move body
            delete board[snake.body[snake.body.length - 1]];
            board[index] = 2;
            snake.body[0] = index;
            for (let i = 1; i < snake.body.length; ++i) {
                index = snake.body[i];
                snake.body[i] = lastIndex;
                lastIndex = index;
            }
        } // update time

    } // while

    // Render
    ctx.fillStyle = "#a5ce08"; // backgroun color
    ctx.fillRect(0, 0, WIDTH, HEIGHT); // clear screen
    // Draw body
    for (let i = 0; i < snake.body.length; ++i) {
        toCoords(snake.body[i], coords);
        ctx.fillStyle = i % 2 === 0 ? "#0F0" : "#9F9";
        ctx.fillRect(
            coords.x + coords.x * CELL_SIZE,
            coords.y + coords.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
    // Draw food
    Object.keys(board).map((cell)=> {
        if(board[cell] === 1) { // only food
            toCoords(cell, coords);
            ctx.fillStyle = "#00F";
            ctx.fillRect(
                coords.x + coords.x * CELL_SIZE,
                coords.y + coords.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    });
    // Score
    ctx.font = "16px monospace"
    ctx.fillStyle = "gray";
    ctx.fillText(`Score: ${snake.score}`, 15, HEIGHT - 10);
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
    board = {}; // clear board
    board[Math.floor(Math.random() * COLS * ROWS)] = 1;
    snake.score = 0;
    snake.body = []; // clear body
    let index = toIndex(COLS >> 1, ROWS >> 1); // start position
    for(let i = 0; i < 4; ++i) snake.body[i] = index; // body
    snake.dir = 6; // Right
}

const init = () => {
    document.addEventListener("keydown", (e) => {
        let dir = snake.dir;
        switch (e.code) {
            case "ArrowRight":
                  dir = 6;
                break;
            case "ArrowLeft":
                  dir = 4;
                break;
            case "ArrowDown":
                  dir = 9;
                break;
            case "ArrowUp":
                  dir = 1;
                break;
        }
        if(dir !== snake.dir) {
            snake.dir = dir;
            snake.time = 1;
        }
    });
    newGame();
    step(0); // start game loop
}

init();