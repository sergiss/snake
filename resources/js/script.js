const WIDTH = 640, HEIGHT = 480;
const CELL_SIZE = 16;

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

    const diff = time - startTime;
    startTime = time;
    const dt = diff / 1000;
    accum += dt;
    while (accum >= STEP_TIME) {
        accum -= STEP_TIME;

        // Update
        let coords = {};
        snake.time += 0.016 + 0.001 * snake.score;
        if (snake.time > 1) {
            snake.time = 0;
            let lastIndex = snake.body[0];
            toCoords(lastIndex, coords);
            let x = coords.x + (snake.dir > 1 ? 0 : (snake.dir === 1 ? 1 : -1));
            let y = coords.y + (snake.dir < 2 ? 0 : (snake.dir === 2 ? 1 : -1));
            let index = toIndex(x, y);
            if (snake.map[index] // body collision
                || x < 0 || y < 0 || x >= WIDTH / CELL_SIZE || y >= HEIGHT / CELL_SIZE) { // bounds collision
                // game over
                init();
                return;
            }
            snake.body[0] = index;
            snake.map = {};
            for (let i = 1; i < snake.body.length; ++i) {
                index = snake.body[i];
                snake.body[i] = lastIndex;
                map[lastIndex] = true;
                lastIndex = index;
            }
        }

        // Render
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#0F0";
        for (let i = 0; i < snake.body.length; ++i) {
            toCoords(snake.body[i], coords);
            ctx.fillRect(
                coords.x * CELL_SIZE,
                coords.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }

    }

}

const toIndex = (x, y) => {
    return y * WIDTH + x;
}

const toCoords = (index, result) => {
    if (!result) result = {};
    result.x = index % WIDTH;
    result.y = (index / WIDTH) >> 0;
    return result;
}

const newGame = () => {
    snake.score = 0;
    snake.body = [toIndex(Math.floor(WIDTH / CELL_SIZE) >> 1, Math.floor(HEIGHT / CELL_SIZE) >> 1)]
    snake.dir = 1; // Right
    snake.time = 0;
    snake.map = {};

    board = {};
}

const init = () => {

    document.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "ArrowLeft":
                snake.dir = 0; snake.time = 2;
                break;
            case "ArrowRight":
                snake.dir = 1; snake.time = 2;
                break;
            case "ArrowDown":
                snake.dir = 2; snake.time = 2;
                break;
            case "ArrowUp":
                snake.dir = 3; snake.time = 2;
                break;

        }
    });

    newGame();
    step(0);
}

init();