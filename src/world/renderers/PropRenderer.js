/**
 * @file PropRenderer.js
 * @description Funções de desenho de props (elementos de cenário menores):
 * cogumelos, grama, arbustos, nuvens, turbinas eólicas, painéis solares,
 * casa de cogumelo gigante, domo do observatório, telescópio.
 */

// ─── Arbusto ──────────────────────────────────────────────────────────────────
export function drawBush(ctx, x, y, s = 1) {
    ctx.fillStyle = '#2a9d8f'; ctx.strokeStyle = '#1b6a60'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, y, 18 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#42c4b0';
    ctx.beginPath(); ctx.ellipse(x - 5 * s, y - 3 * s, 9 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e76f51'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1;
    [[7, 3], [-8, 5], [3, -6]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
    });
}

// ─── Tufo de Grama ────────────────────────────────────────────────────────────
export function drawGrassTuft(ctx, x, y, scale) {
    ctx.strokeStyle = '#8ba65e'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 3 * scale, y - 7 * scale, x - 5 * scale, y - 11 * scale);
    ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - 11 * scale, x, y - 14 * scale);
    ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4 * scale, y - 5 * scale, x + 6 * scale, y - 9 * scale);
    ctx.stroke();
}

// ─── Nuvem ────────────────────────────────────────────────────────────────────
export function drawCloud(ctx, cx, cy, s = 1) {
    ctx.fillStyle = 'rgba(255,255,255,0.68)';
    ctx.beginPath();
    ctx.arc(cx, cy, 28 * s, 0, Math.PI * 2);
    ctx.arc(cx + 25 * s, cy - 9 * s, 19 * s, 0, Math.PI * 2);
    ctx.arc(cx + 50 * s, cy, 24 * s, 0, Math.PI * 2);
    ctx.arc(cx + 25 * s, cy + 9 * s, 17 * s, 0, Math.PI * 2);
    ctx.fill();
}

// ─── Cogumelo (top-down genérico) ─────────────────────────────────────────────
export function drawMushroomTopDown(ctx, x, y, r, cor, glowAlpha = 0) {
    if (glowAlpha > 0) {
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
        grd.addColorStop(0, `${cor}45`); grd.addColorStop(1, `${cor}00`);
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 1.7, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(x + 4, y + 7, r * 0.82, r * 0.48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = cor; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = Math.max(1.2, r * 0.055);
    ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.76, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = r * 0.10;
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.82, r * 0.62, 0, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    [[0, -r * 0.38], [-r * 0.38, -r * 0.18], [r * 0.38, -r * 0.18], [0, r * 0.21], [-r * 0.18, r * 0.01]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(x + dx, y + dy, r * 0.11, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#f4f1eb'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.6, r * 0.22, r * 0.12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}

// ─── Cogumelo Lanterna (Liberdade) ────────────────────────────────────────────
export function drawLanternMushroom(ctx, x, y, r, cor, glowAlpha = 0) {
    if (glowAlpha > 0) {
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
        grd.addColorStop(0, 'rgba(230,57,70,0.45)'); grd.addColorStop(1, 'rgba(230,57,70,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 1.7, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(x + 4, y + 7, r * 0.82, r * 0.48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e63946'; ctx.strokeStyle = '#2b0000'; ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#1d3557'; ctx.lineWidth = Math.max(1, r * 0.05);
    for (let i = -2; i <= 2; i++) {
        const ry = y + i * (r * 0.3), rx = r * Math.sqrt(1 - (i * 0.3) ** 2) * 0.95;
        ctx.beginPath(); ctx.ellipse(x, ry, rx, r * 0.08, 0, 0, Math.PI); ctx.stroke();
    }
    ctx.fillStyle = '#1d3557';
    ctx.beginPath(); ctx.rect(x - r * 0.35, y - r * 1.25, r * 0.7, r * 0.15); ctx.rect(x - r * 0.35, y + r * 1.1, r * 0.7, r * 0.15); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#1d3557'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y - r * 1.25, r * 0.15, Math.PI, 0); ctx.stroke();
}

// ─── Casa de Cogumelo Gigante ─────────────────────────────────────────────────
export function drawGiantMushroomHouse(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(2.8, 2.8);
    ctx.fillStyle = '#f0e8d0'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-28, 10); ctx.lineTo(-22, -55); ctx.lineTo(22, -55); ctx.lineTo(28, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8d705c'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-10, -28, 20, 38, [8, 8, 0, 0]); ctx.fill(); ctx.stroke();
    [[-15, -42], [15, -42]].forEach(([wx, wy]) => {
        ctx.fillStyle = '#87ceeb'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(wx, wy, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = '#c44b2e'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -62, 62, 28, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    [[-28, -68], [0, -80], [28, -68], [-14, -58], [14, -58]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(dx, dy, 7, 0, Math.PI * 2); ctx.fill();
    });
    const st = Date.now() / 400;
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(200,200,200,${0.25 - i * 0.07})`;
        ctx.beginPath(); ctx.arc(18 + Math.sin(st + i) * 4, -72 - i * 14, 5 + i * 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
}

// ─── Domo do Observatório ──────────────────────────────────────────────────────
export function drawObservatoryDome(ctx, x, y) {
    ctx.fillStyle = '#c8d8d0'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y - 35, 62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 97); ctx.lineTo(x, y + 27); ctx.stroke();
    ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x - 8, y - 60); ctx.lineTo(x - 8, y - 20); ctx.stroke();
}

// ─── Telescópio ───────────────────────────────────────────────────────────────
export function drawTelescope(ctx, x, y) {
    ctx.fillStyle = '#8d9d98'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2.5;
    ctx.save(); ctx.translate(x, y - 44); ctx.rotate(Math.PI * 0.28);
    ctx.beginPath(); ctx.roundRect(-6, -32, 12, 64, 4); ctx.fill(); ctx.stroke();
    ctx.restore();
}

// ─── Painel Solar ─────────────────────────────────────────────────────────────
export function drawSolarPanel(ctx, px, py) {
    ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px, py + 12); ctx.lineTo(px, py + 26); ctx.stroke();
    ctx.fillStyle = '#2b1f1d'; ctx.beginPath(); ctx.ellipse(px, py + 26, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e6051'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py - 10); ctx.lineTo(px + 22, py); ctx.lineTo(px, py + 10); ctx.lineTo(px - 22, py); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#48bcae'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px - 11, py - 5); ctx.lineTo(px + 11, py + 5);
    ctx.moveTo(px - 11, py + 5); ctx.lineTo(px + 11, py - 5);
    ctx.stroke();
}

// ─── Turbina Eólica (grande) ─────────────────────────────────────────────────
export function drawWindTurbine(ctx, x, y, s = 1) {
    const t = Date.now() / 500;
    ctx.strokeStyle = '#a8c8d8'; ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 55 * s); ctx.stroke();
    ctx.save(); ctx.translate(x, y - 55 * s); ctx.rotate(t);
    ctx.strokeStyle = '#c8e4f0'; ctx.lineWidth = 3 * s;
    for (let i = 0; i < 3; i++) {
        ctx.rotate(Math.PI * 2 / 3);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(4 * s, -8 * s, 2 * s, -22 * s, 0, -30 * s); ctx.stroke();
    }
    ctx.fillStyle = '#aed8e8'; ctx.beginPath(); ctx.arc(0, 0, 5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// ─── Mini Turbina ─────────────────────────────────────────────────────────────
export function drawMiniTurbine(ctx, x, y, s = 1) {
    const t = Date.now() / 600;
    ctx.strokeStyle = '#a8c8d8'; ctx.lineWidth = 1.5 * s;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 18 * s); ctx.stroke();
    ctx.save(); ctx.translate(x, y - 18 * s); ctx.rotate(t);
    ctx.strokeStyle = '#c8e4f0';
    for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -10 * s); ctx.stroke(); }
    ctx.restore();
}

// ─── Torre Solarpunk ──────────────────────────────────────────────────────────
export function drawSolarpunkTower(ctx, cx, groundY, floors = 8, s = 1) {
    const fh = 44 * s;
    ctx.fillStyle = 'rgba(150,185,172,0.45)';
    ctx.beginPath(); ctx.rect(cx - 5 * s, groundY - floors * fh - 48 * s, 10 * s, floors * fh + 48 * s); ctx.fill();
    for (let i = 0; i < floors; i++) {
        const fy = groundY - i * fh;
        const twist = Math.sin(i * 0.55) * 20 * s;
        const fcx = cx + twist;
        const rx = (55 + Math.sin(i * 0.9) * 12) * s;
        const ry = 11 * s;
        const grd = ctx.createRadialGradient(fcx, fy - ry * 0.3, 0, fcx, fy, rx);
        grd.addColorStop(0, 'rgba(224,240,232,0.93)'); grd.addColorStop(0.65, 'rgba(172,208,192,0.89)'); grd.addColorStop(1, 'rgba(128,178,162,0.85)');
        ctx.fillStyle = grd; ctx.strokeStyle = 'rgba(72,152,136,0.72)'; ctx.lineWidth = 1.5 * s;
        ctx.beginPath(); ctx.ellipse(fcx, fy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (i % 2 === 0) {
            // Mini árvore no andar (inline para evitar dependência circular)
            const tx = fcx + rx * 0.55, ty = fy - ry;
            const ms = s * 0.30;
            ctx.fillStyle = '#2d9e8f'; ctx.strokeStyle = '#1b6a60'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.ellipse(tx, ty, 26 * ms, 20 * ms, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
    }
    const topY = groundY - floors * fh - 22 * s;
    ctx.strokeStyle = 'rgba(160,205,188,0.80)'; ctx.lineWidth = 2 * s;
    ctx.beginPath(); ctx.moveTo(cx, groundY - floors * fh); ctx.lineTo(cx, topY); ctx.stroke();
    ctx.fillStyle = 'rgba(72,220,196,0.88)';
    ctx.beginPath(); ctx.arc(cx, topY, 4 * s, 0, Math.PI * 2); ctx.fill();
}
