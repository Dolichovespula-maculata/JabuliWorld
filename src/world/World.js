/**
 * @file World.js
 * @description Orquestrador de renderização do mundo.
 *
 * Este arquivo importa dados das cenas e delega o desenho aos renderers.
 * Para editar o conteúdo visual de um mapa, edite os arquivos em:
 *   src/world/scenes/   — posições, árvores, landmarks, etc.
 *   src/world/renderers/ — funções de draw de cada tipo de elemento
 */

// ─── Dados de cena ────────────────────────────────────────────────────────────
import {
    MEU_JARDIM_WIDTH, MEU_JARDIM_HEIGHT,
    ILHA_CENTRO_X, ILHA_CENTRO_Y, ILHA_RAIO_X, ILHA_RAIO_Y,
    ARVORES_MJ, ARBUSTOS_MJ,
    QTD_TUFOS_GRAMA_MJ, QTD_NUVENS_MJ,
    TORRES_SOLARPUNK_MJ,
    PONTE_SAIDA
} from './scenes/MeuJardim.js';

import {
    MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT,
    ARVORES_MA, gerarArvoresBorda,
    ARBUSTOS_MA, COGUMELOS_MA, LANDMARKS_MA,
    CONFIGURACAO_RIO, PONTES_MA,
    QTD_TUFOS_GRAMA_MA, QTD_NUVENS_MA
} from './scenes/MundoAberto.js';

// ─── Renderers ────────────────────────────────────────────────────────────────
import { drawACTree, drawEnchantedTree, drawYellowIpe, drawPinkIpe } from './renderers/TreeRenderer.js';
import {
    drawBush, drawGrassTuft, drawCloud,
    drawMushroomTopDown, drawLanternMushroom, drawGiantMushroomHouse,
    drawObservatoryDome, drawTelescope, drawSolarPanel,
    drawWindTurbine, drawSolarpunkTower
} from './renderers/PropRenderer.js';
import {
    drawMASP, drawFIESP, drawCopan, drawEdificioItalia,
    drawCatedralDaSe, drawAuditorioIbirapuera, drawObelisco,
    drawMonumentoBandeiras, drawToriiGate, drawTemploOriental,
    drawJaraguaAntenna, drawGraffitiWall, drawLiberdadeLamp
} from './renderers/BuildingRenderer.js';
import {
    drawProjectedLake, drawBridge, drawBridgeRails, drawBridgeFront
} from './renderers/InfraRenderer.js';

// ─── Re-exportações (usadas em Game.js) ──────────────────────────────────────
export { MEU_JARDIM_WIDTH, MEU_JARDIM_HEIGHT, MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT };
export { BIOMAS_MA } from './scenes/MundoAberto.js';

// ─── Helpers de draw re-exportados (usados pelo Game.js no sort-draw loop) ───
export {
    drawACTree, drawEnchantedTree, drawYellowIpe, drawPinkIpe,
    drawBush, drawLanternMushroom, drawMushroomTopDown,
    drawMASP, drawFIESP, drawCopan, drawEdificioItalia,
    drawCatedralDaSe, drawAuditorioIbirapuera, drawObelisco,
    drawMonumentoBandeiras, drawToriiGate, drawTemploOriental,
    drawJaraguaAntenna, drawGraffitiWall, drawLiberdadeLamp,
    drawGiantMushroomHouse, drawObservatoryDome, drawTelescope,
    drawSolarPanel, drawWindTurbine
};

// ─── Classe World ─────────────────────────────────────────────────────────────
export class World {
    constructor() {
        // ── Árvores e arbustos — carregados das cenas ─────────────────────────
        this.treesMJ   = [...ARVORES_MJ];
        this.bushesMJ  = [...ARBUSTOS_MJ];
        this.treesMA   = [...ARVORES_MA, ...gerarArvoresBorda()];
        this.bushesMA  = [...ARBUSTOS_MA];
        this.mushrooms = [...COGUMELOS_MA];

        // ── Dados extras da cena ─────────────────────────────────────────────
        this.mjTowers = [...TORRES_SOLARPUNK_MJ];

        // ── Tufos de grama (gerados proceduralmente) ──────────────────────────
        this.grassTuftsMJ = this._makeTufts(QTD_TUFOS_GRAMA_MJ, MEU_JARDIM_WIDTH, 200, MEU_JARDIM_HEIGHT - 400, (tx, ty) => {
            return ((tx - ILHA_CENTRO_X) / ILHA_RAIO_X) ** 2 + ((ty - ILHA_CENTRO_Y) / ILHA_RAIO_Y) ** 2 <= 0.92;
        });

        // ── Nuvens (sombras no chão) ──────────────────────────────────────────
        this.clouds = [];
        for (let i = 0; i < QTD_NUVENS_MJ; i++) {
            this.clouds.push({
                x: Math.random() * MEU_JARDIM_WIDTH,
                y: 200 + Math.random() * (MEU_JARDIM_HEIGHT - 400),
                s: 0.8 + Math.random() * 0.9
            });
        }
        this.cloudsMundo = [];
        for (let i = 0; i < QTD_NUVENS_MA; i++) {
            this.cloudsMundo.push({
                x: i * 1000,
                y: 150 + Math.random() * 300,
                s: 0.9 + Math.random() * 0.3
            });
        }
    }

    // ─── Gera tufos de grama proceduralmente dentro de uma área ──────────────
    _makeTufts(count, worldW, minY, maxY, insideFn = null) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            let tx, ty, attempts = 0;
            do {
                tx = 200 + Math.random() * (worldW - 400);
                ty = minY + Math.random() * (maxY - minY);
                attempts++;
            } while (insideFn && !insideFn(tx, ty) && attempts < 50);
            arr.push({ x: tx, y: ty, scale: 0.4 + Math.random() * 0.85 });
        }
        return arr;
    }

    // ─── UPDATE (chamado a cada frame) ────────────────────────────────────────
    update() {
        // Mundo não possui lógica de update por enquanto
    }

    // ─── RETORNA ELEMENTOS PARA O SORT DE Y (painter's algorithm) ────────────
    obterElementosCenario(mapaAtual) {
        const list = [];

        if (mapaAtual === 'meu_jardim') {
            this.treesMJ.forEach(t  => list.push({ tipo: t.tipo || 'tree', x: t.x, y: t.y, s: t.s }));
            this.bushesMJ.forEach(b => list.push({ tipo: 'bush', x: b.x, y: b.y, s: b.s }));
        }

        if (mapaAtual === 'mundo_aberto') {
            this.treesMA.forEach(t  => list.push({ tipo: t.tipo || 'tree', x: t.x, y: t.y, s: t.s }));
            this.bushesMA.forEach(b => list.push({ tipo: 'bush', x: b.x, y: b.y, s: b.s }));
            this.mushrooms.forEach(m => list.push({ tipo: 'lanternMushroom', x: m.x, y: m.y, r: m.r, cor: m.cor, phase: m.phase }));

            // Adiciona todos os landmarks da cena
            LANDMARKS_MA.forEach(lm => list.push({ ...lm }));
        }

        return list;
    }

    // ─── DRAW PRINCIPAL ───────────────────────────────────────────────────────
    draw(ctx, mapaAtual, canvasWidth, canvasHeight, camera, player, projetarFn) {
        this.update();
        if (mapaAtual === 'meu_jardim') {
            this._drawMeuJardim(ctx, canvasWidth, canvasHeight, player, projetarFn);
        } else if (mapaAtual === 'mundo_aberto') {
            this._drawMundoAberto(ctx, canvasWidth, canvasHeight, camera, player, projetarFn);
        }
    }

    // ─── DRAW MEU JARDIM ─────────────────────────────────────────────────────
    _drawMeuJardim(ctx, W, H, player, projetarFn) {
        // Fundo — oceano
        const oceanGrd = ctx.createLinearGradient(0, 0, 0, H);
        oceanGrd.addColorStop(0, '#87ceeb');
        oceanGrd.addColorStop(1, '#4ea8de');
        ctx.fillStyle = oceanGrd;
        ctx.fillRect(0, 0, W, H);

        // Ondas do oceano
        const tWaves = Date.now() / 900;
        ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 3;
        [[400, 320], [1800, 260], [650, 1550], [2100, 1420], [1300, 360], [200, 920], [2200, 820]].forEach((wp, idx) => {
            const wx = wp[0] + Math.sin(tWaves + idx) * 22;
            const wy = wp[1] + Math.cos(tWaves * 0.5 + idx) * 11;
            const proj = projetarFn(wx, wy);
            if (proj) {
                ctx.beginPath();
                ctx.moveTo(proj.x - 22 * proj.scale, proj.y);
                ctx.quadraticCurveTo(proj.x, proj.y - 7 * proj.scale * Math.sin(tWaves + idx), proj.x + 22 * proj.scale, proj.y);
                ctx.stroke();
            }
        });

        // Areia da ilha (ellipse bege maior)
        ctx.fillStyle = '#e8d8c0'; ctx.strokeStyle = '#d4c0a0'; ctx.lineWidth = 3;
        drawProjectedLake(ctx, ILHA_CENTRO_X, 1000, ILHA_RAIO_X + 70, ILHA_RAIO_Y + 65, projetarFn);
        ctx.fill(); ctx.stroke();

        // Espuma (borda pulsante)
        const tFoam = Date.now() / 500;
        const fOff = 12 + Math.sin(tFoam) * 5;
        ctx.strokeStyle = 'rgba(255,255,255,0.42)'; ctx.lineWidth = 12;
        drawProjectedLake(ctx, ILHA_CENTRO_X, 1000, ILHA_RAIO_X + 70 + fOff, ILHA_RAIO_Y + 65 + fOff * 0.78, projetarFn);
        ctx.stroke();

        // Grama da ilha — base sólida
        ctx.fillStyle = '#5EBD3E';
        drawProjectedLake(ctx, ILHA_CENTRO_X, ILHA_CENTRO_Y, ILHA_RAIO_X, ILHA_RAIO_Y, projetarFn);
        ctx.fill();

        // Grade de tiles de grama
        const tileSizeMJ = 80;
        const colsMJ = Math.ceil(MEU_JARDIM_WIDTH / tileSizeMJ);
        const rowsMJ = Math.ceil(MEU_JARDIM_HEIGHT / tileSizeMJ);
        ctx.lineWidth = 1;
        for (let c = 0; c < colsMJ; c++) {
            for (let r = 0; r < rowsMJ; r++) {
                const tx = c * tileSizeMJ, ty = r * tileSizeMJ;
                const cx = tx + tileSizeMJ / 2, cy = ty + tileSizeMJ / 2;
                if (((cx - ILHA_CENTRO_X) / ILHA_RAIO_X) ** 2 + ((cy - ILHA_CENTRO_Y) / ILHA_RAIO_Y) ** 2 <= 1) {
                    const p1 = projetarFn(tx, ty), p2 = projetarFn(tx + tileSizeMJ, ty);
                    const p3 = projetarFn(tx + tileSizeMJ, ty + tileSizeMJ), p4 = projetarFn(tx, ty + tileSizeMJ);
                    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
                    ctx.fillStyle = '#5EBD3E'; ctx.strokeStyle = '#4CA032'; ctx.fill(); ctx.stroke();
                }
            }
        }

        // Borda escura da ilha
        ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3;
        drawProjectedLake(ctx, ILHA_CENTRO_X, ILHA_CENTRO_Y, ILHA_RAIO_X, ILHA_RAIO_Y, projetarFn);
        ctx.stroke();

        // Sombras de nuvens
        const tShadow = Date.now() / 800;
        this.clouds.forEach(c => {
            const wx = (c.x + tShadow * 28) % (MEU_JARDIM_WIDTH + 1200) - 200;
            const proj = projetarFn(wx, c.y);
            ctx.fillStyle = 'rgba(0,0,0,0.04)';
            ctx.beginPath(); ctx.ellipse(proj.x, proj.y, 185 * c.s * proj.scale, 72 * c.s * proj.scale * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        });

        // Tufos de grama
        this.grassTuftsMJ.forEach(t => {
            const proj = projetarFn(t.x, t.y);
            drawGrassTuft(ctx, proj.x, proj.y, proj.scale * t.scale);
        });

        // Praia sul
        ctx.fillStyle = '#f0e4c8'; ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = 2;
        drawProjectedLake(ctx, ILHA_CENTRO_X, 1380, 700, 260, projetarFn);
        ctx.fill(); ctx.stroke();

        // Ponte de saída
        drawBridge(ctx, PONTE_SAIDA.x0, PONTE_SAIDA.x1, PONTE_SAIDA.y, PONTE_SAIDA.altura, projetarFn, false);
        drawBridgeRails(ctx, PONTE_SAIDA.x0, PONTE_SAIDA.x1, PONTE_SAIDA.y, PONTE_SAIDA.altura, projetarFn, false);

        // Torres solarpunk
        this.mjTowers.forEach(t => {
            const proj = projetarFn(t.x, H);
            drawSolarpunkTower(ctx, proj.x, proj.y, 8, t.s * proj.scale);
        });

        // Zona de saída (tracejada)
        ctx.fillStyle = 'rgba(42,157,143,0.12)'; ctx.strokeStyle = '#2a9d8f'; ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        [[MEU_JARDIM_WIDTH - 160, 1140], [MEU_JARDIM_WIDTH, 1140], [MEU_JARDIM_WIDTH, 1260], [MEU_JARDIM_WIDTH - 160, 1260]].forEach(([ex, ey], i) => {
            const p = projetarFn(ex, ey); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);

        // Título do mapa
        ctx.fillStyle = '#3d2f26'; ctx.font = "bold 16px 'Outfit', sans-serif"; ctx.textAlign = 'left';
        ctx.fillText('🌿 Jabuli World: Ilha Inicial', 40, 45);
    }

    // ─── DRAW MUNDO ABERTO ────────────────────────────────────────────────────
    _drawMundoAberto(ctx, W, H, camera, player, projetarFn) {
        // Fundo — oceano
        const oceanGrd = ctx.createLinearGradient(0, 0, 0, H);
        oceanGrd.addColorStop(0, '#87ceeb'); oceanGrd.addColorStop(1, '#4ea8de');
        ctx.fillStyle = oceanGrd; ctx.fillRect(0, 0, W, H);

        // Ondas fora da plataforma
        const tOcean = Date.now() / 900;
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2.5;
        [[200, 200], [1000, 300], [2200, 250], [3500, 400], [4800, 300], [500, 2800], [1600, 2900], [3000, 3000], [4200, 2900], [5200, 2800]].forEach((wp, idx) => {
            const wx = wp[0] + Math.sin(tOcean + idx) * 20;
            const wy = wp[1] + Math.cos(tOcean * 0.5 + idx) * 10;
            const proj = projetarFn(wx, wy);
            if (proj) { ctx.beginPath(); ctx.moveTo(proj.x - 20 * proj.scale, proj.y); ctx.quadraticCurveTo(proj.x, proj.y - 6 * proj.scale * Math.sin(tOcean + idx), proj.x + 20 * proj.scale, proj.y); ctx.stroke(); }
        });

        // Base verde da plataforma
        ctx.fillStyle = '#5EBD3E';
        ctx.beginPath();
        [[0, 0], [MUNDO_ABERTO_WIDTH, 0], [MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT], [0, MUNDO_ABERTO_HEIGHT]].forEach(([bx, by], i) => {
            const p = projetarFn(bx, by); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fill();

        // Grade de tiles
        const tileSizeMA = 80, colsMA = Math.ceil(MUNDO_ABERTO_WIDTH / tileSizeMA), rowsMA = Math.ceil(MUNDO_ABERTO_HEIGHT / tileSizeMA);
        const screenMargin = 150;
        ctx.lineWidth = 1;
        for (let c = 0; c < colsMA; c++) {
            for (let r = 0; r < rowsMA; r++) {
                const tx = c * tileSizeMA, ty = r * tileSizeMA;
                const pC = projetarFn(tx + tileSizeMA / 2, ty + tileSizeMA / 2);
                if (pC.x < -screenMargin || pC.x > W + screenMargin || pC.y < -screenMargin || pC.y > H + screenMargin) continue;
                const p1 = projetarFn(tx, ty), p2 = projetarFn(tx + tileSizeMA, ty);
                const p3 = projetarFn(tx + tileSizeMA, ty + tileSizeMA), p4 = projetarFn(tx, ty + tileSizeMA);
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
                ctx.fillStyle = '#5EBD3E'; ctx.strokeStyle = '#4CA032'; ctx.fill(); ctx.stroke();
            }
        }

        // Borda escura da plataforma
        ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 3.5;
        ctx.beginPath();
        [[0, 0], [MUNDO_ABERTO_WIDTH, 0], [MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT], [0, MUNDO_ABERTO_HEIGHT]].forEach(([bx, by], i) => {
            const p = projetarFn(bx, by); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.stroke();

        // Rio (Marginal Pinheiros)
        const { centroX, largura } = CONFIGURACAO_RIO;
        ctx.fillStyle = '#4ea8de'; ctx.strokeStyle = '#343a40'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let ry = 0; ry <= MUNDO_ABERTO_HEIGHT; ry += 100) {
            const p = projetarFn(centroX - largura / 2, ry); if (ry === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        for (let ry = MUNDO_ABERTO_HEIGHT; ry >= 0; ry -= 100) {
            const p = projetarFn(centroX + largura / 2, ry); ctx.lineTo(p.x, p.y);
        }
        ctx.closePath(); ctx.fill();

        // Margens do rio
        ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 2.5;
        [centroX - largura / 2, centroX + largura / 2].forEach(rx => {
            ctx.beginPath();
            for (let ry = 0; ry <= MUNDO_ABERTO_HEIGHT; ry += 100) {
                const p = projetarFn(rx, ry); if (ry === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        });

        // Correntes animadas no rio
        const tWaves = Date.now() / 1200;
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
        for (let ry = 100; ry < MUNDO_ABERTO_HEIGHT; ry += 300) {
            const wx = centroX + Math.sin(tWaves + ry) * 40;
            const pMid = projetarFn(wx, ry);
            ctx.beginPath();
            ctx.moveTo(pMid.x - 30 * pMid.scale, pMid.y);
            ctx.quadraticCurveTo(pMid.x, pMid.y - 5 * pMid.scale * Math.sin(tWaves), pMid.x + 30 * pMid.scale, pMid.y);
            ctx.stroke();
        }

        // Pontes
        PONTES_MA.forEach(p => {
            drawBridge(ctx, p.x0, p.x1, p.y, p.altura, projetarFn, p.isEstaiada);
            drawBridgeRails(ctx, p.x0, p.x1, p.y, p.altura, projetarFn, p.isEstaiada);
        });

        // Calçada da Paulista
        ctx.fillStyle = 'rgba(93,102,92,0.24)';
        ctx.beginPath();
        [[3500, 400], [4700, 400], [4700, 1600], [3500, 1600]].forEach(([cx, cy], i) => {
            const p = projetarFn(cx, cy); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fill();

        // Sombras de nuvens
        const tShadow = Date.now() / 1800;
        this.cloudsMundo.forEach(c => {
            const wx = (c.x + tShadow * 22) % (MUNDO_ABERTO_WIDTH + 800) - 400;
            const proj = projetarFn(wx, c.y);
            ctx.fillStyle = 'rgba(0,0,0,0.035)';
            ctx.beginPath(); ctx.ellipse(proj.x, proj.y, 200 * c.s * proj.scale, 78 * c.s * proj.scale * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        });

        // Tufos de grama
        if (!this._grassTuftsMA) {
            this._grassTuftsMA = this._makeTufts(QTD_TUFOS_GRAMA_MA, MUNDO_ABERTO_WIDTH, 150, MUNDO_ABERTO_HEIGHT - 100);
        }
        this._grassTuftsMA.forEach(t => {
            const proj = projetarFn(t.x, t.y);
            if (proj.x > -20 && proj.x < W + 20 && proj.y > -20 && proj.y < H + 20) {
                drawGrassTuft(ctx, proj.x, proj.y, proj.scale * t.scale);
            }
        });

        // Zona de retorno (tracejada)
        ctx.fillStyle = 'rgba(42,157,143,0.14)'; ctx.strokeStyle = '#2a9d8f'; ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        [[0, 1550], [50, 1550], [50, 1650], [0, 1650]].forEach(([ex, ey], i) => {
            const p = projetarFn(ex, ey); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);

        const textProj = projetarFn(25, 1600);
        ctx.fillStyle = '#2a9d8f'; ctx.font = 'bold ' + Math.round(11 * textProj.scale) + 'px sans-serif'; ctx.textAlign = 'center';
        ctx.save(); ctx.translate(textProj.x, textProj.y); ctx.rotate(-Math.PI / 2); ctx.fillText('← ILHA', 0, 0); ctx.restore();

        // Título do mapa
        ctx.fillStyle = '#3d2f26'; ctx.font = "bold 16px 'Outfit', sans-serif"; ctx.textAlign = 'left';
        ctx.fillText('🌍 Jabuli World: Mundo Aberto', 40, 45);
    }

    // ─── FRENTE DA PONTE ESTAIADA (sobre o sort) ──────────────────────────────
    drawBridgeFront(ctx, projetarFn) {
        drawBridgeFront(ctx, projetarFn);
    }
}
