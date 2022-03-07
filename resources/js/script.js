const STEP_TIME = 1 / 60;
var startTime = 0, accum = 0;

const step = (time)=> {
    requestAnimationFrame(step);

    const diff = time - startTime;
    const dt = diff / 1000;
    accum += dt;
    while (accum >= STEP_TIME) {
        accum -= STEP_TIME;

        // UPDATE

    }
}

const init = ()=> {

}
init();