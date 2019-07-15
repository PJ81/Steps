

class GameOver extends State {
    constructor() {
        super();
        this.text1 = "";
        this.text2 = "";
    }

    set(str1, str2) {
        this.text1 = str1;
        this.text2 = str2;

        this.timer = 3;
    }

    update(dt) {
        this.timer -= dt;
        if(this.timer < 0) this.input(0);
    }

    draw(ctx) {
        ctx.fillStyle = "#ddd";
        ctx.font = "100px Quantico";
        ctx.fillText(this.text1, Options.WIDTH >> 1, Options.HEIGHT * .40);
        ctx.fillText(this.text2, Options.WIDTH >> 1, Options.HEIGHT * .54);
    }

    input(i) {
        window.dispatchEvent(new CustomEvent("stateChange", {
            detail: {
                state: Options.MENU
            }
        }));
    }
}