

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}

function rand(mn, mx) {
    const r = mx - mn;
    return Math.floor(Math.random() * r + mn);
}

class State {
    constructor() {}
    update(dt) {}
    draw(ctx) {}
    input(i) {}
    start() {}
    stats(ctx) {}
}