

class Resources {
    constructor(cb) {
        this.images = new Array(15);
        
        Promise.all([
            (loadImage("./img/block.png")).then((i) => {this.images[Options.BLOCK] = i;}),
            (loadImage("./img/blue.png")).then((i) => {this.images[Options.BLUE] = i;}),
            (loadImage("./img/lila.png")).then((i) => {this.images[Options.LILA]= i;}),
            (loadImage("./img/shadow.png")).then((i) => {this.images[Options.SHADOW] = i;}),
            (loadImage("./img/p1.png")).then((i) => {this.images[Options.P1] = i;}),
            (loadImage("./img/p2.png")).then((i) => {this.images[Options.P2] = i;}),
            (loadImage("./img/p3.png")).then((i) => {this.images[Options.P3] = i;}),
            (loadImage("./img/p4.png")).then((i) => {this.images[Options.P4] = i;}),
            (loadImage("./img/p5.png")).then((i) => {this.images[Options.P5] = i;}),
            (loadImage("./img/p6.png")).then((i) => {this.images[Options.P6] = i;})

        ]).then(() => {
            cb();
        });
    }

    image(index) {
        if(index < this.images.length) {
            return this.images[index];
        }
        return null;
    }
}