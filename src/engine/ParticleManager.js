export class ParticleManager {
    constructor(canvasWidth, canvasHeight, count = 15) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.particles = [];
        this.init(count);
    }

    init(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                r: Math.random() * 3 + 2,
                v: Math.random() * 1 + 0.5
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x -= p.v;
            p.y += p.v * 0.5;
            if (p.x < -10) {
                p.x = this.canvasWidth + 20;
                p.y = Math.random() * this.canvasHeight;
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(129, 178, 154, 0.6)";
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
