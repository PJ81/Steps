

class Steps extends State {
    constructor() {
        super();
        this.steps = [];

        this.timer = 0;
        this.started = false;
        this.countSteps = 0;

        this.particles = new Particles();

        this.shadow = R.image(Options.SHADOW);
        this.block = R.image(Options.BLOCK);

        this.x = (Options.WIDTH >> 1) - (this.block.width >> 1);
        this.y = (Options.HEIGHT >> 1) - (this.block.height >> 1);
        this.px = Options.WIDTH >> 1;
        this.py = 10 + (Options.HEIGHT >> 1);
        
        this.base = this.y;
        this.vy = 0;

        this.jumping = Options.NONE;
        this.jumpPower = -200;
        this.index = 0;

        this.fallSpeed = rand(600, 800);

        this.state = Options.GAME;
    }

    draw(ctx) {
        for(let b = 0, l = this.steps.length; b < l; b++) {
            const o = this.steps[b];
            if(o.x < -30 || o.x > Options.WIDTH || o.y < -30 || o.y > Options.HEIGHT) continue;
            o.draw(ctx);
        }

        !this.jumping && ctx.drawImage(this.shadow, this.x - 1, this.y + this.block.height -7);
        ctx.drawImage(this.block, this.x, this.y);
        this.particles.draw(ctx);

        ctx.fillStyle = "#ddd";
        ctx.font = "60px Quantico";
        ctx.fillText("" + this.countSteps, Options.WIDTH >> 1, Options.HEIGHT * .85);
        const s = ~~(this.timer / 60),
              m = (this.timer / 60 - s).toString(10).substr(1, 5);
        ctx.font = "30px Quantico";
        ctx.fillText(s + m, Options.WIDTH >> 1, Options.HEIGHT * .95);
    }

    update(dt) {
        this.particles.update(dt);

        let a = false;
        for(let f = 0, l = this.steps.length; f < l; f++) {
            const o = this.steps[f];
            if(!o.alive) continue;
            a = true;
            o.update(dt);
        }

        switch(this.state) {
            case Options.DIE:
                if(!a) {
                    (parseInt(localStorage.getItem('fatfrog_steps')) || 0) < this.countSteps && localStorage.setItem('fatfrog_steps', "" + this.countSteps);

                    let s1 = "GAME", s2 = "OVER!"; 
                    if(this.timer === 0) {
                        s1 = "TIME"; s2 = "UP!";
                    }
                    window.dispatchEvent(new CustomEvent("stateChange", {
                        detail: {
                            state: Options.GAMEOVER,
                            msg1: s1,
                            msg2: s2
                        }
                    }));
                    return;
                }
            break;
            case Options.FALL:
                this.y += this.fallSpeed * dt;
                if(this.y > Options.HEIGHT) {
                    this.gameOver();
                }
            break;
            case Options.TIME_UP:
            case Options.PRICK:
                dt *= 4;
                this.y += this.vy * dt;
                this.vy += Options.GRAVITY * dt;
                if(this.y > Options.HEIGHT) {
                    this.gameOver();
                }
            break;
            case Options.GAME:
                if(this.started) {
                    this.timer -= dt;
                    if(this.timer < 0) {
                        this.timer = 0;
                        this.state = Options.TIME_UP;
                        this.vy = 2 * this.jumpPower;
                        this.jumping = this.steps[this.index + 1].side;
                    }
                }

                if(this.jumping) {
                    dt *= 4;
                    this.y += this.vy * dt;
                    this.vy += Options.GRAVITY * dt;
        
                    if(this.y >= this.base) {
                        this.y = this.base;
                        this.vy = 0;
                        this.index++;
        
                        if(this.steps[this.index].side + 1 !== this.jumping) {
                            this.state = Options.FALL;
                            return;
                        }
                        this.steps[this.index].used = true;
                        this.particles.start({x:this.px, y:this.py});
                        this.countSteps++;
                        this.updatePositions();
        
                    } else {
                        const spd = dt * 36;
                        for(let b = 0, l = this.steps.length; b < l; b++) {
                            const o = this.steps[b];
                            o.x += (this.jumping === Options.LEFT ? spd : -spd);
                            o.y += spd;
                        }
                    }
                }
                const o = this.steps[this.index];
                if(o.type === Options.BREAK && o.animFrame === 0) {
                    this.state = Options.FALL;
                } else if(o.type === Options.SPIKE && o.animFrame > 0) {
                    this.state = Options.PRICK;
                    this.vy = 2 * this.jumpPower;
                    this.jumping = this.steps[this.index + 1].side;// === Options.LEFT ? Options.RIGHT : Options.LEFT;
                }
            break;
        }
    }

    gameOver() {
        for(let b = 0, l = this.steps.length; b < l; b++) {
            this.steps[b].falling = true;
        }
        this.state = Options.DIE;
        this.started = false;
    }

    updatePositions() {
        for(let b = 0, l = this.steps.length; b < l; b++) {
            const o = this.steps[b],
            sx = this.jumping === Options.LEFT ? 22 : -22;
            o.x = o.ox + sx;
            o.ox += sx;
            o.y = o.oy + 21;
            o.oy += 21;
        }

        if(this.steps[0].x > Options.WIDTH || this.steps[0].y > Options.HEIGHT) {
            this.steps.splice(0, 1);
            this.index--;
            if(this.steps.length < 50) {
                this.addSteps(50);
            }
        }
        this.jumping = Options.NONE;
    }

    start() {
        this.y = (Options.HEIGHT >> 1) - (this.block.height >> 1);
        this.state = Options.GAME;
        this.jumping = Options.NONE;
        this.index = 0;
        this.vy = 0;
        this.steps.length = 0;
        this.countSteps = 0;
        this.timer = 180;
        this.started = false;

        const b = new Block(this.x - 10, this.y + 9, -1);
        b.used = true;
        this.steps.push(b);
        this.addSteps(59, true);
    }

    addSteps(cnt, create = false) {
        let last = this.steps[this.steps.length - 1]; 
        for(let c = 0; c < cnt; c++) {
            const t = (create && c < 20) ? 1 : Math.random(),
                  dir = ~~(Math.random() * 2);

            let block;
            if(t < .15) {
                block = new Break(last.x + (dir === 0 ? 22 : -22), last.y - 21, dir);
            } else if(t < .25) {
                block = new Spike(last.x + (dir === 0 ? 22 : -22), last.y - 21, dir);
            } else {
                block = new Block(last.x + (dir === 0 ? 22 : -22), last.y - 21, dir);
            }
            this.steps.push(block);
            last = block;
        }
    }

    input(e) {
        if(this.jumping || this.state === Options.DIE) return;
        switch(e.keyCode){
            case 37:
                this.vy = this.jumpPower;
                this.jumping = Options.LEFT;
                if(!this.started) this.started = true;
            break;
            case 39:
                this.vy = this.jumpPower;
                this.jumping = Options.RIGHT;
                if(!this.started) this.started = true;
            break;
        }
    }
}