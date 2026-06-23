/**
 * @file TreeRenderer.js
 * @description Funções de desenho de árvores e vegetação arbórea.
 *
 * ─── COMO ADICIONAR UM NOVO TIPO DE ÁRVORE ────────────────────────────────────
 *
 * 1. Crie uma função exportada aqui seguindo o padrão:
 *    export function drawMinhaArvore(ctx, x, y, s = 1) { ... }
 *
 * 2. Registre o tipo no switch de Game.js (método desenhar()):
 *    case 'minhaArvore': drawMinhaArvore(ctx, 0, 0, item.s); break;
 *
 * 3. Adicione entradas com tipo: 'minhaArvore' em:
 *    src/world/scenes/MeuJardim.js ou MundoAberto.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Árvore solarpunk padrão (verde-água com tronco marrom).
 * Usada como vegetação genérica em todos os biomas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Centro X
 * @param {number} y - Base Y
 * @param {number} s - Escala (1 = tamanho normal)
 */
export function drawACTree(ctx, x, y, s = 1) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 5 * s, y + 9 * s, 23 * s, 11 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Copa exterior
    ctx.fillStyle = '#2d9e8f'; ctx.strokeStyle = '#1b6a60'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 26 * s, 20 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Destaque interno
    ctx.fillStyle = '#50c8b8';
    ctx.beginPath();
    ctx.ellipse(x - 5 * s, y - 5 * s, 14 * s, 10 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco
    ctx.fillStyle = '#8d705c'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 17 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
}

/**
 * Árvore encantada com brilho pulsante verde (Vila Madalena).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} s
 */
export function drawEnchantedTree(ctx, x, y, s = 1) {
    const t = Date.now() / 1200;
    const glowA = 0.15 + Math.sin(t + x * 0.01) * 0.08;
    // Halo de glow
    ctx.fillStyle = `rgba(80,200,150,${glowA})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 36 * s, 28 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Copa
    ctx.fillStyle = '#1a6b50'; ctx.strokeStyle = '#0d4434'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 26 * s, 21 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38c89a';
    ctx.beginPath();
    ctx.ellipse(x - 5 * s, y - 6 * s, 14 * s, 10 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco
    ctx.fillStyle = '#6d4a2e'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 18 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
}

/**
 * Ipê Amarelo — árvore brasileira com flores douradas (Parque Ibirapuera).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} s
 */
export function drawYellowIpe(ctx, x, y, s = 1) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 5 * s, y + 9 * s, 26 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco elíptico (base)
    ctx.fillStyle = '#5c4d3c'; ctx.strokeStyle = '#2b1f14'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 17 * s, 6 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Tronco vertical
    ctx.beginPath();
    ctx.moveTo(x - 3 * s, y + 17 * s);
    ctx.lineTo(x - 1.5 * s, y - 5 * s);
    ctx.lineTo(x + 1.5 * s, y - 5 * s);
    ctx.lineTo(x + 3 * s, y + 17 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Copas floridas
    const colors = ['#f9c74f', '#f9844a', '#ffd166', '#f9c74f'];
    ctx.lineWidth = 1.5;
    ctx.fillStyle = colors[1]; ctx.strokeStyle = '#9e5a1b';
    ctx.beginPath(); ctx.arc(x - 14 * s, y - 8 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 14 * s, y - 8 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors[0]; ctx.strokeStyle = '#b58b12';
    ctx.beginPath(); ctx.arc(x - 12 * s, y - 20 * s, 18 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 12 * s, y - 20 * s, 18 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 10 * s, 20 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors[2]; ctx.strokeStyle = '#cca01a';
    ctx.beginPath(); ctx.arc(x - 4 * s, y - 28 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 5 * s, y - 26 * s, 15 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Pétalas caídas no chão
    ctx.fillStyle = '#ffea00';
    [[x - 18, y + 12], [x - 5, y + 8], [x + 12, y + 15], [x + 22, y + 7], [x - 10, y + 16]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.ellipse(px * s, py * s, 2.5 * s, 1.5 * s, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

/**
 * Ipê Rosa — árvore brasileira com flores rosas (Liberdade e Ibirapuera).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} s
 */
export function drawPinkIpe(ctx, x, y, s = 1) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 5 * s, y + 9 * s, 26 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco
    ctx.fillStyle = '#5c4d3c'; ctx.strokeStyle = '#2b1f14'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 17 * s, 6 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 3 * s, y + 17 * s);
    ctx.lineTo(x - 1.5 * s, y - 5 * s);
    ctx.lineTo(x + 1.5 * s, y - 5 * s);
    ctx.lineTo(x + 3 * s, y + 17 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Copas floridas rosas
    const colors = ['#ff99c8', '#ffc6ff', '#e8c0fc', '#ff99c8'];
    ctx.lineWidth = 1.5;
    ctx.fillStyle = colors[1]; ctx.strokeStyle = '#9c387b';
    ctx.beginPath(); ctx.arc(x - 14 * s, y - 8 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 14 * s, y - 8 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors[0]; ctx.strokeStyle = '#a64283';
    ctx.beginPath(); ctx.arc(x - 12 * s, y - 20 * s, 18 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 12 * s, y - 20 * s, 18 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 10 * s, 20 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors[2]; ctx.strokeStyle = '#b85496';
    ctx.beginPath(); ctx.arc(x - 4 * s, y - 28 * s, 16 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 5 * s, y - 26 * s, 15 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Pétalas rosas caídas
    ctx.fillStyle = '#ff99c8';
    [[x - 18, y + 12], [x - 5, y + 8], [x + 12, y + 15], [x + 22, y + 7], [x - 10, y + 16]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.ellipse(px * s, py * s, 2.5 * s, 1.5 * s, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}
