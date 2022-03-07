const WIDTH = 640, HEIGHT = 480;
const CELL_SIZE = 32;

const STEP_TIME = 1 / 60;

const canvas = document.querySelector("#game");
canvas.width  = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const snake = {};

var startTime = 0, accum = 0;

const step = (time)=> {
    requestAnimationFrame(step);

    const diff = time - startTime;
    const dt = diff / 1000;
    accum += dt;
    while (accum >= STEP_TIME) {
        accum -= STEP_TIME;

        // Update
        if((snake.time += Math.max(0.016, 0.016 * snake.score)) > 1) {
            let lastX = snake.body[0].x;
            let lastY = snake.body[0].y;
            snake.body[0].x += snake.dirX;
            snake.body[0].y += snake.dirY;
            for(let i = 1; i < snake.body.length; ++i) {
                let x = snake.body[i].x;
                let y = snake.body[i].y;
                snake.body[i].x = lastX;
                snake.body[i].y = lastY;
                lastX = x;
                lastY = y;
            }
        }

        // Render
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#0F0";
        for(let i = 0; i < snake.body.length; ++i) {
            let part = snake.body[i];
            ctx.fillRect(
                part.x * CELL_SIZE, 
                part.y * CELL_SIZE, 
                CELL_SIZE, 
                CELL_SIZE);
        }

    }

}

const newGame = ()=> {
    snake.score = 0;
    snake.body = [ { x: 0, y: 0 } ];
    snake.dirX = 1; // Right
    snake.dirY = 0;
    snake.time = 0;
}

const init = ()=> {
    newGame();
    step(0);
}

init();