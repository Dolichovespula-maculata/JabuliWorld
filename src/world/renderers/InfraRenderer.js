/**
 * @file InfraRenderer.js
 * @description Funções de desenho de infraestrutura do mundo:
 * pontes, grades de caminho, rios, lagos projetados.
 */

// ─── Tile de Caminho (losango isométrico) ─────────────────────────────────────
export function drawPathTile(ctx, x, y, size, projetarFn) {
    const proj = projetarFn(x, y);
    const s = proj.scale * size;
    ctx.beginPath();
    ctx.moveTo(proj.x, proj.y - s * 0.55);
    ctx.lineTo(proj.x + s * 1.5, proj.y);
    ctx.lineTo(proj.x, proj.y + s * 0.55);
    ctx.lineTo(proj.x - s * 1.5, proj.y);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
}

// ─── Lago/Elipse Projetada ────────────────────────────────────────────────────
export function drawProjectedLake(ctx, cx, cy, rx, ry, projetarFn) {
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

// ─── Rio Projetado ────────────────────────────────────────────────────────────
export function drawProjectedRiver(ctx, points, width, projetarFn) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const proj = projetarFn(p.x - width / 2, p.y);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
    }
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        const proj = projetarFn(p.x + width / 2, p.y);
        ctx.lineTo(proj.x, proj.y);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

// ─── Ponte ────────────────────────────────────────────────────────────────────
/**
 * Desenha a estrutura de piso de uma ponte projetada.
 * @param {boolean} isEstaiada - Se true, usa visual de rodovia moderna (Ponte Estaiada)
 */
export function drawBridge(ctx, x0, x1, y, height, projetarFn, isEstaiada = false) {
    const y0 = y - height / 2, y1 = y + height / 2;

    if (isEstaiada) {
        // Ponte Estaiada da Marginal Pinheiros — rodovia moderna cinza
        ctx.fillStyle = '#adb5bd'; ctx.strokeStyle = '#343a40'; ctx.lineWidth = 3.5;
        ctx.beginPath();
        [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([bx, by], i) => {
            const p = projetarFn(bx, by); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Faixas brancas pontilhadas centrais
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.setLineDash([8, 12]);
        ctx.beginPath();
        for (let bx = x0; bx <= x1; bx += 20) {
            const p = projetarFn(bx, y); if (bx === x0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke(); ctx.setLineDash([]);
        // Bordas amarelas
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
        [y0 + 2, y1 - 2].forEach(by => {
            ctx.beginPath();
            for (let bx = x0; bx <= x1; bx += 20) { const p = projetarFn(bx, by); if (bx === x0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
            ctx.stroke();
        });
        return;
    }

    // Ponte de madeira padrão
    ctx.fillStyle = '#baa68a'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
    ctx.beginPath();
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([bx, by], i) => {
        const p = projetarFn(bx, by); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
    for (let bx = x0 + 15; bx < x1; bx += 22) {
        const p1 = projetarFn(bx, y0), p2 = projetarFn(bx, y1);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
}

// ─── Trilhos da Ponte ────────────────────────────────────────────────────────
export function drawBridgeRails(ctx, x0, x1, y, height, projetarFn, isEstaiada = false) {
    const y0 = y - height / 2, y1 = y + height / 2;

    if (isEstaiada) {
        // Guarda-corpos metálicos modernos
        ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 2.5;
        [y0, y1].forEach(ry => {
            for (let bx = x0; bx <= x1; bx += 40) {
                const p = projetarFn(bx, ry);
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 12 * p.scale); ctx.stroke();
            }
            ctx.beginPath();
            for (let bx = x0; bx <= x1; bx += 15) {
                const p = projetarFn(bx, ry); if (bx === x0) ctx.moveTo(p.x, p.y - 12 * p.scale); else ctx.lineTo(p.x, p.y - 12 * p.scale);
            }
            ctx.stroke();
        });
        return;
    }

    // Trilho de madeira padrão
    ctx.strokeStyle = '#5a4235'; ctx.lineWidth = 3.5;
    [y0, y1].forEach(ry => {
        for (let bx = x0; bx <= x1; bx += 26) {
            const p = projetarFn(bx, ry);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 13 * p.scale); ctx.stroke();
        }
        ctx.beginPath();
        for (let bx = x0; bx <= x1; bx += 10) {
            const p = projetarFn(bx, ry); if (bx === x0) ctx.moveTo(p.x, p.y - 13 * p.scale); else ctx.lineTo(p.x, p.y - 13 * p.scale);
        }
        ctx.stroke();
    });
}

// ─── Frente da Ponte Estaiada (desenhada por cima do sort) ────────────────────
export function drawBridgeFront(ctx, projetarFn) {
    const pBaseL = projetarFn(2750, 1530);
    const pBaseR = projetarFn(2750, 1670);
    const pJunc  = projetarFn(2750, 1600);
    pJunc.y -= 130 * pJunc.scale;

    const pTopL = projetarFn(2750, 1550); pTopL.y -= 250 * pTopL.scale;
    const pTopR = projetarFn(2750, 1650); pTopR.y -= 250 * pTopR.scale;

    const drawConcreteBeam = (p1, p2, w) => {
        ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = w + 4.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        ctx.strokeStyle = '#ced4da'; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    };

    // Estais (cabos amarelos)
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
    for (let bx = 2240; bx <= 2700; bx += 80) {
        const pDeck = projetarFn(bx, 1550);
        const t = (bx - 2240) / 460;
        ctx.beginPath(); ctx.moveTo(pJunc.x + (pTopL.x - pJunc.x) * t, pJunc.y + (pTopL.y - pJunc.y) * t); ctx.lineTo(pDeck.x, pDeck.y); ctx.stroke();
    }
    for (let bx = 2800; bx <= 3260; bx += 80) {
        const pDeck = projetarFn(bx, 1650);
        const t = (3260 - bx) / 460;
        ctx.beginPath(); ctx.moveTo(pJunc.x + (pTopR.x - pJunc.x) * t, pJunc.y + (pTopR.y - pJunc.y) * t); ctx.lineTo(pDeck.x, pDeck.y); ctx.stroke();
    }

    // Vigas de concreto
    drawConcreteBeam(pBaseL, pJunc, 14 * pJunc.scale);
    drawConcreteBeam(pBaseR, pJunc, 14 * pJunc.scale);
    drawConcreteBeam(pJunc, pTopL, 11 * pJunc.scale);
    drawConcreteBeam(pJunc, pTopR, 11 * pJunc.scale);
    const pMidL = { x: pJunc.x + (pTopL.x - pJunc.x) * 0.5, y: pJunc.y + (pTopL.y - pJunc.y) * 0.5 };
    const pMidR = { x: pJunc.x + (pTopR.x - pJunc.x) * 0.5, y: pJunc.y + (pTopR.y - pJunc.y) * 0.5 };
    drawConcreteBeam(pMidL, pMidR, 6 * pJunc.scale);
    drawConcreteBeam(pTopL, pTopR, 6 * pJunc.scale);

    // Sombra da borda do deck
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.beginPath();
    [[2200, 1648], [3300, 1648], [3300, 1652], [2200, 1652]].forEach(([bx, by], i) => {
        const p = projetarFn(bx, by); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath(); ctx.fill();

    // Postes do guarda-corpo frontal
    ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 3;
    for (let bx = 2200; bx <= 3300; bx += 40) {
        const p = projetarFn(bx, 1650);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 12 * p.scale); ctx.stroke();
    }
    ctx.beginPath();
    for (let i = 0; i <= 36; i++) {
        const bx = 2200 + (i / 36) * 1100;
        const p = projetarFn(bx, 1650);
        if (i === 0) ctx.moveTo(p.x, p.y - 12 * p.scale); else ctx.lineTo(p.x, p.y - 12 * p.scale);
    }
    ctx.stroke();
}
