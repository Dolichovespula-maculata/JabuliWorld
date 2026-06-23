import { Input } from './Input.js';
import { ParticleManager } from './ParticleManager.js';
import { Player } from '../entities/Player.js';
import { NPC, criarNPCsDosPersonagens } from '../entities/NPC.js';
import { World, MEU_JARDIM_WIDTH, MEU_JARDIM_HEIGHT, MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT, BIOMAS_MA } from '../world/World.js';
import { ESTRUTURAS_PADRAO } from '../data/items.js';
import { listarPersonagens } from '../data/characters.js';
import { obterSpriteTintada } from '../constants.js';

// ─── Importa todas as funções de draw dos renderers (para o sort-draw loop) ───
import {
    drawACTree, drawEnchantedTree, drawYellowIpe, drawPinkIpe,
    drawBush, drawLanternMushroom, drawMushroomTopDown,
    drawMASP, drawFIESP, drawCopan, drawEdificioItalia,
    drawCatedralDaSe, drawAuditorioIbirapuera, drawObelisco,
    drawMonumentoBandeiras, drawToriiGate, drawTemploOriental,
    drawJaraguaAntenna, drawGraffitiWall, drawLiberdadeLamp,
    drawGiantMushroomHouse, drawObservatoryDome, drawTelescope, drawSolarPanel, drawWindTurbine
} from '../world/World.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.input = new Input();
        this.input.onKeyDown = (key) => {
            if (this.player.noPneu && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                this.player.noPneu = false;
                this.player.y += 90;
            }
            if (key === 'e') { this.interagirProximidade(); }
        };

        this.particleManager = new ParticleManager(this.canvas.width, this.canvas.height);
        this.player = new Player(1300, 1050);
        this.world  = new World();

        this.mapaAtual = 'meu_jardim';

        // ── Estruturas interativas (carregadas de data/items.js) ──────────────
        this.estruturas = ESTRUTURAS_PADRAO;
        this.estruturas.forEach(est => {
            if (est.id === 'customizadora') { est.x = 1300; est.y =  900; }
            if (est.id === 'mesaSolar')     { est.x = 1300; est.y = 1400; }
        });

        // ── NPCs (instanciados a partir de data/characters.js) ────────────────
        // listarPersonagens() retorna todos; criarNPCsDosPersonagens filtra os
        // que têm dados de NPC (npc !== null).
        this.npcs = criarNPCsDosPersonagens(listarPersonagens());

        // ── Câmera ────────────────────────────────────────────────────────────
        this.camera = { x: 1300 - this.canvas.width / 2, y: 1050 - this.canvas.height * 0.6 };

        this.tempoAnimacao = 0;
        this.anguloBalanco = 0;
        this.uiManager = null;

        this.setupCanvasClickListener();
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    // ─── Projeção isométrica ───────────────────────────────────────────────────
    _rotacionar(x, y) {
        const c = 0.7071067811865476;
        return { x: x * c - y * c, y: x * c + y * c };
    }

    projetarCoordenadas(x, y) {
        const r    = this._rotacionar(x, y);
        const rCam = this._rotacionar(this.camera.x + this.canvas.width / 2, this.camera.y + this.canvas.height * 0.6);
        const dx = r.x - rCam.x, dy = r.y - rCam.y;
        const focalLength = 600, perspectiveIntensity = 0.42, tiltFactor = 0.52;
        const divisor = focalLength - dy * perspectiveIntensity;
        const scale = divisor > 100 ? focalLength / divisor : 6.0;
        return {
            x: this.canvas.width / 2 + dx * scale,
            y: this.canvas.height * 0.6 + dy * scale * tiltFactor,
            scale
        };
    }

    getWorldWidth()  { return this.mapaAtual === 'mundo_aberto' ? MUNDO_ABERTO_WIDTH  : MEU_JARDIM_WIDTH; }
    getWorldHeight() { return this.mapaAtual === 'mundo_aberto' ? MUNDO_ABERTO_HEIGHT : MEU_JARDIM_HEIGHT; }

    // ─── Click listener ────────────────────────────────────────────────────────
    setupCanvasClickListener() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width)  * this.canvas.width;
            const clickY = ((e.clientY - rect.top)  / rect.height) * this.canvas.height;

            if (this.mapaAtual === 'meu_jardim') {
                for (const est of this.estruturas) {
                    if (est.id === 'customizadora' || est.id === 'mesaSolar') {
                        const proj = this.projetarCoordenadas(est.x, est.y);
                        if (Math.hypot(clickX - proj.x, clickY - proj.y) < (est.raio + 25) * proj.scale) {
                            if (this.uiManager) this.uiManager.toggleMenu(est.id === 'mesaSolar' ? 'vitrine' : est.id);
                            return;
                        }
                    }
                }
            }

            if (this.mapaAtual === 'mundo_aberto') {
                for (const npc of this.npcs) {
                    const proj = this.projetarCoordenadas(npc.x, npc.y);
                    if (Math.hypot(clickX - proj.x, clickY - proj.y) < 45 * proj.scale) {
                        if (this.uiManager) this.uiManager.abrirLoreNPC(npc);
                        return;
                    }
                }
            }
        });
    }

    // ─── Interação por tecla E ─────────────────────────────────────────────────
    interagirProximidade() {
        if (this.mapaAtual === 'meu_jardim') {
            for (const est of this.estruturas) {
                if ((est.id === 'customizadora' || est.id === 'mesaSolar') &&
                    Math.hypot(this.player.x - est.x, this.player.y - est.y) < est.raio + 45) {
                    if (this.uiManager) this.uiManager.toggleMenu(est.id === 'mesaSolar' ? 'vitrine' : est.id);
                    return;
                }
            }
        } else if (this.mapaAtual === 'mundo_aberto') {
            for (const npc of this.npcs) {
                if (Math.hypot(this.player.x - npc.x, this.player.y - npc.y) < 75) {
                    if (this.uiManager) this.uiManager.abrirLoreNPC(npc);
                    return;
                }
            }
        }
    }

    // ─── Transição de mapa ─────────────────────────────────────────────────────
    irParaMapa(idMapa) {
        if (idMapa === 'mundo_aberto' && !this.player.nomePreset) {
            this.player.enviarMensagem('Preciso de um Jabuli para explorar o Mundo Aberto!');
            return;
        }

        this.mapaAtual = idMapa;

        if (idMapa === 'mundo_aberto') {
            this.player.x = 100; this.player.y = 1500;
        } else {
            this.player.x = MEU_JARDIM_WIDTH - 100; this.player.y = 1200;
        }

        const worldW = this.getWorldWidth(), worldH = this.getWorldHeight();
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height * 0.6;

        if (idMapa === 'mundo_aberto') {
            this.camera.x = targetX; this.camera.y = targetY;
        } else {
            this.camera.x = Math.max(0, Math.min(targetX, worldW - this.canvas.width));
            this.camera.y = Math.max(0, Math.min(targetY, worldH - this.canvas.height));
        }

        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.style.display = (idMapa === 'meu_jardim') ? 'none' : 'inline-block';

        this.player.noPneu = false;
        this.player.emInteracao = false;
        this.input.clear();
    }

    // ─── ATUALIZAR ────────────────────────────────────────────────────────────
    atualizar() {
        this.tempoAnimacao  += 0.04;
        this.anguloBalanco   = Math.sin(this.tempoAnimacao) * 0.25;

        this.particleManager.update();

        // ── Verificação de natação ────────────────────────────────────────────
        if (this.mapaAtual === 'mundo_aberto') {
            const inRiver = (this.player.x >= 2610 && this.player.x <= 2890);
            const naPonte = (this.player.x >= 2200 && this.player.x <= 3300 && this.player.y >= 1550 && this.player.y <= 1650);
            this.player.noLago    = inRiver && !naPonte;
            this.player.velocidade = this.player.noLago ? 3.5 : 6;
        } else {
            this.player.noLago    = false;
            this.player.velocidade = 6;
        }

        // ── Movimento do jogador ───────────────────────────────────────────────
        const worldW = this.getWorldWidth(), worldH = this.getWorldHeight();
        const prevX = this.player.x, prevY = this.player.y;
        this.player.update(this.input, worldW, worldH, this.mapaAtual === 'mundo_aberto');

        // ── Colisões de fronteira ─────────────────────────────────────────────
        if (this.mapaAtual === 'meu_jardim') {
            const inIsland = (((this.player.x - 1300) / 1080) ** 2 + ((this.player.y - 960) / 775) ** 2) <= 1;
            const inBridge = (this.player.x >= 2300 && this.player.x <= MEU_JARDIM_WIDTH && this.player.y >= 1140 && this.player.y <= 1260);
            if (!inIsland && !inBridge) { this.player.x = prevX; this.player.y = prevY; }
            if (this.player.x < 80) this.player.x = 80;
            if (this.player.x > worldW - 80) this.player.x = worldW - 80;
            if (this.player.y < 150) this.player.y = 150;
            if (this.player.y > worldH - 90) this.player.y = worldH - 90;
        } else {
            const onBridge = (this.player.x >= 0 && this.player.x <= 420 && this.player.y >= 1550 && this.player.y <= 1650);
            if (this.player.x < 40 && !onBridge) this.player.x = 40;
        }

        // ── Câmera ────────────────────────────────────────────────────────────
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height * 0.6;
        if (this.mapaAtual === 'mundo_aberto') {
            this.camera.x = targetX; this.camera.y = targetY;
        } else {
            this.camera.x = Math.max(0, Math.min(targetX, worldW - this.canvas.width));
            this.camera.y = Math.max(0, Math.min(targetY, worldH - this.canvas.height));
        }

        // ── Transições de mapa ────────────────────────────────────────────────
        if (this.mapaAtual === 'meu_jardim' && this.player.x > MEU_JARDIM_WIDTH - 80) {
            this.irParaMapa('mundo_aberto'); this.player.x = 120; this.player.y = 1600;
        } else if (this.mapaAtual === 'mundo_aberto' && this.player.x < 50 && this.player.y >= 1550 && this.player.y <= 1650) {
            this.irParaMapa('meu_jardim'); this.player.x = MEU_JARDIM_WIDTH - 120; this.player.y = 1200;
        }

        // ── Colisão com estruturas ────────────────────────────────────────────
        if (this.player.nomePreset && !this.player.noPneu) {
            this.estruturas.forEach(est => {
                if (this.mapaAtual === 'meu_jardim' && (est.id === 'customizadora' || est.id === 'mesaSolar')) {
                    if (est.checkCollision(this.player)) {
                        if (this.uiManager) this.uiManager.toggleMenu(est.id === 'mesaSolar' ? 'vitrine' : est.id);
                        this.player.y += 60;
                        this.input.clear();
                    }
                }
            });
        }

        // ── IA dos NPCs ───────────────────────────────────────────────────────
        if (this.mapaAtual === 'mundo_aberto') {
            this.npcs.forEach(npc => npc.update());
        }
    }

    // ─── DESENHAR ─────────────────────────────────────────────────────────────
    desenhar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Fundo do mundo (terreno, rio, pontes de base)
        this.world.draw(this.ctx, this.mapaAtual, this.canvas.width, this.canvas.height, this.camera, this.player, (x, y) => this.projetarCoordenadas(x, y));

        // 2. Coletar todos os elementos para Y-sort (painter's algorithm)
        const sortList = [];

        this.world.obterElementosCenario(this.mapaAtual).forEach(elm => sortList.push({ ...elm }));

        if (this.mapaAtual === 'meu_jardim') {
            this.estruturas.forEach(est => {
                if (est.id === 'customizadora' || est.id === 'mesaSolar') {
                    sortList.push({ tipo: 'structure', x: est.x, y: est.y, ref: est });
                }
            });
        }

        if (this.mapaAtual === 'mundo_aberto') {
            this.npcs.forEach(npc => sortList.push({ tipo: 'npc', x: npc.x, y: npc.y, ref: npc }));
        }

        sortList.push({ tipo: 'player', x: this.player.x, y: this.player.y, ref: this.player });

        // Ordena por profundidade diagonal (x + y)
        sortList.sort((a, b) => (a.x + a.y) - (b.x + b.y));

        // 3. Desenha cada elemento projetado
        sortList.forEach(item => {
            const proj = this.projetarCoordenadas(item.x, item.y);

            // Frustum culling
            if (proj.x < -160 || proj.x > this.canvas.width + 160 || proj.y < -160 || proj.y > this.canvas.height + 160) return;

            this.ctx.save();
            this.ctx.translate(proj.x, proj.y);
            this.ctx.scale(proj.scale, proj.scale);
            this.ctx.translate(-item.x, -item.y);

            switch (item.tipo) {
                case 'tree':               drawACTree(this.ctx, item.x, item.y, item.s); break;
                case 'enchantedTree':      drawEnchantedTree(this.ctx, item.x, item.y, item.s); break;
                case 'yellowIpe':          drawYellowIpe(this.ctx, item.x, item.y, item.s); break;
                case 'pinkIpe':            drawPinkIpe(this.ctx, item.x, item.y, item.s); break;
                case 'bush':               drawBush(this.ctx, item.x, item.y, item.s); break;
                case 'mushroom':           { const a = 0.30 + Math.sin(Date.now() / 950 + item.phase) * 0.22; drawMushroomTopDown(this.ctx, item.x, item.y, item.r, item.cor, a); break; }
                case 'lanternMushroom':    { const a = 0.30 + Math.sin(Date.now() / 950 + item.phase) * 0.22; drawLanternMushroom(this.ctx, item.x, item.y, item.r, item.cor, a); break; }
                case 'auditorioIbirapuera':drawAuditorioIbirapuera(this.ctx, item.x, item.y); break;
                case 'graffitiWall':       drawGraffitiWall(this.ctx, item.x, item.y); break;
                case 'toriiGate':          drawToriiGate(this.ctx, item.x, item.y); break;
                case 'liberdadeLamp':      drawLiberdadeLamp(this.ctx, item.x, item.y); break;
                case 'masp':               drawMASP(this.ctx, item.x, item.y); break;
                case 'fiesp':              drawFIESP(this.ctx, item.x, item.y); break;
                case 'copan':              drawCopan(this.ctx, item.x, item.y); break;
                case 'edificioItalia':     drawEdificioItalia(this.ctx, item.x, item.y); break;
                case 'catedralDaSe':       drawCatedralDaSe(this.ctx, item.x, item.y); break;
                case 'temploOriental':     drawTemploOriental(this.ctx, item.x, item.y); break;
                case 'obelisco':           drawObelisco(this.ctx, item.x, item.y); break;
                case 'monumentoBandeiras': drawMonumentoBandeiras(this.ctx, item.x, item.y); break;
                case 'jaraguaAntenna':     drawJaraguaAntenna(this.ctx, item.x, item.y); break;
                case 'giantMushroomHouse': drawGiantMushroomHouse(this.ctx, item.x, item.y); break;
                case 'windTurbine':        drawWindTurbine(this.ctx, item.x, item.y, item.s || 1); break;
                case 'observatoryDome':    drawObservatoryDome(this.ctx, item.x, item.y); break;
                case 'telescope':          drawTelescope(this.ctx, item.x, item.y); break;
                case 'solarPanel':         drawSolarPanel(this.ctx, item.x, item.y); break;
                case 'structure':          item.ref.draw(this.ctx, this.anguloBalanco, this.player, this.obterPontoLuz()); break;
                case 'npc':               this.desenharNPC(item.ref, this.obterPontoLuz()); break;
                case 'player':            item.ref.draw(this.ctx, this.obterPontoLuz()); break;
                default: break;
            }

            this.ctx.restore();
        });

        // 4. Frente da ponte estaiada (sobre os elementos ordenados)
        if (this.mapaAtual === 'mundo_aberto') {
            this.world.drawBridgeFront(this.ctx, (x, y) => this.projetarCoordenadas(x, y));
        }

        // 5. Partículas ambientes (overlay no espaço de tela)
        this.particleManager.draw(this.ctx);

        // 6. HUD fixo
        this.desenharHUDFixo();
    }

    // ─── HUD (minimap) ─────────────────────────────────────────────────────────
    desenharHUDFixo() {
        const ctx = this.ctx;
        const cW = this.canvas.width;
        const mmW = 220, mmH = 110, mmX = cW - mmW - 16, mmY = 16, mmPad = 6;

        ctx.fillStyle = 'rgba(15,20,15,0.72)';
        ctx.beginPath(); ctx.roundRect(mmX - mmPad, mmY - mmPad, mmW + mmPad * 2, mmH + mmPad * 2, 10); ctx.fill();
        ctx.strokeStyle = 'rgba(42,157,143,0.55)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(mmX - mmPad, mmY - mmPad, mmW + mmPad * 2, mmH + mmPad * 2, 10); ctx.stroke();

        if (this.mapaAtual === 'meu_jardim') {
            ctx.fillStyle = '#4ea8de'; ctx.beginPath(); ctx.roundRect(mmX, mmY, mmW, mmH, 6); ctx.fill();
            ctx.fillStyle = '#7ab860'; ctx.beginPath(); ctx.ellipse(mmX + mmW * 0.5, mmY + mmH * 0.5, mmW * 0.38, mmH * 0.38, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#e8d8c0'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(mmX + mmW * 0.5, mmY + mmH * 0.5, mmW * 0.42, mmH * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
            const scaleX = mmW / MEU_JARDIM_WIDTH, scaleY = mmH / MEU_JARDIM_HEIGHT;
            this.estruturas.forEach(est => {
                ctx.fillStyle = est.id === 'customizadora' ? '#c44b2e' : '#f2cc8f';
                ctx.beginPath(); ctx.arc(mmX + est.x * scaleX, mmY + est.y * scaleY, 3, 0, Math.PI * 2); ctx.fill();
            });
            const pulse = 0.5 + Math.sin(Date.now() / 300) * 0.3;
            ctx.fillStyle = `rgba(255,255,255,${pulse})`;
            ctx.beginPath(); ctx.arc(mmX + this.player.x * scaleX, mmY + this.player.y * scaleY, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffdd44'; ctx.beginPath(); ctx.arc(mmX + this.player.x * scaleX, mmY + this.player.y * scaleY, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = "bold 9px 'Outfit', sans-serif"; ctx.textAlign = 'center';
            ctx.fillText('ILHA INICIAL', mmX + mmW / 2, mmY + mmH + 4);
        } else {
            ctx.fillStyle = '#4a7a30'; ctx.beginPath(); ctx.roundRect(mmX, mmY, mmW, mmH, 6); ctx.fill();
            BIOMAS_MA.forEach(b => {
                const bx = mmX + (b.x / MUNDO_ABERTO_WIDTH) * mmW, bw = (b.w / MUNDO_ABERTO_WIDTH) * mmW;
                ctx.fillStyle = b.color + '88'; ctx.fillRect(bx, mmY, bw, mmH);
                ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(bx, mmY); ctx.lineTo(bx, mmY + mmH); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = "7px 'Outfit', sans-serif"; ctx.textAlign = 'center';
                ctx.fillText(b.label, bx + bw / 2, mmY + mmH - 3);
            });
            const riverX = mmX + (2400 / MUNDO_ABERTO_WIDTH) * mmW, riverW = (800 / MUNDO_ABERTO_WIDTH) * mmW;
            ctx.fillStyle = 'rgba(74,184,216,0.7)'; ctx.fillRect(riverX, mmY + mmH * 0.35, riverW, mmH * 0.3);
            const roadY = mmY + (1600 / MUNDO_ABERTO_HEIGHT) * mmH;
            ctx.strokeStyle = 'rgba(220,200,160,0.55)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(mmX, roadY); ctx.lineTo(mmX + mmW, roadY); ctx.stroke();
            this.npcs.forEach(npc => {
                ctx.fillStyle = npc.cor || '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.arc(mmX + (npc.x / MUNDO_ABERTO_WIDTH) * mmW, mmY + (npc.y / MUNDO_ABERTO_HEIGHT) * mmH, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            });
            const pulse = 0.55 + Math.sin(Date.now() / 300) * 0.35;
            const px = mmX + (this.player.x / MUNDO_ABERTO_WIDTH) * mmW, py = mmY + (this.player.y / MUNDO_ABERTO_HEIGHT) * mmH;
            ctx.fillStyle = `rgba(255,255,255,${pulse * 0.5})`; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffdd44'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = "bold 9px 'Outfit', sans-serif"; ctx.textAlign = 'center';
            ctx.fillText('MUNDO ABERTO', mmX + mmW / 2, mmY + mmH + 4);
            ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '8px monospace'; ctx.textAlign = 'right';
            ctx.fillText(`x:${Math.round(this.player.x)} y:${Math.round(this.player.y)}`, mmX + mmW - 2, mmY + mmH + 14);
        }
    }

    obterPontoLuz() {
        return this.mapaAtual === 'mundo_aberto' ? { x: 2500, y: -1000 } : { x: 1200, y: -600 };
    }

    // ─── DESENHAR NPC ─────────────────────────────────────────────────────────
    desenharNPC(npc, pontoLuz) {
        const ctx = this.ctx;
        let spriteObj = obterSpriteTintada(npc.nome, npc.cor);
        if (!spriteObj) spriteObj = obterSpriteTintada('Jabuli Clássico', null);

        let sx = 80, sy = 60, sw = 240, sh = 280;
        if (spriteObj) {
            const c = spriteObj.config;
            sx = c.sx !== undefined ? c.sx : (c.larguraTotalImagem - c.larguraJabuli) / 2;
            sy = c.sy !== undefined ? c.sy : (c.alturaTotalImagem  - c.alturaJabuli)  / 2;
            sw = c.larguraJabuli; sh = c.alturaJabuli;
        }

        const aspect = sw / sh;
        let dh = 58, dw = dh * aspect;
        if (npc.morfologia === 'longa')  { dh = 72; dw = dh * aspect * 0.7; }
        if (npc.morfologia === 'gorda')  { dh = 48; dw = dh * aspect * 1.3; }

        let cutoffY = npc.y - 15;
        if (npc.morfologia === 'longa') cutoffY = npc.y - 20;
        if (npc.morfologia === 'gorda') cutoffY = npc.y - 10;

        const noLago = npc.noLago || npc.atividade === 'frank';

        let facingRight = true;
        if (npc.dir !== undefined && npc.dir < 0) facingRight = false;
        else if (npc.atividade === 'frank'  && Math.cos(Date.now() / 1100) < 0) facingRight = false;
        else if (npc.atividade === 'ziggy'  && Math.sin(npc.angulo) > 0)        facingRight = false;
        else if (npc.atividade === 'cogumelo' && Math.cos(Date.now() / 820) < 0) facingRight = false;

        const wobbleAngle = Math.sin(Date.now() / 120 + npc.x) * 0.05;

        if (noLago) {
            ctx.save();
            ctx.beginPath(); ctx.rect(npc.x - 55, npc.y - 130, 110, 130 + (cutoffY - npc.y)); ctx.clip();
        }

        ctx.save();
        ctx.translate(npc.x, npc.y); ctx.rotate(wobbleAngle);
        if (!facingRight) ctx.scale(-1, 1);
        if (spriteObj && spriteObj.image) ctx.drawImage(spriteObj.image, sx, sy, sw, sh, -dw / 2, -dh, dw, dh);
        ctx.restore();

        if (noLago) {
            ctx.restore();
            const rt = (Date.now() / 300) % 1;
            ctx.strokeStyle = `rgba(168,218,220,${(1 - rt) * 0.8})`; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(npc.x, cutoffY + 4, 24 * (1 + rt * 0.5), 6 * (1 + rt * 0.5), 0, 0, Math.PI * 2); ctx.stroke();
        }

        // Indicador de interação (?)
        const bubbleY = npc.y - (npc.morfologia === 'longa' ? 80 : 70);
        const floatY = bubbleY + Math.sin(Date.now() / 210 + npc.x * 0.01) * 4;
        ctx.fillStyle = '#fdf0d5'; ctx.strokeStyle = '#3d2f26'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(npc.x, floatY, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#3d2f26'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('❓', npc.x, floatY); ctx.textBaseline = 'alphabetic';

        // Nome
        ctx.fillStyle = '#6e5e54'; ctx.font = "bold 11px 'Outfit', sans-serif"; ctx.textAlign = 'center';
        ctx.fillText(npc.nome, npc.x, npc.y - (npc.morfologia === 'longa' ? 66 : 56));

        // Balão de fala
        if (npc.timerFala > 0 && npc.textoFala !== '') {
            this.desenharFalaNPC(npc);
        }
    }

    desenharFalaNPC(npc) {
        const ctx = this.ctx;
        ctx.font = '14px Arial';
        const tw = ctx.measureText(npc.textoFala).width;
        const bw = tw + 26, bh = 38;
        const bx = npc.x, by = npc.y - (npc.morfologia === 'longa' ? 106 : 98);
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#5a4235'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(bx - 7, by + bh / 2); ctx.lineTo(bx, by + bh / 2 + 8); ctx.lineTo(bx + 7, by + bh / 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5a4235'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(npc.textoFala, bx, by + 2); ctx.textBaseline = 'alphabetic';
    }

    // ─── LOOP PRINCIPAL ────────────────────────────────────────────────────────
    rodar() {
        const loop = () => { this.atualizar(); this.desenhar(); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
    }
}
