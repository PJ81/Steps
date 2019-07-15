
class Game {
	constructor() {
		const canvas = document.createElement('canvas');
		canvas.width = Options.WIDTH * Options.SCALE;
		canvas.height = Options.HEIGHT * Options.SCALE;
        document.body.appendChild(canvas);
        
        this.ctx = canvas.getContext('2d');

        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1 / 60;

		this.loop = (time) => {
			this.accumulator += (time - this.lastTime) / 1000;
			while(this.accumulator > this.deltaTime) {
				this.accumulator -= this.deltaTime;
				this.state.update(this.deltaTime);
			}

            this.ctx.clearRect(0, 0, Options.WIDTH, Options.HEIGHT);
            this.state.draw(this.ctx);

			this.lastTime = time;
			requestAnimationFrame(this.loop);
        }

        window.addEventListener("keydown", (e) => {
            this.state.input(e);
        });
        canvas.addEventListener("touchstart", (e) => {
            this.state.input(e);
        });
        
        this.ctx.scale(Options.SCALE, Options.SCALE);

        this.menu = new Menu();
        this.steps = new Steps();
        this.go = new GameOver();
        
        window.addEventListener("stateChange", (e) => {
            switch(e.detail.state) {
                case Options.GAME:
                    this.state = this.steps;
                break;
                case Options.MENU:
                    this.state = this.menu;
                break;
                case Options.GAMEOVER:
                    this.state = this.go;
                    this.go.set(e.detail.msg1, e.detail.msg2);
                break;
            }
            this.state.start();
        });
        
        this.state = this.menu;
        this.loop(0);
    }
}

const R = new Resources(() => new Game());