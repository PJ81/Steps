

class Menu extends State {
    constructor() {
        super();
        this.steps = 0;
        this.start();
    }

    draw(ctx) {
        ctx.fillStyle = "#888";
		ctx.textAlign = "center";
		ctx.font = "30px Quantico"; 
		ctx.fillText("TAP or", Options.WIDTH >> 1, Options.HEIGHT * .3);
		ctx.fillText("PRESS ANY KEY", Options.WIDTH >> 1, Options.HEIGHT * .36);
        ctx.fillText("TO PLAY", Options.WIDTH >> 1, Options.HEIGHT * .42);
        
		ctx.font = "40px Quantico"; 
        ctx.fillText("Max Steps: " + this.steps, Options.WIDTH >> 1, Options.HEIGHT * .9);
    }

    update(dt) {
        
    }

    start() {
        this.steps = localStorage.getItem('fatfrog_steps') || 0;
    }

    input(i) {
        window.dispatchEvent(new CustomEvent("stateChange", {
            detail: {
                state: Options.GAME
            }
        }));
    }
}