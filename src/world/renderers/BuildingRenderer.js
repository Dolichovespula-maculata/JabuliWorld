/**
 * @file BuildingRenderer.js
 * @description Funções de desenho de prédios, monumentos e landmarks urbanos.
 *
 * ─── COMO ADICIONAR UM NOVO LANDMARK ──────────────────────────────────────────
 *
 * 1. Crie uma função exportada aqui:
 *    export function drawMeuPredio(ctx, x, y) { ... }
 *    (use ctx.save() / ctx.restore() e ctx.translate(x,y) para facilitar)
 *
 * 2. Registre em Game.js > método desenhar() > switch de tipos:
 *    case 'meuPredio': drawMeuPredio(ctx, item.x, item.y); break;
 *
 * 3. Adicione a entrada em src/world/scenes/MundoAberto.js > LANDMARKS_MA:
 *    { tipo: 'meuPredio', x: 4000, y: 1000 }
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── MASP ─────────────────────────────────────────────────────────────────────
export function drawMASP(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(3.2, 3.2);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(0, 2, 55, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e63946'; ctx.strokeStyle = '#1d3557'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-48, -65, 8, 65); ctx.rect(40, -65, 8, 65); ctx.rect(-48, -69, 96, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(168,218,220,0.85)'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-40, -56, 80, 32); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#457b9d'; ctx.lineWidth = 1;
    for (let wx = -30; wx < 40; wx += 10) {
        ctx.beginPath(); ctx.moveTo(wx, -56); ctx.lineTo(wx, -24); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(40, -40); ctx.stroke();
    ctx.restore();
}

// ─── FIESP ────────────────────────────────────────────────────────────────────
export function drawFIESP(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(3.2, 3.2);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(0, 2, 45, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#264653'; ctx.strokeStyle = '#1d3557'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-35, 0); ctx.lineTo(-12, -75); ctx.lineTo(12, -75); ctx.lineTo(35, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#457b9d'; ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        const h = -i * 12; const width = 35 - i * 4;
        ctx.beginPath(); ctx.moveTo(-width, h); ctx.lineTo(width, h); ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-20, 0); ctx.lineTo(-8, -75);
    ctx.moveTo(0, 0); ctx.lineTo(0, -75);
    ctx.moveTo(20, 0); ctx.lineTo(8, -75);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    [[-8, -24], [8, -24], [-4, -42], [4, -42], [0, -56]].forEach(([px, py]) => {
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
}

// ─── Edifício Copan ───────────────────────────────────────────────────────────
export function drawCopan(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.1, 1.1);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(0, 4, 90, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e9ecef'; ctx.strokeStyle = '#343a40'; ctx.lineWidth = 3;
    const steps = 18, h = 280;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (i === 0) ctx.moveTo(-60 + Math.sin(t * Math.PI * 2) * 22, -t * h);
        else ctx.lineTo(-60 + Math.sin(t * Math.PI * 2) * 22, -t * h);
    }
    ctx.lineTo(40, -h);
    for (let i = steps; i >= 0; i--) {
        const t = i / steps;
        ctx.lineTo(40 + Math.sin(t * Math.PI * 2) * 22, -t * h);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 1.5;
    for (let i = 1; i < 36; i++) {
        const t = i / 36;
        ctx.beginPath();
        ctx.moveTo(-60 + Math.sin(t * Math.PI * 2) * 22 + 4, -t * h);
        ctx.lineTo(40 + Math.sin(t * Math.PI * 2) * 22 - 4, -t * h);
        ctx.stroke();
    }
    ctx.restore();
}

// ─── Edifício Itália ──────────────────────────────────────────────────────────
export function drawEdificioItalia(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(0, 3, 50, 15, 0, 0, Math.PI * 2); ctx.fill();
    const h = 300, w = 70;
    ctx.fillStyle = '#dee2e6'; ctx.strokeStyle = '#343a40'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(-w / 2, -h, w, h); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#495057';
    [-24, -12, 0, 12, 24].forEach(dx => {
        ctx.beginPath(); ctx.rect(dx - 3, -h + 30, 6, h - 45); ctx.fill();
    });
    ctx.fillStyle = 'rgba(173,232,244,0.85)'; ctx.strokeStyle = '#343a40'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, -h + 10, w * 0.6, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#495057'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -h - 2); ctx.lineTo(0, -h - 35); ctx.stroke();
    const glow = 0.4 + Math.sin(Date.now() / 180) * 0.4;
    ctx.fillStyle = `rgba(230,57,70,${glow})`;
    ctx.beginPath(); ctx.arc(0, -h - 35, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// ─── Catedral da Sé ───────────────────────────────────────────────────────────
export function drawCatedralDaSe(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.1, 1.1);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(0, 4, 95, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e2e2d9'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(-55, -90, 110, 90); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a9d8f'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -90, 36, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.rect(-2, -138, 4, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -141, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const drawTower = (tx) => {
        ctx.fillStyle = '#dcdcd0'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.rect(tx - 18, -180, 36, 180); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#3d2f26';
        ctx.beginPath();
        ctx.roundRect(tx - 4, -140, 8, 30, [4, 4, 0, 0]);
        ctx.roundRect(tx - 4, -90, 8, 30, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#5c677d'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(tx - 20, -180); ctx.lineTo(tx, -260); ctx.lineTo(tx + 20, -180); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tx, -260); ctx.lineTo(tx, -275); ctx.moveTo(tx - 5, -270); ctx.lineTo(tx + 5, -270); ctx.stroke();
    };
    drawTower(-65); drawTower(65);
    ctx.fillStyle = '#f1a7a6'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -50, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(Math.cos(angle) * 18, -50 + Math.sin(angle) * 18); ctx.stroke();
    }
    ctx.restore();
}

// ─── Auditório Ibirapuera ──────────────────────────────────────────────────────
export function drawAuditorioIbirapuera(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(4.5, 4.5);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(0, 2, 50, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f8f9fa'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-40, 5); ctx.lineTo(-30, -40); ctx.lineTo(30, -30); ctx.lineTo(40, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d90429'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-10, -10); ctx.bezierCurveTo(-15, -25, -5, -35, 5, -25); ctx.bezierCurveTo(2, -15, -5, -12, -10, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
}

// ─── Obelisco do Ibirapuera ────────────────────────────────────────────────────
export function drawObelisco(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.2, 1.2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(0, 2, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f8f9fa'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-7, -200); ctx.lineTo(0, -220); ctx.lineTo(7, -200); ctx.lineTo(12, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#495057';
    ctx.beginPath(); ctx.rect(-18, -10, 36, 10); ctx.fill(); ctx.stroke();
    ctx.restore();
}

// ─── Monumento às Bandeiras ────────────────────────────────────────────────────
export function drawMonumentoBandeiras(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(3.0, 3.0);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(0, 3, 85, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ced4da'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-75, 0); ctx.lineTo(-70, -35); ctx.quadraticCurveTo(-30, -75, 0, -60); ctx.quadraticCurveTo(40, -75, 70, -30); ctx.lineTo(75, 0); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#495057'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-60, -20); ctx.bezierCurveTo(-20, -45, 30, -45, 60, -20); ctx.stroke();
    ctx.fillStyle = '#adb5bd';
    [[-50, -42], [-35, -50], [-20, -56], [-5, -55], [10, -53], [25, -48], [45, -38]].forEach(([hx, hy]) => {
        ctx.beginPath(); ctx.arc(hx, hy, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.restore();
}

// ─── Torii Gate (Liberdade) ────────────────────────────────────────────────────
export function drawToriiGate(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(2.8, 2.8);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(0, 2, 35, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b70909'; ctx.strokeStyle = '#2b0000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-22, -60, 5, 60); ctx.rect(17, -60, 5, 60); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(-28, -48, 56, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b70909';
    ctx.beginPath(); ctx.moveTo(-32, -62); ctx.lineTo(32, -62); ctx.lineTo(30, -56); ctx.lineTo(-30, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111111';
    ctx.beginPath(); ctx.moveTo(-34, -65); ctx.lineTo(34, -65); ctx.lineTo(32, -61); ctx.lineTo(-32, -61); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.rect(-4, -56, 8, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
}

// ─── Templo Oriental (Liberdade) ──────────────────────────────────────────────
export function drawTemploOriental(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.3, 1.3);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 4, 80, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6c757d'; ctx.strokeStyle = '#2b1f14'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(-70, -15, 140, 15); ctx.fill(); ctx.stroke();
    const drawLevel = (by, h, w) => {
        ctx.fillStyle = '#b70909'; ctx.strokeStyle = '#2b0000'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.rect(-w * 0.7, by - h, 8, h); ctx.rect(w * 0.7 - 8, by - h, 8, h); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fdf0d5';
        ctx.beginPath(); ctx.rect(-w * 0.6, by - h, w * 1.2, h); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#343a40'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-w - 12, by - h - 3); ctx.quadraticCurveTo(0, by - h - 18, w + 12, by - h - 3); ctx.lineTo(w + 8, by - h); ctx.quadraticCurveTo(0, by - h - 10, -w - 8, by - h); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b70909'; ctx.beginPath(); ctx.arc(-w - 12, by - h - 4, 3.5, 0, Math.PI * 2); ctx.arc(w + 12, by - h - 4, 3.5, 0, Math.PI * 2); ctx.fill();
    };
    drawLevel(-15, 60, 55); drawLevel(-75, 50, 42); drawLevel(-125, 45, 30);
    ctx.fillStyle = '#ffd166'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-3, -200, 6, 30); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -205, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
}

// ─── Antena do Jaraguá ────────────────────────────────────────────────────────
export function drawJaraguaAntenna(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.1, 1.1);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(0, 1, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6c757d'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-6, -15); ctx.lineTo(6, -15); ctx.lineTo(12, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 2.5;
    const sections = 6;
    for (let i = 0; i < sections; i++) {
        const yStart = -15 - i * 18, yEnd = -15 - (i + 1) * 18;
        const wStart = 6 - i * 0.8, wEnd = 6 - (i + 1) * 0.8;
        ctx.strokeStyle = (i % 2 === 0) ? '#d90429' : '#f8f9fa';
        ctx.beginPath();
        ctx.moveTo(-wStart, yStart); ctx.lineTo(-wEnd, yEnd);
        ctx.moveTo(wStart, yStart); ctx.lineTo(wEnd, yEnd);
        ctx.moveTo(-wStart, yStart); ctx.lineTo(wEnd, yEnd);
        ctx.moveTo(wStart, yStart); ctx.lineTo(-wEnd, yEnd);
        ctx.stroke();
    }
    ctx.strokeStyle = '#f8f9fa'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -15 - sections * 18); ctx.lineTo(0, -15 - sections * 18 - 25); ctx.stroke();
    const beaconGlow = 0.5 + Math.sin(Date.now() / 200) * 0.5;
    ctx.fillStyle = `rgba(217,4,41,${beaconGlow})`;
    ctx.beginPath(); ctx.arc(0, -15 - sections * 18 - 25, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

// ─── Parede de Graffiti (Vila Madalena) ──────────────────────────────────────
export function drawGraffitiWall(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(3.5, 3.5);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(0, 1, 45, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#343a40'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(-40, -50, 80, 50, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.arc(-20, -30, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f72585'; ctx.beginPath(); ctx.arc(15, -25, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.moveTo(-5, -45); ctx.lineTo(10, -40); ctx.lineTo(-10, -20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7209b7'; ctx.beginPath(); ctx.rect(-25, -20, 3, 15); ctx.rect(10, -15, 3, 10); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = "bold 9px 'Outfit', sans-serif"; ctx.textAlign = 'center';
    ctx.fillText('BATMAN', 0, -12); ctx.fillText('SP 011', 0, -28);
    ctx.restore();
}

// ─── Luminária da Liberdade ────────────────────────────────────────────────────
export function drawLiberdadeLamp(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(0, 1, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b70909'; ctx.strokeStyle = '#2b0000'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.rect(-2, -60, 4, 60); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -60, 10, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#2b0000'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(-10, -55, 4.5, 0, Math.PI * 2); ctx.arc(10, -55, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const glow = 0.3 + Math.sin(Date.now() / 250) * 0.15;
    ctx.fillStyle = `rgba(255,234,0,${glow})`;
    ctx.beginPath(); ctx.arc(-10, -55, 10, 0, Math.PI * 2); ctx.arc(10, -55, 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}
