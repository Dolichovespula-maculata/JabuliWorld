import { configuracaoMapas } from '../constants.js';

export const MUNDO_ABERTO_WIDTH = 4000;

export class World {
    constructor() {
        // Grass tufts (avoid placing in sky zone y<140)
        this.grassTuftsMJ = this._makeTufts(35, 1280, 145, 720);
        this.grassTuftsMA = this._makeTufts(220, 4000, 145, 720);

        // Bushes for pátio
        this.bushesMJ = [
            { x:62, y:360, s:0.9 }, { x:148, y:340, s:0.8 },
            { x:1118, y:360, s:0.88 }, { x:1198, y:400, s:0.72 }
        ];
        // Bushes spread across mundo aberto
        this.bushesMA = [];
        for (let i = 0; i < 48; i++) {
            this.bushesMA.push({
                x: 75 + i * 82 + Math.sin(i * 1.3) * 18,
                y: 180 + Math.random() * 360,
                s: 0.65 + Math.random() * 0.88
            });
        }

        // Big mushrooms in the Mushroom Kingdom zone (x 580-1380)
        this.mushrooms = [];
        for (let i = 0; i < 34; i++) {
            this.mushrooms.push({
                x: 600 + Math.random() * 750,
                y: 185 + Math.random() * 370,
                r: 16 + Math.random() * 40,
                cor: ['#c44b2e','#e76f51','#8338ec','#ff6b9d','#f2cc8f','#c04a8e','#5a2d8f'][Math.floor(Math.random()*7)],
                phase: Math.random() * Math.PI * 2
            });
        }

        // Bioluminescent plants (zone 6, x 2850-3400)
        this.glowPlants = [];
        for (let i = 0; i < 30; i++) {
            this.glowPlants.push({
                x: 2850 + Math.random() * 520,
                y: 180 + Math.random() * 350,
                r: 7 + Math.random() * 18,
                hue: Math.random() < 0.5 ? 'cyan' : 'purple',
                phase: Math.random() * Math.PI * 2
            });
        }

        // AC Trees placed in mundo_aberto (avoiding main path and structures)
        this.treesMA = [
            // Entry meadow zone (x 0-580)
            {x:72,y:195,s:0.72},{x:130,y:280,s:0.65},{x:188,y:175,s:0.68},{x:240,y:335,s:0.75},
            {x:308,y:210,s:0.7},{x:365,y:315,s:0.68},{x:430,y:240,s:0.72},{x:494,y:185,s:0.65},{x:548,y:320,s:0.7},
            // Post-mushroom (x 1380-2000)
            {x:1388,y:225,s:0.72},{x:1430,y:335,s:0.68},{x:1490,y:275,s:0.7},{x:1535,y:195,s:0.65},
            // Lake shores (x 2000-2600)
            {x:2020,y:260,s:0.75},{x:2050,y:360,s:0.7},{x:2550,y:255,s:0.72},{x:2590,y:345,s:0.68},
            // Market to bio-forest (x 2600-2850)
            {x:2640,y:195,s:0.7},{x:2690,y:330,s:0.68},{x:2740,y:240,s:0.72},
            // Observatory approach (x 3350-4000)
            {x:3355,y:235,s:0.75},{x:3400,y:320,s:0.7},{x:3445,y:185,s:0.68},{x:3490,y:300,s:0.72},
            {x:3545,y:225,s:0.7},{x:3600,y:340,s:0.68},{x:3660,y:260,s:0.65},
            {x:3740,y:220,s:0.72},{x:3820,y:190,s:0.7},{x:3875,y:295,s:0.68}
        ];

        // Clouds for pátio (thin sky strip)
        this.clouds = [
            {x:70,y:38,s:0.7},{x:280,y:22,s:1.0},{x:580,y:45,s:0.85},
            {x:860,y:28,s:0.9},{x:1140,y:42,s:0.75}
        ];
        // Clouds for mundo_aberto
        this.cloudsMundo = [];
        for (let i = 0; i < 28; i++) {
            this.cloudsMundo.push({ x: Math.random()*4300, y: 15+Math.random()*78, s: 0.7+Math.random()*1.3 });
        }

        // MJ towers (displayed near horizon)
        this.mjTowers = [
            {x:195, s:0.52}, {x:635, s:0.80}, {x:1062, s:0.50}
        ];
    }

    _makeTufts(count, worldW, minY, maxY) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({ x: Math.random()*worldW, y: minY+Math.random()*(maxY-minY), scale: 0.5+Math.random()*0.75 });
        }
        return arr;
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    drawCloud(ctx, cx, cy, s=1) {
        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.beginPath();
        ctx.arc(cx, cy, 27*s, 0, Math.PI*2);
        ctx.arc(cx+23*s, cy-8*s, 18*s, 0, Math.PI*2);
        ctx.arc(cx+46*s, cy, 23*s, 0, Math.PI*2);
        ctx.arc(cx+23*s, cy+8*s, 16*s, 0, Math.PI*2);
        ctx.fill();
    }

    // Animal Crossing-style tree: top-down elliptical canopy
    drawACTree(ctx, x, y, s=1) {
        // Drop shadow (downward = south in top-down view)
        ctx.fillStyle = "rgba(0,0,0,0.13)";
        ctx.beginPath();
        ctx.ellipse(x+5*s, y+9*s, 22*s, 11*s, 0, 0, Math.PI*2);
        ctx.fill();
        // Outer canopy
        ctx.fillStyle = "#2d9e8f";
        ctx.strokeStyle = "#1b6a60";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(x, y, 25*s, 19*s, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        // Highlight (top of canopy, lighter)
        ctx.fillStyle = "#50c8b8";
        ctx.beginPath();
        ctx.ellipse(x-5*s, y-5*s, 13*s, 9*s, 0, 0, Math.PI*2);
        ctx.fill();
        // Trunk (small, at bottom of canopy)
        ctx.fillStyle = "#8d705c";
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y+16*s, 5*s, 3*s, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
    }

    // Mushroom from top-down perspective
    drawMushroomTopDown(ctx, x, y, r, cor, glowAlpha=0) {
        // Glow halo
        if (glowAlpha > 0) {
            const grd = ctx.createRadialGradient(x, y, 0, x, y, r*2.2);
            grd.addColorStop(0, `${cor}40`);
            grd.addColorStop(1, `${cor}00`);
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.ellipse(x, y, r*2.2, r*1.7, 0, 0, Math.PI*2);
            ctx.fill();
        }
        // Drop shadow
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.ellipse(x+4, y+7, r*0.82, r*0.48, 0, 0, Math.PI*2);
        ctx.fill();
        // Main cap (slightly elliptical = top-down foreshortening)
        ctx.fillStyle = cor;
        ctx.strokeStyle = "#3d2f26";
        ctx.lineWidth = Math.max(1.2, r*0.055);
        ctx.beginPath();
        ctx.ellipse(x, y, r, r*0.76, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        // Depth/shadow on cap
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = r*0.1;
        ctx.beginPath();
        ctx.ellipse(x, y, r*0.82, r*0.62, 0, 0, Math.PI*2);
        ctx.stroke();
        // White spots
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        [[0,-r*0.38],[-r*0.38,-r*0.18],[r*0.38,-r*0.18],[0,r*0.21],[-r*0.18,r*0.01]].forEach(([dx,dy]) => {
            ctx.beginPath();
            ctx.arc(x+dx, y+dy, r*0.11, 0, Math.PI*2);
            ctx.fill();
        });
        // Stem (visible as small ellipse)
        ctx.fillStyle = "#f4f1eb";
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y+r*0.6, r*0.22, r*0.12, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
    }

    drawBush(ctx, x, y, s=1) {
        ctx.fillStyle = "#2a9d8f";
        ctx.strokeStyle = "#1b6a60"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, 18*s, 12*s, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        // Highlight
        ctx.fillStyle = "#42c4b0";
        ctx.beginPath();
        ctx.ellipse(x-5*s, y-3*s, 9*s, 6*s, 0, 0, Math.PI*2);
        ctx.fill();
        // Berries
        ctx.fillStyle = "#e76f51"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1;
        [[7,3],[-8,5],[3,-6]].forEach(([dx,dy]) => {
            ctx.beginPath();
            ctx.arc(x+dx*s, y+dy*s, 2.5*s, 0, Math.PI*2);
            ctx.fill();
        });
    }

    drawGrassTuft(ctx, x, y, scale) {
        ctx.strokeStyle = "#8ba65e"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.quadraticCurveTo(x-3*scale, y-7*scale, x-5*scale, y-11*scale);
        ctx.moveTo(x,y);
        ctx.quadraticCurveTo(x, y-11*scale, x, y-14*scale);
        ctx.moveTo(x,y);
        ctx.quadraticCurveTo(x+4*scale, y-5*scale, x+6*scale, y-9*scale);
        ctx.stroke();
    }

    _drawMiniTurbine(ctx, x, y, s=1) {
        const t = Date.now()/600;
        ctx.strokeStyle = "#a8c8d8"; ctx.lineWidth = 1.5*s;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-18*s); ctx.stroke();
        ctx.save(); ctx.translate(x,y-18*s); ctx.rotate(t);
        ctx.strokeStyle = "#c8e4f0";
        for (let i=0;i<3;i++) { ctx.rotate(Math.PI*2/3); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-10*s); ctx.stroke(); }
        ctx.restore();
    }

    drawSolarpunkTower(ctx, cx, groundY, floors=8, s=1) {
        const fh = 44*s;
        ctx.fillStyle = "rgba(150,185,172,0.48)";
        ctx.beginPath(); ctx.rect(cx-5*s, groundY-floors*fh-48*s, 10*s, floors*fh+48*s); ctx.fill();
        for (let i=0;i<floors;i++) {
            const fy = groundY-i*fh;
            const twist = Math.sin(i*0.55)*20*s;
            const fcx = cx+twist;
            const rx = (57+Math.sin(i*0.9)*13)*s;
            const ry = 11*s;
            if (i<floors-1) {
                const nt=Math.sin((i+1)*0.55)*20*s, ncx=cx+nt;
                const nfy=groundY-(i+1)*fh, nrx=(57+Math.sin((i+1)*0.9)*13)*s;
                ctx.strokeStyle="rgba(100,165,148,0.4)"; ctx.lineWidth=2.2*s;
                ctx.beginPath(); ctx.moveTo(fcx-rx*0.88,fy-ry);
                ctx.quadraticCurveTo(cx-22*s,(fy+nfy)/2,ncx-nrx*0.88,nfy-ry); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(fcx+rx*0.88,fy-ry);
                ctx.quadraticCurveTo(cx+22*s,(fy+nfy)/2,ncx+nrx*0.88,nfy-ry); ctx.stroke();
            }
            ctx.fillStyle="rgba(0,0,0,0.07)";
            ctx.beginPath(); ctx.ellipse(fcx+4*s,fy+5*s,rx*0.88,ry*0.65,0,0,Math.PI*2); ctx.fill();
            const grd=ctx.createRadialGradient(fcx,fy-ry*0.3,0,fcx,fy,rx);
            grd.addColorStop(0,"rgba(224,240,232,0.93)");
            grd.addColorStop(0.65,"rgba(172,208,192,0.89)");
            grd.addColorStop(1,"rgba(128,178,162,0.85)");
            ctx.fillStyle=grd; ctx.strokeStyle="rgba(72,152,138,0.72)"; ctx.lineWidth=1.5*s;
            ctx.beginPath(); ctx.ellipse(fcx,fy,rx,ry,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
            if (i%2===0) this.drawACTree(ctx, fcx+rx*0.55, fy-ry, s*0.32);
            if (i%3===2) this._drawMiniTurbine(ctx, fcx-rx*0.62, fy-ry-2, s*0.4);
        }
        const topY=groundY-floors*fh-22*s;
        ctx.strokeStyle="rgba(160,205,188,0.8)"; ctx.lineWidth=2*s;
        ctx.beginPath(); ctx.moveTo(cx,groundY-floors*fh); ctx.lineTo(cx,topY); ctx.stroke();
        ctx.fillStyle="rgba(72,220,196,0.88)";
        ctx.beginPath(); ctx.arc(cx,topY,4*s,0,Math.PI*2); ctx.fill();
    }

    // ─── MAIN DRAW ────────────────────────────────────────────────────────────
    draw(ctx, mapaAtual, canvasWidth, canvasHeight, camera) {
        if (mapaAtual === "meu_jardim") {
            this.drawMeuJardim(ctx, canvasWidth, canvasHeight);
        } else if (mapaAtual === "mundo_aberto") {
            this.drawMundoAberto(ctx, canvasWidth, canvasHeight, camera);
        }
    }

    // ─── PÁTIO SOLARPUNK (isometric / Animal Crossing top-down) ──────────────
    drawMeuJardim(ctx, W, H) {
        // === THIN SKY STRIP (≈18% of screen) ===
        const sky = ctx.createLinearGradient(0, 0, 0, 138);
        sky.addColorStop(0, "#4ea8dc");
        sky.addColorStop(0.7, "#9ad2ec");
        sky.addColorStop(1, "#c0ead8");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 138);
        this.clouds.forEach(c => this.drawCloud(ctx, c.x, c.y, c.s));

        // Horizon strip / far ground
        ctx.fillStyle = "#9cc87a";
        ctx.fillRect(0, 118, W, 28);
        const hz = ctx.createLinearGradient(0, 114, 0, 148);
        hz.addColorStop(0, "rgba(154,208,238,0.82)");
        hz.addColorStop(1, "rgba(156,200,122,0)");
        ctx.fillStyle = hz; ctx.fillRect(0, 114, W, 34);

        // === TOWERS IN BACKGROUND (near horizon) ===
        this.mjTowers.forEach(t => {
            this.drawSolarpunkTower(ctx, t.x, 285, 7, t.s);
        });

        // === MAIN GROUND (fills ~82% of screen) ===
        const gnd = ctx.createLinearGradient(0, 128, 0, H);
        gnd.addColorStop(0, "#aed890");
        gnd.addColorStop(0.18, "#9ac87c");
        gnd.addColorStop(1, "#80b062");
        ctx.fillStyle = gnd;
        ctx.beginPath();
        ctx.moveTo(-10, 128); ctx.quadraticCurveTo(W/2, 122, W+10, 128);
        ctx.lineTo(W+10, H); ctx.lineTo(-10, H); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-10, 128); ctx.quadraticCurveTo(W/2, 122, W+10, 128); ctx.stroke();

        // === ISOMETRIC GRID (perspective illusion) ===
        ctx.strokeStyle = "rgba(0,0,0,0.038)"; ctx.lineWidth = 1;
        // Horizontal rows (land rows receding into distance)
        for (let gy = 148; gy < H; gy += 42) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
        // Diamond/diagonal grid
        ctx.strokeStyle = "rgba(0,0,0,0.022)";
        for (let gx = -200; gx < W+200; gx += 88) {
            ctx.beginPath(); ctx.moveTo(gx, 128); ctx.lineTo(gx+330, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(gx, 128); ctx.lineTo(gx-330, H); ctx.stroke();
        }

        // === FAR BACKGROUND TREES ===
        [[105,198,0.58],[225,188,0.52],[445,210,0.62],[840,200,0.58],[985,206,0.55],[1148,194,0.60]].forEach(([x,y,s]) => {
            this.drawACTree(ctx, x, y, s);
        });

        // === PLAZA PERSPECTIVE TILES ===
        // Converging vertical lines toward vanishing point (W/2, 128)
        ctx.strokeStyle = "rgba(170,148,120,0.16)"; ctx.lineWidth = 1;
        for (let ti=0; ti<=14; ti++) {
            const bt = ti/14;
            const bx = 60 + bt*(W-120);
            const tx = W/2 + (bx - W/2)*0.08;
            ctx.beginPath(); ctx.moveTo(tx, 255); ctx.lineTo(bx, H); ctx.stroke();
        }
        // Horizontal tile bands
        [262, 318, 385, 462, 548, 642, 720].forEach(ty => {
            ctx.beginPath(); ctx.moveTo(60, ty); ctx.lineTo(W-60, ty); ctx.stroke();
        });
        // Plaza surface tint
        ctx.fillStyle = "rgba(232,215,192,0.15)";
        ctx.beginPath();
        ctx.moveTo(60,262); ctx.lineTo(W-60,262); ctx.lineTo(W-60,H); ctx.lineTo(60,H); ctx.closePath(); ctx.fill();

        // === GRASS TUFTS ===
        this.grassTuftsMJ.forEach(t => {
            if (t.y > 148) this.drawGrassTuft(ctx, t.x, t.y, t.scale);
        });
        this.bushesMJ.forEach(b => this.drawBush(ctx, b.x, b.y, b.s));

        // Some flower accents
        [[170,228],[420,242],[700,225],[950,238],[1175,242]].forEach(([fx,fy]) => {
            ctx.fillStyle = "#e07a5f"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#f2cc8f"; ctx.beginPath(); ctx.arc(fx, fy, 1.8, 0, Math.PI*2); ctx.fill();
        });

        // === PERSPECTIVE PATH (gets wider toward viewer) ===
        ctx.fillStyle = "#eedfd2"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
        // Right path toward exit
        for (let i=0; i<12; i++) {
            const t = i/11;
            const py = 325+t*335, px = 640+t*545;
            const sw = 20+t*22, sh = 11+t*11;
            ctx.beginPath(); ctx.roundRect(px-sw/2, py-sh/2, sw, sh, 5); ctx.fill(); ctx.stroke();
        }
        // Left path toward terminal
        for (let i=0; i<8; i++) {
            const t = i/7;
            const py = 380+t*110, px = 580-t*210;
            const sw = 18+t*14, sh = 10+t*9;
            ctx.beginPath(); ctx.roundRect(px-sw/2, py-sh/2, sw, sh, 5); ctx.fill(); ctx.stroke();
        }

        // === RIGHT EXIT INDICATOR ===
        ctx.fillStyle = "rgba(42,157,143,0.18)"; ctx.strokeStyle = "#2a9d8f"; ctx.lineWidth = 2;
        ctx.setLineDash([6,4]);
        ctx.beginPath(); ctx.rect(1237, 320, 43, 280); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#2a9d8f"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
        ctx.save(); ctx.translate(1258, 460); ctx.rotate(Math.PI/2);
        ctx.fillText("MUNDO ABERTO →", 0, 0); ctx.restore();

        // Map title
        ctx.fillStyle = "#3d2f26"; ctx.font = "bold 16px 'Outfit', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("🌿 Jabuli World: Pátio Solarpunk", 40, 45);
    }

    // ─── MUNDO ABERTO (4000px – isometric top-down, well-organized) ──────────
    drawMundoAberto(ctx, W, H, camera) {
        const camX = camera ? camera.x : 0;
        const visL = camX - 280;
        const visR = camX + W + 280;

        // === SKY STRIP ===
        const sky = ctx.createLinearGradient(camX, 0, camX, 138);
        sky.addColorStop(0, "#4ea8dc");
        sky.addColorStop(0.7, "#98ccee");
        sky.addColorStop(1, "#bce8d8");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, MUNDO_ABERTO_WIDTH, 138);
        this.cloudsMundo.forEach(c => {
            if (c.x > visL-100 && c.x < visR+100) this.drawCloud(ctx, c.x, c.y, c.s);
        });

        // Far ground strip
        ctx.fillStyle = "#92be74"; ctx.fillRect(0, 116, MUNDO_ABERTO_WIDTH, 28);
        const hgrd = ctx.createLinearGradient(camX, 110, camX, 150);
        hgrd.addColorStop(0, "rgba(148,205,232,0.78)");
        hgrd.addColorStop(1, "rgba(146,190,116,0)");
        ctx.fillStyle = hgrd; ctx.fillRect(camX, 110, W, 40);

        // === BASE GROUND ===
        ctx.fillStyle = "#98c478"; ctx.fillRect(0, 124, MUNDO_ABERTO_WIDTH, H);

        // Zone tints (subtle biome differentiation)
        if (visR > 580 && visL < 1400) { // Mushroom Kingdom: slight purple/mauve tint
            ctx.fillStyle = "rgba(100,60,148,0.09)";
            ctx.fillRect(580, 124, 820, H);
        }
        if (visR > 1400 && visL < 2050) { // Waterfall: slightly cooler blue-green
            ctx.fillStyle = "rgba(80,160,210,0.07)";
            ctx.fillRect(1400, 124, 650, H);
        }
        if (visR > 2870 && visL < 3420) { // Bio-forest: darker
            ctx.fillStyle = "rgba(20,10,55,0.12)";
            ctx.fillRect(2870, 124, 550, H);
        }
        if (visR > 3420 && visL < 4000) { // Observatory plateau: warmer
            ctx.fillStyle = "rgba(60,30,0,0.04)";
            ctx.fillRect(3420, 124, 580, H);
        }

        // Horizon ground stroke
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0,128); ctx.bezierCurveTo(1000,122,2500,126,4000,128); ctx.stroke();

        // === ISOMETRIC GRID ===
        ctx.strokeStyle = "rgba(0,0,0,0.03)"; ctx.lineWidth = 1;
        const gLeft = Math.max(0, visL);
        const gRight = Math.min(MUNDO_ABERTO_WIDTH, visR);
        for (let gy = 148; gy < H; gy += 44) {
            ctx.beginPath(); ctx.moveTo(gLeft, gy); ctx.lineTo(gRight, gy); ctx.stroke();
        }
        ctx.strokeStyle = "rgba(0,0,0,0.018)";
        for (let gx = Math.floor(visL/88)*88; gx < visR+88; gx += 88) {
            ctx.beginPath(); ctx.moveTo(gx,128); ctx.lineTo(gx+350,H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(gx,128); ctx.lineTo(gx-350,H); ctx.stroke();
        }

        // ── ZONE 1: PRADO DE ENTRADA (x 0-580) ──────────────────────────────
        if (visR > 0 && visL < 580) {
            // Wildflowers scattered
            [[85,278],[148,350],[218,262],[310,318],[415,282],[515,335]].forEach(([fx,fy]) => {
                if (fx<visL||fx>visR) return;
                ctx.fillStyle="#e07a5f"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1;
                ctx.beginPath(); ctx.arc(fx,fy,5,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle="#f2cc8f"; ctx.beginPath(); ctx.arc(fx,fy,2,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle="#2a9d8f"; ctx.beginPath(); ctx.moveTo(fx,fy+5); ctx.lineTo(fx-2,fy+14); ctx.stroke();
            });

            // Garden patch (Serrano's tomato plot, from above)
            if (visR > 175 && visL < 330) {
                ctx.fillStyle="#a17c66"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
                ctx.beginPath(); ctx.roundRect(175, 400, 130, 80, 6); ctx.fill(); ctx.stroke();
                ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.moveTo(240,400); ctx.lineTo(240,480); ctx.moveTo(175,440); ctx.lineTo(305,440); ctx.stroke();
                // Tomatoes (top-down circles)
                [[205,420],[275,420],[205,458],[275,458]].forEach(([tx,ty]) => {
                    ctx.fillStyle="#e76f51"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1;
                    ctx.beginPath(); ctx.arc(tx,ty,7,0,Math.PI*2); ctx.fill(); ctx.stroke();
                    ctx.fillStyle="#2a9d8f";
                    ctx.beginPath(); ctx.arc(tx,ty-8,3.5,0,Math.PI*2); ctx.fill();
                });
                // Watering can icon near garden
                ctx.fillStyle="#4a90d9"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
                ctx.beginPath(); ctx.roundRect(312,415,24,16,4); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(336,418); ctx.lineTo(345,415); ctx.lineTo(342,420); ctx.stroke();
            }
        }

        // ── ZONE 2: REINO DOS COGUMELOS (x 580-1400) ─────────────────────────
        if (visR > 580 && visL < 1400) {
            // Fairy ring dark patches on ground
            const ring1 = {cx:785, cy:340, r:92};
            const ring2 = {cx:1105, cy:430, r:115};
            [ring1, ring2].forEach(ring => {
                ctx.strokeStyle = "rgba(100,50,158,0.16)"; ctx.lineWidth = 28;
                ctx.beginPath(); ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI*2); ctx.stroke();
                ctx.strokeStyle = "rgba(100,50,158,0.07)"; ctx.lineWidth = 55;
                ctx.beginPath(); ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI*2); ctx.stroke();
            });

            // Magical ground glow
            const glt = Date.now()/950;
            const glowAlpha = 0.055+Math.sin(glt)*0.028;
            ctx.fillStyle = `rgba(140,70,200,${glowAlpha})`;
            ctx.beginPath(); ctx.ellipse(960, 400, 420, 230, 0, 0, Math.PI*2); ctx.fill();

            // Big mushrooms (the star of this zone)
            // Sort by y so closer ones draw over farther ones (painter's alg)
            const visibleMushrooms = this.mushrooms.filter(m => m.x > visL-m.r && m.x < visR+m.r);
            visibleMushrooms.sort((a,b) => a.y - b.y);
            visibleMushrooms.forEach(m => {
                const alpha = 0.30 + Math.sin(glt + m.phase)*0.22;
                this.drawMushroomTopDown(ctx, m.x, m.y, m.r, m.cor, alpha);
            });

            // Floating spore particles
            const st = Date.now()/480;
            for (let i=0; i<8; i++) {
                const sx = 620+i*100+Math.sin(st+i*1.4)*28;
                const sy = 180+Math.cos(st*0.75+i)*45;
                if (sx>visL && sx<visR) {
                    ctx.fillStyle = `rgba(190,130,230,${0.45+Math.sin(st+i)*0.22})`;
                    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI*2); ctx.fill();
                    // Tiny mushroom mini spore
                    ctx.fillStyle = `rgba(190,130,230,${0.15+Math.sin(st+i)*0.1})`;
                    ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI*2); ctx.fill();
                }
            }

            // Zone label fade
            if (visR > 650 && visL < 950) {
                ctx.fillStyle = "rgba(80,40,120,0.35)";
                ctx.font = "bold 18px 'Outfit', sans-serif"; ctx.textAlign = "center";
                ctx.fillText("🍄 Reino dos Cogumelos", 785, 155);
            }
        }

        // ── ZONE 3: CACHOEIRA & RIO (x 1400-2050) ────────────────────────────
        if (visR > 1400 && visL < 2050) {
            // Rocky cliff (top-down footprint)
            ctx.fillStyle = "#888878"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(1390, 138); ctx.bezierCurveTo(1410,150,1452,144,1490,146);
            ctx.bezierCurveTo(1530,148,1555,155,1560,162);
            ctx.lineTo(1560, 260); ctx.lineTo(1390, 260); ctx.closePath(); ctx.fill(); ctx.stroke();
            // Rock highlights
            ctx.fillStyle = "#aaa898";
            ctx.beginPath(); ctx.ellipse(1455, 185, 30, 18, -0.3, 0, Math.PI*2); ctx.fill();

            // Waterfall (animated white stream from above)
            const wt = Date.now()/130;
            ctx.strokeStyle = "rgba(165,228,248,0.85)"; ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.moveTo(1438, 162);
            ctx.bezierCurveTo(1445+Math.sin(wt)*6, 235, 1440+Math.sin(wt+1)*5, 350, 1448, 462);
            ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 9;
            ctx.beginPath();
            ctx.moveTo(1440, 162);
            ctx.bezierCurveTo(1447+Math.sin(wt)*3, 240, 1443+Math.sin(wt+1)*4, 352, 1450, 462);
            ctx.stroke();

            // Splash pool (top-down)
            ctx.fillStyle = "#82dae8"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(1460, 490, 62, 38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            const rt = (Date.now()/420)%1;
            ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(1460,490, 62*(1+rt*0.45), 38*(1+rt*0.45), 0, 0, Math.PI*2); ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(1460,490, 62*(1+rt*0.9), 38*(1+rt*0.9), 0, 0, Math.PI*2); ctx.stroke();

            // River (from waterfall to lake, top-down)
            ctx.fillStyle = "#68c8dc"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(1430,505); ctx.bezierCurveTo(1490,545,1600,525,1700,545);
            ctx.bezierCurveTo(1800,565,1890,554,1980,558);
            ctx.lineTo(1985,580); ctx.bezierCurveTo(1895,576,1805,578,1705,568);
            ctx.bezierCurveTo(1605,548,1495,568,1432,530); ctx.closePath(); ctx.fill(); ctx.stroke();
            // River sparkles
            const rst = Date.now()/300;
            [[1530,536],[1640,530],[1760,546],[1880,540]].forEach(([rx,ry],ri) => {
                const ra = 0.3+Math.sin(rst+ri*0.8)*0.3;
                ctx.fillStyle = `rgba(255,255,255,${ra})`;
                ctx.beginPath(); ctx.arc(rx,ry,3,0,Math.PI*2); ctx.fill();
            });
        }

        // ── ZONE 4: GRANDE LAGO (x 2050-2650) ────────────────────────────────
        if (visR > 2050 && visL < 2650) {
            // Lake body (large, top-down ellipse)
            const lakeGrd = ctx.createRadialGradient(2350, 440, 0, 2350, 440, 320);
            lakeGrd.addColorStop(0, "#4ab8d8");
            lakeGrd.addColorStop(0.62, "#2e9ab8");
            lakeGrd.addColorStop(1, "#1a7ea8");
            ctx.fillStyle = lakeGrd; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.ellipse(2350, 440, 325, 205, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();

            // Concentric ripple rings
            const lt = Date.now()/620;
            [0.35, 0.58, 0.80].forEach((f, i) => {
                const a = 0.18 - i*0.04;
                ctx.strokeStyle = `rgba(255,255,255,${a+Math.sin(lt+i)*0.04})`;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.ellipse(2350,440, 325*f, 205*f, 0, 0, Math.PI*2); ctx.stroke();
            });

            // Lily pads (top-down circles with notch)
            [[2145,398,13],[2215,488,16],[2390,380,12],[2458,495,15],[2510,418,11],[2168,462,14]].forEach(([lx,ly,lr]) => {
                ctx.fillStyle="#2a9d8f"; ctx.strokeStyle="#1b6a60"; ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.arc(lx,ly,lr,0.15,Math.PI*2-0.15); ctx.lineTo(lx,ly); ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.fillStyle="#f2cc8f";
                ctx.beginPath(); ctx.arc(lx+3,ly-3,lr*0.3,0,Math.PI*2); ctx.fill();
            });

            // Koi fish (animated top-down)
            [[2230,425,8,-0.3,"#e76f51"],[2440,455,7,0.4,"#fff"],[2320,388,6,0,"#e07a5f"]].forEach(([kx,ky,kr,ka,kc],ki) => {
                const t2 = Date.now()/850+ki;
                const ax = kx + Math.sin(t2)*85;
                const ay = ky + Math.cos(t2*0.7)*55;
                ctx.save(); ctx.translate(ax,ay); ctx.rotate(ka+Math.sin(t2)*0.2);
                ctx.fillStyle=kc; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1;
                ctx.beginPath(); ctx.ellipse(0,0,kr,kr*0.5,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle=kc==="fff"?"#e76f51":kc;
                ctx.beginPath(); ctx.moveTo(-kr,0); ctx.lineTo(-kr-5,-3); ctx.lineTo(-kr-3,0); ctx.lineTo(-kr-5,3); ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.restore();
            });

            // Bridge (top-down: two rails + planks)
            ctx.strokeStyle="#3d2f26"; ctx.lineWidth=4.5;
            ctx.beginPath(); ctx.moveTo(2100,400); ctx.lineTo(2600,400); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(2100,430); ctx.lineTo(2600,430); ctx.stroke();
            ctx.fillStyle="#baa68a";
            ctx.beginPath(); ctx.rect(2100,402,500,26); ctx.fill();
            ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1.5;
            for (let bx=2115; bx<2600; bx+=15) {
                ctx.beginPath(); ctx.moveTo(bx,400); ctx.lineTo(bx,430); ctx.stroke();
            }
            // Rail shadows
            ctx.strokeStyle="#5a4235"; ctx.lineWidth=3.5;
            ctx.beginPath(); ctx.moveTo(2100,400); ctx.lineTo(2600,400); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(2100,430); ctx.lineTo(2600,430); ctx.stroke();
        }

        // ── ZONE 5: MERCADO SOLAR (x 2650-3300) ──────────────────────────────
        if (visR > 2650 && visL < 3300) {
            // Cobblestone plaza (from above)
            ctx.fillStyle = "rgba(218,200,172,0.28)";
            ctx.beginPath(); ctx.roundRect(2670, 260, 600, 390, 18); ctx.fill();
            ctx.fillStyle = "#d8c8b5"; ctx.strokeStyle = "rgba(175,150,120,0.28)"; ctx.lineWidth = 1;
            for (let cx=2680; cx<3260; cx+=30) {
                for (let cy=268; cy<640; cy+=22) {
                    const off = Math.floor((cy-268)/22)%2===0 ? 0 : 15;
                    ctx.beginPath(); ctx.roundRect(cx+off,cy,27,19,4); ctx.fill(); ctx.stroke();
                }
            }

            // Market tents (top-down diamond = roof from above)
            [{x:2750,c:"#e76f51"},{x:2900,c:"#f2cc8f"},{x:3050,c:"#2a9d8f"},{x:3200,c:"#e07a5f"}].forEach(tent => {
                ctx.fillStyle=tent.c; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
                ctx.beginPath();
                ctx.moveTo(tent.x, 275); ctx.lineTo(tent.x+52,325); ctx.lineTo(tent.x,375); ctx.lineTo(tent.x-52,325);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.fillStyle="#5a4235"; ctx.beginPath(); ctx.arc(tent.x,325,5,0,Math.PI*2); ctx.fill();
                // Bunting
                ctx.strokeStyle="rgba(255,255,255,0.45)"; ctx.lineWidth=1; ctx.setLineDash([5,5]);
                ctx.beginPath(); ctx.moveTo(tent.x-48,296); ctx.lineTo(tent.x,318); ctx.lineTo(tent.x+48,296); ctx.stroke();
                ctx.setLineDash([]);
            });

            // Barrels (top-down circles)
            [[2735,408],[2750,392],[2850,416],[2865,398]].forEach(([bx,by]) => {
                ctx.fillStyle="#8d705c"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.arc(bx,by,11,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.strokeStyle="#5a4235"; ctx.lineWidth=1;
                ctx.beginPath(); ctx.arc(bx,by,6,0,Math.PI*2); ctx.stroke();
            });

            // Campfire (animated, top-down)
            const cft = Date.now()/100;
            ctx.fillStyle="#5a4235"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
            ctx.beginPath(); ctx.ellipse(3100,510,18,10,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle=`rgba(231,111,81,${0.72+Math.sin(cft)*0.2})`;
            ctx.beginPath(); ctx.ellipse(3100,510,12,7,0,0,Math.PI*2); ctx.fill();
            ctx.fillStyle=`rgba(242,204,143,${0.6+Math.cos(cft)*0.22})`;
            ctx.beginPath(); ctx.ellipse(3100,510,6,3.5,0,0,Math.PI*2); ctx.fill();
            ctx.fillStyle=`rgba(231,111,81,${0.12+Math.sin(cft)*0.06})`;
            ctx.beginPath(); ctx.ellipse(3100,510,44,26,0,0,Math.PI*2); ctx.fill();
        }

        // ── ZONE 6: FLORESTA BIOLUMINESCENTE (x 2870-3450) ───────────────────
        if (visR > 2870 && visL < 3450) {
            const glt = Date.now()/880;
            this.glowPlants.forEach(gp => {
                if (gp.x<visL||gp.x>visR) return;
                const a = 0.38+Math.sin(glt+gp.phase)*0.28;
                const col = gp.hue==='cyan' ? `rgba(0,210,175,${a})` : `rgba(175,80,220,${a})`;
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.ellipse(gp.x,gp.y,gp.r,gp.r*0.65,0,0,Math.PI*2); ctx.fill();
                const col2 = gp.hue==='cyan' ? `rgba(0,210,175,${a*0.2})` : `rgba(175,80,220,${a*0.2})`;
                ctx.fillStyle = col2;
                ctx.beginPath(); ctx.ellipse(gp.x,gp.y,gp.r*2.1,gp.r*1.6,0,0,Math.PI*2); ctx.fill();
            });
        }

        // ── ZONE 7: PLATÔ DO OBSERVATÓRIO (x 3450-4000) ─────────────────────
        if (visR > 3450 && visL < 4000) {
            // Raised plateau (darker ground)
            ctx.fillStyle="#85a868"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(3435,152); ctx.bezierCurveTo(3580,135,3780,128,3960,138);
            ctx.lineTo(4050,180); ctx.lineTo(4050,H); ctx.lineTo(3435,H); ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Observatory dome (top-down circle)
            ctx.fillStyle="#c8d8d0"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2.5;
            ctx.beginPath(); ctx.arc(3730,295,58,0,Math.PI*2); ctx.fill(); ctx.stroke();
            // Dome slit
            ctx.strokeStyle="#3d2f26"; ctx.lineWidth=3;
            ctx.beginPath(); ctx.moveTo(3730,237); ctx.lineTo(3730,353); ctx.stroke();
            // Telescope (top-down rotated rectangle)
            ctx.fillStyle="#8d9d98";
            ctx.save(); ctx.translate(3730,286); ctx.rotate(Math.PI*0.28);
            ctx.beginPath(); ctx.roundRect(-6,-32,12,62,4); ctx.fill(); ctx.stroke();
            ctx.restore();
            // Dome outer ring
            ctx.strokeStyle="rgba(100,140,130,0.35)"; ctx.lineWidth=14;
            ctx.beginPath(); ctx.arc(3730,295,75,0,Math.PI*2); ctx.stroke();

            // Solar panels on plateau
            [[3530,360],[3592,342],[3656,330],[3535,408],[3598,390]].forEach(([px,py]) => {
                ctx.fillStyle="#1e6051"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.rect(px,py,44,27); ctx.fill(); ctx.stroke();
                ctx.strokeStyle="#48bcae"; ctx.lineWidth=1;
                ctx.beginPath(); ctx.moveTo(px+15,py); ctx.lineTo(px+15,py+27); ctx.moveTo(px+29,py); ctx.lineTo(px+29,py+27); ctx.stroke();
            });

            // Stars (near observatory)
            const st = Date.now()/330;
            [[3460,152],[3575,138],[3678,128],[3820,142],[3945,132],[3500,196],[3638,182]].forEach(([sx,sy],i) => {
                const sa = 0.38+Math.sin(st+i*1.35)*0.36;
                ctx.fillStyle = `rgba(255,240,180,${sa})`;
                ctx.beginPath(); ctx.arc(sx,sy,2.8,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = `rgba(255,240,180,${sa*0.4})`; ctx.lineWidth=0.8;
                for (let r=0;r<4;r++) {
                    ctx.save(); ctx.translate(sx,sy); ctx.rotate(r*Math.PI/2);
                    ctx.beginPath(); ctx.moveTo(0,-4.5); ctx.lineTo(0,4.5); ctx.stroke();
                    ctx.restore();
                }
            });
        }

        // === AC TREES (all zones, sorted by y for depth) ===
        const visibleTrees = this.treesMA.filter(t => t.x > visL-30 && t.x < visR+30);
        visibleTrees.sort((a,b) => a.y-b.y);
        visibleTrees.forEach(t => this.drawACTree(ctx, t.x, t.y, t.s));

        // === GRASS TUFTS ===
        this.grassTuftsMA.forEach(t => {
            if (t.x<visL||t.x>visR||t.y<142) return;
            this.drawGrassTuft(ctx, t.x, t.y, t.scale);
        });

        // === BUSHES ===
        this.bushesMA.forEach(b => {
            if (b.x<visL-30||b.x>visR+30) return;
            this.drawBush(ctx, b.x, b.y, b.s);
        });

        // === MAIN WINDING PATH ===
        ctx.fillStyle="#eedfd2"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1.8;
        for (let px=90; px<3950; px+=68) {
            if (px<visL-50||px>visR+50) continue;
            // Skip lake zone (bridge handles it) and waterfall pool
            if (px>2100 && px<2600) continue;
            if (px>1445 && px<1490) continue;
            const py = 512+Math.sin(px*0.011)*58+Math.sin(px*0.026)*28;
            if (py<142) continue;
            const t2 = (py-512)/200;
            const sw = 22+t2*4; const sh = 12+t2*3;
            ctx.beginPath(); ctx.roundRect(px-sw/2,py-sh/2,sw,sh,5); ctx.fill(); ctx.stroke();
        }
        // Bridge path stones
        ctx.fillStyle="#eedfd2"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=1.8;
        for (let bx=2115; bx<2590; bx+=20) {
            ctx.beginPath(); ctx.roundRect(bx,403,16,22,3); ctx.fill(); ctx.stroke();
        }

        // === LEFT EXIT ===
        ctx.fillStyle="rgba(42,157,143,0.18)"; ctx.strokeStyle="#2a9d8f"; ctx.lineWidth=2;
        ctx.setLineDash([6,4]);
        ctx.beginPath(); ctx.rect(0,320,44,280); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="#2a9d8f"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.save(); ctx.translate(22,460); ctx.rotate(-Math.PI/2);
        ctx.fillText("← PÁTIO",0,0); ctx.restore();

        // Map title
        ctx.fillStyle="#3d2f26"; ctx.font="bold 16px 'Outfit', sans-serif"; ctx.textAlign="left";
        ctx.fillText("🌍 Jabuli World: Mundo Aberto", camX+40, 45);
    }

    // Bridge front rail (minimal in top-down view - just depth shadow on south edge)
    drawBridgeFront(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.beginPath(); ctx.rect(2100, 428, 500, 8); ctx.fill();
        ctx.strokeStyle = "#5a4235"; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(2100,430); ctx.lineTo(2600,430); ctx.stroke();
    }
}
