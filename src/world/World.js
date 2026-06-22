import { configuracaoMapas } from '../constants.js';

export const MEU_JARDIM_WIDTH = 2400;
export const MEU_JARDIM_HEIGHT = 1800;
export const MUNDO_ABERTO_WIDTH = 5000;
export const MUNDO_ABERTO_HEIGHT = 3000;

export class World {
    constructor() {
        // Grass tufts (can place anywhere since sky is removed)
        this.grassTuftsMJ = this._makeTufts(150, MEU_JARDIM_WIDTH, 150, MEU_JARDIM_HEIGHT - 100);
        this.grassTuftsMA = this._makeTufts(450, MUNDO_ABERTO_WIDTH, 150, MUNDO_ABERTO_HEIGHT - 100);

        // Trees and Bushes for Meu Jardim (Patio)
        this.treesMJ = [];
        // Top windbreak for Meu Jardim
        for (let tx = 80; tx < MEU_JARDIM_WIDTH; tx += 140) {
            this.treesMJ.push({ x: tx, y: 200, s: 0.8 });
        }
        // Bottom windbreak for Meu Jardim
        for (let tx = 80; tx < MEU_JARDIM_WIDTH; tx += 180) {
            this.treesMJ.push({ x: tx, y: MEU_JARDIM_HEIGHT - 120, s: 0.8 });
        }
        // Orchard in Meu Jardim (top left)
        [[300, 600], [450, 600], [600, 600],
         [300, 800], [450, 800], [600, 800]].forEach(([tx, ty]) => {
            this.treesMJ.push({ x: tx, y: ty, s: 0.75 });
        });

        this.bushesMJ = [
            { x: 150, y: 1000, s: 0.85 }, { x: 230, y: 980, s: 0.78 },
            { x: 1900, y: 1000, s: 0.88 }, { x: 2000, y: 1040, s: 0.75 },
            // Hedges around plaza center (1200, 1000)
            { x: 1000, y: 850, s: 0.8 }, { x: 1080, y: 850, s: 0.8 },
            { x: 1320, y: 850, s: 0.8 }, { x: 1400, y: 850, s: 0.8 },
            { x: 1000, y: 1150, s: 0.8 }, { x: 1080, y: 1150, s: 0.8 },
            { x: 1320, y: 1150, s: 0.8 }, { x: 1400, y: 1150, s: 0.8 }
        ];

        // Bushes for mundo_aberto - organized as hedges flanking the main path (y = 1500)
        this.bushesMA = [];
        for (let i = 0; i < 52; i++) {
            const bx = 100 + i * 92;
            if (bx > 2100 && bx < 3300) continue; // Skip lake/bridge
            
            // Leave gaps for branches
            const isGap = (Math.abs(bx - 600) < 60 || Math.abs(bx - 1400) < 60 || Math.abs(bx - 3800) < 60 || Math.abs(bx - 4500) < 60);
            if (!isGap) {
                this.bushesMA.push({ x: bx, y: 1440, s: 0.7 });
                this.bushesMA.push({ x: bx + 18, y: 1560, s: 0.7 });
            }
        }

        // Mushrooms - organized in a magical fairy grove/ring around the Cogumelo NPC (1400, 900)
        this.mushrooms = [];
        const mCenter = { x: 1400, y: 900 };
        for (let i = 0; i < 36; i++) {
            const angle = (i / 18) * Math.PI * 2;
            const radius = 90 + (i % 2 === 0 ? 30 : -20) + Math.random() * 15;
            const mx = mCenter.x + Math.cos(angle) * radius;
            const my = mCenter.y + Math.sin(angle) * radius;
            this.mushrooms.push({
                x: mx,
                y: my,
                r: 16 + (i % 3) * 8,
                cor: ['#c44b2e','#e76f51','#8338ec','#ff6b9d','#f2cc8f'][i % 5],
                phase: Math.random() * Math.PI * 2
            });
        }

        // Bioluminescent plants (zone 6, x 3500-4100, y 500-1100) - organized in neat clusters
        this.glowPlants = [];
        for (let i = 0; i < 32; i++) {
            const clusterX = 3500 + Math.floor(i / 8) * 160 + Math.sin(i) * 15;
            const clusterY = 600 + (i % 8) * 60 + Math.cos(i) * 15;
            this.glowPlants.push({
                x: clusterX,
                y: clusterY,
                r: 10 + (i % 3) * 4,
                hue: i % 2 === 0 ? 'cyan' : 'purple',
                phase: Math.random() * Math.PI * 2
            });
        }

        // AC Trees placed in mundo_aberto - organized in neat orchards and border windbreaks
        this.treesMA = [];
        // 1. Top border trees (forest background)
        for (let tx = 80; tx < MUNDO_ABERTO_WIDTH; tx += 120) {
            if (tx > 2100 && tx < 3300) continue; // Skip lake
            this.treesMA.push({ x: tx, y: 200, s: 0.75 });
        }
        // 2. Bottom border trees (foreground frame)
        for (let tx = 80; tx < MUNDO_ABERTO_WIDTH; tx += 160) {
            if (tx > 2100 && tx < 3300) continue;
            this.treesMA.push({ x: tx, y: MUNDO_ABERTO_HEIGHT - 120, s: 0.75 });
        }
        // 3. Orchard in Meadow Zone (Zone 1)
        [[120, 800], [240, 800], [360, 800],
         [120, 950], [240, 950], [360, 950]].forEach(([tx, ty]) => {
            this.treesMA.push({ x: tx, y: ty, s: 0.75 });
        });
        // 4. Orchard in Bio-forest Zone (Zone 6)
        [[3700, 700], [3840, 700], [3980, 700],
         [3700, 820], [3840, 820], [3980, 820]].forEach(([tx, ty]) => {
            this.treesMA.push({ x: tx, y: ty, s: 0.75 });
        });

        // Clouds (moving ground shadows)
        this.clouds = [
            {x:100, y:400, s:0.8}, {x:500, y:600, s:1.1}, {x:1100, y:300, s:0.9},
            {x:1600, y:800, s:1.0}, {x:2100, y:500, s:0.75}
        ];
        this.cloudsMundo = [];
        for (let i = 0; i < 30; i++) {
            this.cloudsMundo.push({
                x: Math.random() * (MUNDO_ABERTO_WIDTH + 600),
                y: 200 + Math.random() * (MUNDO_ABERTO_HEIGHT - 400),
                s: 0.8 + Math.random() * 0.8
            });
        }

        // MJ towers (far background elements - drawn projected in the distance)
        this.mjTowers = [
            {x:300, y:120, s:0.52}, {x:1200, y:100, s:0.80}, {x:2100, y:120, s:0.50}
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

    drawPathTile(ctx, x, y, size = 18) {
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size * 1.5, y);
        ctx.lineTo(x, y + size/2);
        ctx.lineTo(x - size * 1.5, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
            ctx.fillStyle=grd; ctx.strokeStyle="rgba(72,152,136,0.72)"; ctx.lineWidth=1.5*s;
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

    draw(ctx, mapaAtual, canvasWidth, canvasHeight, camera, player, projetarFn) {
        if (mapaAtual === "meu_jardim") {
            this.drawMeuJardim(ctx, canvasWidth, canvasHeight, player, projetarFn);
        } else if (mapaAtual === "mundo_aberto") {
            this.drawMundoAberto(ctx, canvasWidth, canvasHeight, camera, player, projetarFn);
        }
    }

    // ─── GET SCENE ELEMENTS FOR Y-SORTING ─────────────────────────────────────
    obterElementosCenario(mapaAtual) {
        const list = [];
        if (mapaAtual === "meu_jardim") {
            this.treesMJ.forEach(t => list.push({ tipo: "tree", x: t.x, y: t.y, s: t.s }));
            this.bushesMJ.forEach(b => list.push({ tipo: "bush", x: b.x, y: b.y, s: b.s }));
        } else if (mapaAtual === "mundo_aberto") {
            this.treesMA.forEach(t => list.push({ tipo: "tree", x: t.x, y: t.y, s: t.s }));
            this.bushesMA.forEach(b => list.push({ tipo: "bush", x: b.x, y: b.y, s: b.s }));
            this.mushrooms.forEach(m => list.push({ tipo: "mushroom", x: m.x, y: m.y, r: m.r, cor: m.cor, phase: m.phase }));
            
            // Market elements
            [{x:3600, y:1320, c:"#e76f51"}, {x:3720, y:1320, c:"#f2cc8f"}, {x:3840, y:1320, c:"#2a9d8f"}, {x:3960, y:1320, c:"#e07a5f"}].forEach(tent => {
                list.push({ tipo: "marketTent", x: tent.x, y: tent.y, cor: tent.c });
            });
            [[3580,1400],[3600,1380],[3700,1400],[3720,1380]].forEach(([bx,by]) => {
                list.push({ tipo: "barrel", x: bx, y: by });
            });
            list.push({ tipo: "campfire", x: 3820, y: 1560 });

            // Garden patch
            list.push({ tipo: "gardenPatch", x: 600, y: 1000 });

            // Observatory elements
            list.push({ tipo: "observatoryDome", x: 4500, y: 800 });
            list.push({ tipo: "telescope", x: 4500, y: 800 });
            [[4300, 950],[4380, 920],[4460, 890]].forEach(([px,py]) => {
                list.push({ tipo: "solarPanel", x: px, y: py });
            });
        }
        return list;
    }

    // ─── DRAW PROJECTED LAKE & RIVERS ─────────────────────────────────────────
    drawProjectedLake(ctx, cx, cy, rx, ry, projetarFn) {
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const wx = cx + Math.cos(angle) * rx;
            const wy = cy + Math.sin(angle) * ry;
            const proj = projetarFn(wx, wy);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        }
        ctx.closePath();
    }

    drawProjectedRiver(ctx, points, width, projetarFn) {
        // Draw left side then right side
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const proj = projetarFn(p.x - width/2, p.y);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        }
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            const proj = projetarFn(p.x + width/2, p.y);
            ctx.lineTo(proj.x, proj.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // ─── STRUCTURE DRAWING HELPERS (Called Y-sorted in Game.js) ───────────────
    drawMarketTent(ctx, x, y, cor) {
        ctx.fillStyle = cor; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y - 60);
        ctx.lineTo(x + 52, y - 10);
        ctx.lineTo(x, y + 40);
        ctx.lineTo(x - 52, y - 10);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = "#5a4235"; ctx.beginPath(); ctx.arc(x, y - 10, 5, 0, Math.PI*2); ctx.fill();
    }

    drawBarrel(ctx, x, y) {
        ctx.fillStyle = "#8d705c"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(x, y, 12, 16, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        // Barrel lid/lines
        ctx.strokeStyle = "#3d2f26"; ctx.beginPath(); ctx.ellipse(x, y - 10, 11, 4, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.stroke();
    }

    drawCampfire(ctx, x, y) {
        const cft = Date.now()/100;
        ctx.fillStyle = "#5a4235"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(x, y, 22, 12, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = `rgba(231,111,81,${0.72+Math.sin(cft)*0.2})`;
        ctx.beginPath(); ctx.ellipse(x, y - 5, 14, 8, 0, 0, Math.PI*2); ctx.fill();
    }

    drawGardenPatch(ctx, gx, gy) {
        // 3D wood boards
        ctx.fillStyle = "#8d705c"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(gx - 60, gy); ctx.lineTo(gx, gy + 25); ctx.lineTo(gx, gy + 35); ctx.lineTo(gx - 60, gy + 10);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(gx, gy + 25); ctx.lineTo(gx + 60, gy); ctx.lineTo(gx + 60, gy + 10); ctx.lineTo(gx, gy + 35);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Top soil
        ctx.fillStyle = "#6e503f";
        ctx.beginPath();
        ctx.moveTo(gx, gy - 25); ctx.lineTo(gx + 60, gy); ctx.lineTo(gx, gy + 25); ctx.lineTo(gx - 60, gy);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Tomatoes
        [[gx - 25, gy - 5], [gx - 5, gy - 12], [gx + 15, gy + 5], [gx - 5, gy + 12]].forEach(([tx, ty]) => {
            ctx.fillStyle = "rgba(0,0,0,0.18)";
            ctx.beginPath(); ctx.ellipse(tx, ty + 3, 5, 2.5, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#e76f51";
            ctx.beginPath(); ctx.arc(tx, ty, 5.5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#2a9d8f";
            ctx.beginPath(); ctx.arc(tx, ty - 4, 2, 0, Math.PI*2); ctx.fill();
        });

        // Watering can icon
        ctx.fillStyle="#4a90d9"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.roundRect(gx + 65, gy + 5, 24, 16, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx + 89, gy + 8); ctx.lineTo(gx + 98, gy + 5); ctx.lineTo(gx + 95, gy + 10); ctx.stroke();
    }

    drawObservatoryDome(ctx, x, y) {
        ctx.fillStyle = "#c8d8d0"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(x, y - 35, 58, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 93); ctx.lineTo(x, y + 23); ctx.stroke();
    }

    drawTelescope(ctx, x, y) {
        ctx.fillStyle = "#8d9d98"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        ctx.save(); ctx.translate(x, y - 44); ctx.rotate(Math.PI*0.28);
        ctx.beginPath(); ctx.roundRect(-6, -32, 12, 64, 4); ctx.fill(); ctx.stroke();
        ctx.restore();
    }

    drawSolarPanel(ctx, px, py) {
        // Support leg
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px, py + 12); ctx.lineTo(px, py + 26); ctx.stroke();
        ctx.fillStyle = "#2b1f1d"; ctx.beginPath(); ctx.ellipse(px, py + 26, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Panel face
        ctx.fillStyle = "#1e6051"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py - 10); ctx.lineTo(px + 22, py); ctx.lineTo(px, py + 10); ctx.lineTo(px - 22, py);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Panel lines
        ctx.strokeStyle = "#48bcae"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 11, py - 5); ctx.lineTo(px + 11, py + 5);
        ctx.moveTo(px - 11, py + 5); ctx.lineTo(px + 11, py - 5);
        ctx.stroke();
    }

    // ─── DRAW MEU JARDIM (Patio Solarpunk Background Layers) ───────────────────
    drawMeuJardim(ctx, W, H, player, projetarFn) {
        // === TERRA COMPLETA (Estilo Don't Starve Background) ===
        const gnd = ctx.createLinearGradient(0, 0, 0, H);
        gnd.addColorStop(0, "#aed890");
        gnd.addColorStop(0.3, "#9ac87c");
        gnd.addColorStop(1, "#80b062");
        ctx.fillStyle = gnd;
        ctx.fillRect(0, 0, W, H);

        // === SOMBRAS DE NUVENS NO CHÃO (Projetadas) ===
        const tShadow = Date.now() / 1500;
        this.clouds.forEach(c => {
            const wx = (c.x + tShadow * 30) % (MEU_JARDIM_WIDTH + 400) - 200;
            const wy = c.y;
            const proj = projetarFn(wx, wy);
            ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
            ctx.beginPath();
            ctx.ellipse(proj.x, proj.y, 180 * c.s * proj.scale, 70 * c.s * proj.scale * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // === TOWERS IN BACKGROUND (Far, so drawn flat behind all else but projected) ===
        this.mjTowers.forEach(t => {
            const proj = projetarFn(t.x, t.y);
            ctx.save();
            ctx.translate(proj.x, proj.y);
            ctx.scale(proj.scale * t.s, proj.scale * t.s);
            ctx.translate(-t.x, -t.y);
            this.drawSolarpunkTower(ctx, t.x, t.y, 5, 1.0);
            ctx.restore();
        });

        // === PERSPECTIVE GRID (Converging) ===
        ctx.strokeStyle = "rgba(0,0,0,0.038)"; ctx.lineWidth = 1;
        // Horizontal lines in world space
        for (let wy = 100; wy < MEU_JARDIM_HEIGHT; wy += 100) {
            const p1 = projetarFn(0, wy);
            const p2 = projetarFn(MEU_JARDIM_WIDTH, wy);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
        // Vertical lines in world space
        ctx.strokeStyle = "rgba(0,0,0,0.022)";
        for (let wx = 0; wx <= MEU_JARDIM_WIDTH; wx += 100) {
            const p1 = projetarFn(wx, 0);
            const p2 = projetarFn(wx, MEU_JARDIM_HEIGHT);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }

        // === PLAZA PERSPECTIVE TILES ===
        ctx.strokeStyle = "rgba(170,148,120,0.16)"; ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(232,215,192,0.15)";
        // Draw a projected cobblestone plaza area in the center (1200, 1000)
        ctx.beginPath();
        const corners = [[800, 750], [1600, 750], [1600, 1250], [800, 1250]];
        corners.forEach(([cx, cy], i) => {
            const proj = projetarFn(cx, cy);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // === GRASS TUFTS (Flat decoration) ===
        this.grassTuftsMJ.forEach(t => {
            const proj = projetarFn(t.x, t.y);
            this.drawGrassTuft(ctx, proj.x, proj.y, proj.scale * t.scale);
        });

        // Flower accents (drawn flat on ground)
        [[1700,900],[1020,1100],[700,600],[1450,1150],[1175,700]].forEach(([fx,fy]) => {
            const proj = projetarFn(fx, fy);
            const fs = 4 * proj.scale;
            ctx.fillStyle = "#e07a5f"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(proj.x, proj.y, fs, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#f2cc8f"; ctx.beginPath(); ctx.arc(proj.x, proj.y, fs*0.4, 0, Math.PI*2); ctx.fill();
        });

        // === PROJECTED PATHS ===
        ctx.fillStyle = "#eedfd2"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
        // Right path toward exit
        for (let i = 0; i < 15; i++) {
            const t = i / 14;
            const px = 1200 + t * 1200;
            const py = 1000 + t * 200;
            this.drawPathTile(ctx, px, py, 18, projetarFn);
        }
        // Left path toward terminal
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const px = 1200 - t * 300;
            const py = 1000;
            this.drawPathTile(ctx, px, py, 16, projetarFn);
        }

        // === RIGHT EXIT INDICATOR (Projected box) ===
        ctx.fillStyle = "rgba(42,157,143,0.14)"; ctx.strokeStyle = "#2a9d8f"; ctx.lineWidth = 2.5;
        ctx.setLineDash([6,4]);
        ctx.beginPath();
        const exitBox = [[MEU_JARDIM_WIDTH - 60, 600], [MEU_JARDIM_WIDTH, 600], [MEU_JARDIM_WIDTH, 1400], [MEU_JARDIM_WIDTH - 60, 1400]];
        exitBox.forEach(([ex, ey], i) => {
            const proj = projetarFn(ex, ey);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);

        const textProj = projetarFn(MEU_JARDIM_WIDTH - 40, 1000);
        ctx.fillStyle = "#2a9d8f"; ctx.font = "bold " + Math.round(11 * textProj.scale) + "px sans-serif"; ctx.textAlign = "center";
        ctx.save(); ctx.translate(textProj.x, textProj.y); ctx.rotate(Math.PI/2);
        ctx.fillText("MUNDO ABERTO →", 0, 0); ctx.restore();

        // UI Map title (Static/Fixed on screen)
        ctx.fillStyle = "#3d2f26"; ctx.font = "bold 16px 'Outfit', sans-serif"; ctx.textAlign = "left";
        ctx.fillText("🌿 Jabuli World: Pátio Solarpunk", 40, 45);
    }

    // ─── DRAW MUNDO ABERTO (Mundo Aberto Background Layers) ───────────────────
    drawMundoAberto(ctx, W, H, camera, player, projetarFn) {
        const camX = camera ? camera.x : 0;
        const camY = camera ? camera.y : 0;
        const visL = camX - 100;
        const visR = camX + W + 100;
        const visT = camY - 100;
        const visB = camY + H + 100;

        // === BASE GROUND COMPLETA ===
        ctx.fillStyle = "#98c478";
        ctx.fillRect(0, 0, W, H);

        // Nuvens como sombras no chão (Projetadas)
        const tShadow = Date.now() / 1500;
        this.cloudsMundo.forEach(c => {
            const wx = (c.x + tShadow * 40) % (MUNDO_ABERTO_WIDTH + 600) - 300;
            const wy = c.y;
            const proj = projetarFn(wx, wy);
            if (proj.x > -200 && proj.x < W + 200 && proj.y > -200 && proj.y < H + 200) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
                ctx.beginPath();
                ctx.ellipse(proj.x, proj.y, 220 * c.s * proj.scale, 90 * c.s * proj.scale * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Biome Tints (Projected polygons)
        ctx.lineWidth = 1;
        const drawBiomeTint = (xStart, xEnd, col) => {
            ctx.fillStyle = col;
            ctx.beginPath();
            const pts = [[xStart, 0], [xEnd, 0], [xEnd, MUNDO_ABERTO_HEIGHT], [xStart, MUNDO_ABERTO_HEIGHT]];
            pts.forEach(([bx, by], i) => {
                const proj = projetarFn(bx, by);
                if (i === 0) ctx.moveTo(proj.x, proj.y);
                else ctx.lineTo(proj.x, proj.y);
            });
            ctx.closePath(); ctx.fill();
        };

        drawBiomeTint(700, 1800, "rgba(100,60,148,0.08)");  // Mushroom
        drawBiomeTint(1800, 2200, "rgba(80,160,210,0.05)");  // Waterfall / River approach
        drawBiomeTint(3200, 4200, "rgba(20,10,55,0.11)");    // Bio-forest
        drawBiomeTint(4200, 5000, "rgba(60,30,0,0.03)");     // Observatory

        // === PERSPECTIVE GRID (Converging) ===
        ctx.strokeStyle = "rgba(0,0,0,0.03)"; ctx.lineWidth = 1;
        // Horizontal lines
        for (let wy = 100; wy < MUNDO_ABERTO_HEIGHT; wy += 150) {
            const p1 = projetarFn(Math.max(0, camX - 300), wy);
            const p2 = projetarFn(Math.min(MUNDO_ABERTO_WIDTH, camX + W + 300), wy);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
        // Vertical lines
        ctx.strokeStyle = "rgba(0,0,0,0.016)";
        const startX = Math.floor(Math.max(0, camX - 300) / 150) * 150;
        const endX = Math.min(MUNDO_ABERTO_WIDTH, camX + W + 300);
        for (let wx = startX; wx <= endX; wx += 150) {
            const p1 = projetarFn(wx, 0);
            const p2 = projetarFn(wx, MUNDO_ABERTO_HEIGHT);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }

        // ── ZONE 1: PRADO DE ENTRADA (Wildflowers flat on ground) ──────────
        [[100, 1200], [120, 1230], [140, 1210],
         [440, 1700], [460, 1680], [480, 1720]].forEach(([fx,fy]) => {
            const proj = projetarFn(fx, fy);
            if (proj.x > -20 && proj.x < W + 20 && proj.y > -20 && proj.y < H + 20) {
                const fs = 5 * proj.scale;
                ctx.fillStyle = "#e07a5f"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(proj.x, proj.y, fs, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = "#f2cc8f"; ctx.beginPath(); ctx.arc(proj.x, proj.y, fs*0.4, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#2a9d8f"; ctx.beginPath(); ctx.moveTo(proj.x, proj.y + fs); ctx.lineTo(proj.x - 2*proj.scale, proj.y + 12*proj.scale); ctx.stroke();
            }
        });

        // ── ZONE 2: COGUMELOS (Fairy ring ground circles and glow) ─────────
        const ring1 = {cx:1400, cy:900, r:92};
        ctx.strokeStyle = "rgba(100,50,158,0.12)"; ctx.lineWidth = 24;
        this.drawProjectedLake(ctx, ring1.cx, ring1.cy, ring1.r, ring1.r * 0.7, projetarFn);
        ctx.stroke();

        // Magical ground glow
        const glt = Date.now()/950;
        const glowAlpha = 0.055+Math.sin(glt)*0.028;
        ctx.fillStyle = `rgba(140,70,200,${glowAlpha})`;
        this.drawProjectedLake(ctx, 1400, 900, 380, 260, projetarFn);
        ctx.fill();

        // Floating spore particles (flat on ground, projected)
        const st = Date.now()/480;
        for (let i=0; i<12; i++) {
            const sx = 1100 + i*60 + Math.sin(st + i*1.4)*28;
            const sy = 700 + Math.cos(st*0.75 + i)*45;
            const proj = projetarFn(sx, sy);
            if (proj.x > 0 && proj.x < W && proj.y > 0 && proj.y < H) {
                ctx.fillStyle = `rgba(190,130,230,${0.45+Math.sin(st+i)*0.22})`;
                ctx.beginPath(); ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI*2); ctx.fill();
            }
        }

        // ── ZONE 3: CACHOEIRA & RIO ──────────────────────────────────────────
        // Riverbed
        ctx.fillStyle = "#888878"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        this.drawProjectedLake(ctx, 2700, 1500, 520, 340, projetarFn);
        ctx.stroke(); // Draw shoreline boundary

        // Waterfall (Behind lake, so top boundary)
        // Draw river leading from top to lake
        ctx.fillStyle = "#68c8dc"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2;
        const riverPoints = [];
        for (let ry = 200; ry <= 1200; ry += 100) {
            riverPoints.push({ x: 2700 + Math.sin(ry/200)*30, y: ry });
        }
        this.drawProjectedRiver(ctx, riverPoints, 120, projetarFn);

        // ── ZONE 4: GRANDE LAGO (Projected lake water body) ──────────────────
        const lakeGrd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 400); // we approximate or use local center
        ctx.fillStyle = "#4ab8d8";
        this.drawProjectedLake(ctx, 2700, 1500, 500, 320, projetarFn);
        ctx.fill(); ctx.stroke();

        // Water ripples
        const lt = Date.now()/620;
        [0.35, 0.58, 0.80].forEach((f, i) => {
            const a = 0.18 - i*0.04;
            ctx.strokeStyle = `rgba(255,255,255,${a+Math.sin(lt+i)*0.04})`;
            ctx.lineWidth = 2 * (1 + i * 0.5);
            this.drawProjectedLake(ctx, 2700, 1500, 500 * f, 320 * f, projetarFn);
            ctx.stroke();
        });

        // Lily pads (projected)
        [[2545,1398,13],[2615,1588,16],[2890,1380,12],[2958,1595,15],[2910,1418,11],[2468,1462,14]].forEach(([lx,ly,lr]) => {
            const proj = projetarFn(lx, ly);
            const lrs = lr * proj.scale;
            ctx.fillStyle="#2a9d8f"; ctx.strokeStyle="#1b6a60"; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.arc(proj.x, proj.y, lrs, 0.15, Math.PI*2-0.15); ctx.lineTo(proj.x, proj.y); ctx.closePath(); ctx.fill(); ctx.stroke();
        });

        // ── ZONE 5: MERCADO SOLAR (Plaza background tiles) ─────────────────
        ctx.fillStyle = "rgba(218,200,172,0.22)";
        ctx.beginPath();
        const mCorners = [[3550, 1250], [4050, 1250], [4050, 1750], [3550, 1750]];
        mCorners.forEach(([cx, cy], i) => {
            const proj = projetarFn(cx, cy);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill();

        // Plaza stone gridlines
        ctx.strokeStyle = "rgba(175,150,120,0.18)"; ctx.lineWidth = 1.5;
        for (let d = -200; d <= 200; d += 40) {
            const p1 = projetarFn(3800 + d, 1500 - 250);
            const p2 = projetarFn(3800 + d, 1500 + 250);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

            const p3 = projetarFn(3800 - 250, 1500 + d);
            const p4 = projetarFn(3800 + 250, 1500 + d);
            ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
        }

        // ── ZONE 6: FLORESTA BIOLUMINESCENTE (Glowing ground plants) ───────
        const glt2 = Date.now()/880;
        this.glowPlants.forEach(gp => {
            const proj = projetarFn(gp.x, gp.y);
            if (proj.x > -50 && proj.x < W + 50 && proj.y > -50 && proj.y < H + 50) {
                const a = 0.38+Math.sin(glt2+gp.phase)*0.28;
                const col = gp.hue==='cyan' ? `rgba(0,210,175,${a})` : `rgba(175,80,220,${a})`;
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.ellipse(proj.x, proj.y, gp.r * proj.scale, gp.r * 0.65 * proj.scale, 0, 0, Math.PI*2); ctx.fill();
            }
        });

        // ── ZONE 7: PLATÔ DO OBSERVATÓRIO ────────────────────────────────────
        ctx.fillStyle="#85a868"; ctx.strokeStyle="#3d2f26"; ctx.lineWidth=2.5;
        ctx.beginPath();
        const platCorners = [[4200, 600], [5000, 600], [5000, 1300], [4200, 1300]];
        platCorners.forEach(([cx, cy], i) => {
            const proj = projetarFn(cx, cy);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Stars over observatory
        const st2 = Date.now()/330;
        [[4460,352],[4575,338],[4678,328],[4820,342],[4945,332],[4500,396],[4638,382]].forEach(([sx,sy],i) => {
            const proj = projetarFn(sx, sy);
            const sa = 0.38+Math.sin(st2+i*1.35)*0.36;
            ctx.fillStyle = `rgba(255,240,180,${sa})`;
            ctx.beginPath(); ctx.arc(proj.x, proj.y, 2.8 * proj.scale, 0, Math.PI*2); ctx.fill();
        });

        // === BRIDGE (Wooden Planks platform) ===
        // Draw bridge base as polygon
        ctx.fillStyle = "#baa68a"; ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 3;
        ctx.beginPath();
        const bridgeCorners = [[2150, 1460], [3250, 1460], [3250, 1540], [2150, 1540]];
        bridgeCorners.forEach(([bx, by], i) => {
            const proj = projetarFn(bx, by);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Individual planks drawn as lines across the bridge platform
        ctx.strokeStyle = "#3d2f26"; ctx.lineWidth = 2.5;
        for (let bx = 2170; bx <= 3230; bx += 20) {
            const p1 = projetarFn(bx, 1460);
            const p2 = projetarFn(bx, 1540);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }

        // === GRASS TUFTS (Flat ground assets) ===
        this.grassTuftsMA.forEach(t => {
            const proj = projetarFn(t.x, t.y);
            if (proj.x > -20 && proj.x < W + 20 && proj.y > -20 && proj.y < H + 20) {
                this.drawGrassTuft(ctx, proj.x, proj.y, proj.scale * t.scale);
            }
        });

        // === MAIN ORGANIZED COBBLESTONE PATHS ===
        ctx.fillStyle = "#eedfd2"; ctx.strokeStyle = "#baa68a"; ctx.lineWidth = 1.5;
        // Horizontal road
        for (let px = 0; px < MUNDO_ABERTO_WIDTH; px += 45) {
            if (px > 2150 && px < 3250) continue; // Skip lake / bridge span
            this.drawPathTile(ctx, px, 1500, 20, projetarFn);
        }

        // Branch to Garden
        for (let py = 1040; py < 1470; py += 30) {
            this.drawPathTile(ctx, 600, py, 14, projetarFn);
        }
        
        // Branch to Mushrooms
        for (let py = 950; py < 1470; py += 30) {
            this.drawPathTile(ctx, 1400, py, 14, projetarFn);
        }
        
        // Branch to Market
        for (let py = 1350; py < 1470; py += 30) {
            this.drawPathTile(ctx, 3800, py, 14, projetarFn);
        }
 
        // Branch to Observatory
        for (let py = 1000; py < 1470; py += 30) {
            this.drawPathTile(ctx, 4500, py, 14, projetarFn);
        }

        // === LEFT EXIT INDICATOR (Projected box) ===
        ctx.fillStyle="rgba(42,157,143,0.14)"; ctx.strokeStyle="#2a9d8f"; ctx.lineWidth=2.5;
        ctx.setLineDash([6,4]);
        ctx.beginPath();
        const leftExit = [[0, 1100], [50, 1100], [50, 1900], [0, 1900]];
        leftExit.forEach(([ex, ey], i) => {
            const proj = projetarFn(ex, ey);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);

        const textProj = projetarFn(25, 1500);
        ctx.fillStyle="#2a9d8f"; ctx.font="bold " + Math.round(11 * textProj.scale) + "px sans-serif"; ctx.textAlign="center";
        ctx.save(); ctx.translate(textProj.x, textProj.y); ctx.rotate(-Math.PI/2);
        ctx.fillText("← PÁTIO",0,0); ctx.restore();

        // Static UI Title
        ctx.fillStyle="#3d2f26"; ctx.font="bold 16px 'Outfit', sans-serif"; ctx.textAlign="left";
        ctx.fillText("🌍 Jabuli World: Mundo Aberto", 40, 45);
    }

    // Bridge front rail (Drawn relative to projected world bridge coordinates)
    drawBridgeFront(ctx, projetarFn) {
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.beginPath();
        const shadowCorners = [[2150, 1538], [3250, 1538], [3250, 1546], [2150, 1546]];
        shadowCorners.forEach(([bx, by], i) => {
            const proj = projetarFn(bx, by);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath(); ctx.fill();

        ctx.strokeStyle = "#5a4235"; ctx.lineWidth = 4;
        for (let bx = 2150; bx <= 3250; bx += 25) {
            const pBase = projetarFn(bx, 1540);
            const pTop = projetarFn(bx, 1540); // we will offset screen space or project with virtual Y
            // draw vertical post
            ctx.beginPath();
            ctx.moveTo(pBase.x, pBase.y);
            ctx.lineTo(pBase.x, pBase.y - 12 * pBase.scale);
            ctx.stroke();
        }
        // Top rail connecting posts
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
            const bx = 2150 + (i / steps) * 1100;
            const p = projetarFn(bx, 1540);
            if (i === 0) ctx.moveTo(p.x, p.y - 12 * p.scale);
            else ctx.lineTo(p.x, p.y - 12 * p.scale);
        }
        ctx.stroke();
    }
}
