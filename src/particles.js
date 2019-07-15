
const PART_ARRAY = 4;

class Particles {
    constructor() {
        this.partSystem = new Array(PART_ARRAY);

        for(let r = 0; r < PART_ARRAY; r++) {
            const part = [];
            for(let t = 0; t < 30; t++) {
                part.push({
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    g: 0,
                    alpha: 0,
                    size: 0
                });
            }
            this.partSystem[r] = {
                alive: false,
                prt: part,
            };
        }
    }

    getParticleIndex() {
        for(let r = 0; r < PART_ARRAY; r++) {
            if(!this.partSystem.alive) {
                return r;
            }
        }
    }

    update(dt) {
        for(let s = 0; s < PART_ARRAY; s++) {
            const particles = this.partSystem[s];
            if(!particles.alive) continue;

            let f = false;
            for(let t = 0, l = particles.prt.length; t < l; t++) {
                const p = particles.prt[t];
                if(p.alpha === 0) continue;
                f = true;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.y += p.g * dt;
                p.alpha -= 2.5 * dt;
                p.size += 8 * dt;
                if(p.alpha < 0) p.alpha = 0;
                particles.prt[t] = p;
            }
            if(!f) particles.alive = false;
        }
    }

    draw(ctx) {
        for(let s = 0; s < PART_ARRAY; s++) {
            const particles = this.partSystem[s];
            if(!particles.alive) continue;
            for(let t = 0, l = particles.prt.length; t < l; t++) {
                const p = particles.prt[t];
                ctx.fillStyle = `rgba(230, 0, 181, ${p.alpha} )`;
                ctx.fillRect(p.x -( p.size >> 1), p.y - (p.size >> 1), p.size, p.size);
            }
        }
    }

    start(o) {
        const z = this.getParticleIndex();
        this.partSystem[z].alive = true;
        for(let t = 0; t < 10; t++) {
            const r = this.partSystem[z].prt[t],
                  ang = Math.random() * Options.TWO_PI;
            r.x = o.x;
            r.y = o.y;
            r.vx = Math.cos(ang) * rand(80, 180);
            r.vy = Math.sin(1.7) * rand(80, 100);
            r.g = rand(-100, -150);
            r.alpha = 1;
            r.size = 2;//rand(2, 6);
        }
    }

    reset() {
        for(let r = 0; r < PART_ARRAY; r++) {
            this.partSystem[r].alive = false;
        }
    }
}