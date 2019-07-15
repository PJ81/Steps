
class Block {
    constructor(x, y, side) {
        this.type = Options.NORMAL;
        this.falling = this.used = false;
        this.alive = true;

        this.x = this.ox = x;
        this.y = this.oy = y;

        this.side = side;

        this.fallSpeed = rand(600, 800);

        this.animFrame = this.animFrameTime = 0;
        this.animDir = 1;
    }

    draw(ctx) {
        ctx.drawImage(this.used ? R.image(Options.LILA) :
                                  R.image(Options.BLUE), this.x, this.y);
    }

    update(dt) {
        if(this.falling) {
            this.y += this.fallSpeed * dt;
            this.fallSpeed += Options.GRAVITY * dt;
            if(this.y > Options.HEIGHT) {
                this.alive = false;
            }
        }
    }
}

class Break extends Block {
    constructor(x, y, side) {
        super(x, y, side);
        this.type = Options.BREAK;
        this.animFrame = Math.random();
        this.animFrameTime = .5;
        this.wait = 1;
    }

    draw(ctx) {
        ctx.globalAlpha = this.animFrame;
        ctx.drawImage(this.used ? R.image(Options.LILA) :
                                  R.image(Options.BLUE), this.x, this.y);
        ctx.globalAlpha = 1;
    }

    update(dt) {
        super.update(dt);
        if(this.wait) {
            this.wait -= dt;
            if(this.wait < 0) this.wait = 0;
            return;
        }

        this.animFrameTime -= dt;
        if(this.animFrameTime < 0) {
            this.animFrameTime = .08;
            this.animFrame += this.animDir * dt * 3;
            if(this.animFrame < 0) {
                this.animFrame = 0;
                this.animDir = -this.animDir;
                this.wait = 1.5;
            } else if(this.animFrame > 1) {
                this.animFrame = 1;
                this.animDir = -this.animDir;
                this.wait = 1.5;
            }
        }
    }
}

class Spike extends Block {
    constructor(x, y, side) {
        super(x, y, side);
        this.type = Options.SPIKE;
        this.animating = true;
        this.animFrame = rand(0, 7);
        this.animFrameTime = Math.random();
        this.wait = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.used ? R.image(Options.LILA) :
                                  R.image(Options.BLUE), this.x, this.y);
        if(this.animFrame > 0) {
            ctx.drawImage(R.image(Options.SHADOW + this.animFrame), this.x, this.y);
        }
    }

    update(dt) {
        super.update(dt);
        
        if(this.wait) {
            this.wait -= dt;
            if(this.wait < 0) {
                this.wait = 0;
            }
            return;
        }
        
        this.animFrameTime -= dt * this.animDir > 0 ? 1 : 2;
        
        if(this.animFrameTime < 0) {
            this.animFrameTime = .05;

            this.animFrame += this.animDir;

            if(this.animFrame > 6) {
                this.animFrame = 6;
                this.animDir = -this.animDir;
                this.wait = 1.5;
            } else if(this.animFrame < 0) {
                this.animFrame = 0;
                this.animDir = -this.animDir;
                this.wait = 1.5 + Math.random();
            }
        }
    }
}