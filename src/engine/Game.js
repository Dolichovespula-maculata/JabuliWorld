import { Input } from './Input.js';
import { ParticleManager } from './ParticleManager.js';
import { Player, renderizarGeometriaGota, renderizarChapeuGenerico } from '../entities/Player.js';
import { World, MUNDO_ABERTO_WIDTH } from '../world/World.js';
import { estruturasPadrao } from '../entities/Structure.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.input = new Input();
        this.input.onKeyDown = (key) => {
            if (this.player.noPneu && ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
                this.player.noPneu = false;
                this.player.y += 90;
            }
            if (key === 'e') {
                this.interagirProximidade();
            }
        };

        this.particleManager = new ParticleManager(this.canvas.width, this.canvas.height);
        this.player = new Player(640, 480);
        this.world = new World();

        this.mapaAtual = "meu_jardim";
        this.estruturas = estruturasPadrao;

        // Camera for scrolling world
        this.camera = { x: 0, y: 0 };

        this.tempoAnimacao = 0;
        this.anguloBalanco = 0;
        this.uiManager = null;

        // NPCs spread across mundo_aberto (4000px world)
        this.npcs = [
            {
                id: "b7", set: "cogumelo", x: 968, y: 438,
                cor: "#c44b2e", chapeu: "cogumelo", morfologia: "gorda",
                nome: "Jabuli Cogumelo", atividade: "cogumelo",
                desc: "Cogumelo habita o coração do bosque encantado. Dizem que ela consegue ouvir os esporos viajarem pelo vento e decifrar suas mensagens.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b1", set: "serrano", x: 250, y: 440,
                cor: "#8338ec", chapeu: "gardachuva", morfologia: "longa",
                nome: "Jabuli Serrano", atividade: "serrano",
                desc: "Serrano cultiva tomates orgânicos na horta comunitária. Ele acredita que toda comida deve ser cultivada com amor e respeito pela terra.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b2", set: "maracatu", x: 820, y: 440,
                cor: "#ff006e", chapeu: "caboclo", morfologia: "gorda",
                nome: "Gota Maracatu", atividade: "maracatu",
                desc: "Maracatu toca tambores no bosque dos cogumelos. O ritmo mágico faz os cogumelos brilharem!",
                textoFala: "", timerFala: 0, dirBounce: 1
            },
            {
                id: "b3", set: "devo", x: 1450, y: 455,
                cor: "#e76f51", chapeu: "devo", morfologia: "normal",
                nome: "Jabuli Devo", atividade: "devo", dir: 1,
                desc: "Devo contempla a cachoeira enquanto coleta energia solar residual. Ela diz que a água é o computador da natureza.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b4", set: "frank", x: 2100, y: 580,
                cor: "#5a4a42", chapeu: "darko", morfologia: "longa",
                nome: "Máscara Frank", atividade: "frank", noLago: true,
                desc: "Frank mergulha no Grande Lago todas as manhãs. Ele diz que os peixes lhe contam segredos do mundo subaquático.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b5", set: "colombina", x: 2720, y: 448,
                cor: "#ffffff", chapeu: "colombina", morfologia: "normal",
                nome: "Colombina da Sombra", atividade: "colombina",
                desc: "Colombina performa ao redor da fogueira do mercado, contando histórias para qualquer Jabuli que queira ouvir.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b6", set: "ziggy", x: 3700, y: 388,
                cor: "#ff5500", chapeu: "bowie", morfologia: "gorda",
                nome: "Ziggy Star", atividade: "ziggy", angulo: 0,
                desc: "Ziggy usa o Observatório para mapear constelações. Cada estrela tem um nome dado por ela mesma.",
                textoFala: "", timerFala: 0
            }
        ];

        this.setupCanvasClickListener();
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    // World width depending on current map
    getWorldWidth() {
        return this.mapaAtual === "mundo_aberto" ? MUNDO_ABERTO_WIDTH : this.canvas.width;
    }

    // Convert screen X to world X accounting for camera
    screenToWorldX(sx) {
        return sx + this.camera.x;
    }

    setupCanvasClickListener() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
            const clickY = ((e.clientY - rect.top) / rect.height) * this.canvas.height;
            // Convert to world space
            const worldX = this.screenToWorldX(clickX);
            const worldY = clickY;

            if (this.mapaAtual === "meu_jardim") {
                const customizadora = this.estruturas.find(est => est.id === "customizadora");
                if (customizadora && Math.hypot(worldX - customizadora.x, worldY - customizadora.y) < customizadora.raio + 25) {
                    if (this.uiManager) this.uiManager.toggleMenu('customizadora');
                    return;
                }
                const mesaSolar = this.estruturas.find(est => est.id === "mesaSolar");
                if (mesaSolar && Math.hypot(worldX - mesaSolar.x, worldY - mesaSolar.y) < mesaSolar.raio + 25) {
                    if (this.uiManager) this.uiManager.toggleMenu('vitrine');
                    return;
                }
            }

            if (this.mapaAtual === "mundo_aberto") {
                for (let npc of this.npcs) {
                    if (Math.hypot(worldX - npc.x, worldY - npc.y) < 45) {
                        if (this.uiManager) this.uiManager.abrirLoreNPC(npc);
                        return;
                    }
                }
            }
        });
    }

    interagirProximidade() {
        if (this.mapaAtual === "meu_jardim") {
            const customizadora = this.estruturas.find(est => est.id === "customizadora");
            if (customizadora && Math.hypot(this.player.x - customizadora.x, this.player.y - customizadora.y) < customizadora.raio + 45) {
                if (this.uiManager) this.uiManager.toggleMenu('customizadora');
                return;
            }
            const mesaSolar = this.estruturas.find(est => est.id === "mesaSolar");
            if (mesaSolar && Math.hypot(this.player.x - mesaSolar.x, this.player.y - mesaSolar.y) < mesaSolar.raio + 45) {
                if (this.uiManager) this.uiManager.toggleMenu('vitrine');
                return;
            }
        } else if (this.mapaAtual === "mundo_aberto") {
            for (let npc of this.npcs) {
                if (Math.hypot(this.player.x - npc.x, this.player.y - npc.y) < 75) {
                    if (this.uiManager) this.uiManager.abrirLoreNPC(npc);
                    return;
                }
            }
        }
    }

    irParaMapa(idMapa) {
        if (idMapa === "mundo_aberto" && !this.player.nomePreset) {
            this.player.enviarMensagem("Preciso de um Jabuli para explorar o Mundo Aberto!");
            return;
        }

        this.mapaAtual = idMapa;
        this.camera.x = 0;
        this.camera.y = 0;

        const btnHome = document.getElementById('btn-home');
        if (btnHome) {
            btnHome.style.display = (idMapa === "meu_jardim") ? "none" : "inline-block";
        }

        this.player.noPneu = false;
        this.player.emInteracao = false;
        this.input.clear();
    }

    atualizar() {
        this.tempoAnimacao += 0.04;
        this.anguloBalanco = Math.sin(this.tempoAnimacao) * 0.25;

        this.particleManager.update();

        // ── SWIMMING CHECK (new top-down lake at 2350,440, rx=325,ry=205) ─────
        if (this.mapaAtual === "mundo_aberto") {
            const lakeCx = 2350, lakeCy = 440, lakeRx = 325, lakeRy = 205;
            const dx = this.player.x - lakeCx;
            const dy = this.player.y - lakeCy;
            const inLake = (dx*dx)/(lakeRx*lakeRx) + (dy*dy)/(lakeRy*lakeRy) <= 1;

            // Bridge: horizontal path across lake, y=398-432, x=2100-2600
            const naPonte = (this.player.x >= 2100 && this.player.x <= 2600 &&
                             this.player.y >= 392 && this.player.y <= 434);

            if (inLake && !naPonte) {
                this.player.noLago = true;
                this.player.velocidade = 3.5;
            } else {
                this.player.noLago = false;
                this.player.velocidade = 6;
            }
        } else {
            this.player.noLago = false;
            this.player.velocidade = 6;
        }

        // ── PLAYER UPDATE with world-width clamping ───────────────────────────
        const worldW = this.getWorldWidth();
        // We pass the actual canvas width so internal clamping doesn't interfere,
        // then we override with world bounds below.
        this.player.update(this.input, worldW, this.canvas.height);
        // Enforce world bounds
        if (this.player.x < 40) this.player.x = 40;
        if (this.player.x > worldW - 40) this.player.x = worldW - 40;

        // ── CAMERA UPDATE ──────────────────────────────────────────────────────
        if (this.mapaAtual === "mundo_aberto") {
            const targetX = this.player.x - this.canvas.width / 2;
            this.camera.x = Math.max(0, Math.min(targetX, MUNDO_ABERTO_WIDTH - this.canvas.width));
        } else {
            this.camera.x = 0;
        }

        // ── MAP TRANSITIONS ────────────────────────────────────────────────────
        if (this.mapaAtual === "meu_jardim" && this.player.x > 1230) {
            this.irParaMapa("mundo_aberto");
            if (this.mapaAtual === "mundo_aberto") {
                this.player.x = 70;
                this.player.y = 480;
            } else {
                this.player.x = 1220;
            }
        } else if (this.mapaAtual === "mundo_aberto" && this.player.x < 50) {
            this.irParaMapa("meu_jardim");
            this.player.x = 1200;
            this.player.y = 480;
        }

        // ── STRUCTURE COLLISIONS ───────────────────────────────────────────────
        if (this.player.nomePreset && !this.player.noPneu) {
            this.estruturas.forEach(est => {
                if (this.mapaAtual === "meu_jardim" && (est.id === "customizadora" || est.id === "mesaSolar")) {
                    if (est.checkCollision(this.player)) {
                        if (this.uiManager) {
                            this.uiManager.toggleMenu(est.id === 'mesaSolar' ? 'vitrine' : est.id);
                        }
                        this.player.y += 60;
                        this.input.clear();
                    }
                }
            });
        }

        // ── NPC AI (mundo_aberto) ──────────────────────────────────────────────
        if (this.mapaAtual === "mundo_aberto") {
            const t = Date.now();
            this.npcs.forEach(npc => {
                if (npc.timerFala > 0) npc.timerFala--;

                // b7 Cogumelo - sways in mushroom kingdom, spreads spores
                if (npc.atividade === "cogumelo") {
                    npc.x = 968 + Math.sin(t / 820) * 38;
                    npc.y = 438 + Math.sin(t / 500) * 12;
                    if (Math.random() < 0.003) {
                        npc.textoFala = ["🍄","✨","🌿","💫","🌙"][Math.floor(Math.random()*5)];
                        npc.timerFala = 85;
                    }
                }
                // b1 Serrano - tends the garden (watering up/down motion)
                if (npc.atividade === "serrano") {
                    npc.y = 440 + Math.sin(t / 350) * 4;
                    if (Math.random() < 0.003) {
                        npc.textoFala = ["🍅", "🌱", "💧", "🌿"][Math.floor(Math.random()*4)];
                        npc.timerFala = 90;
                    }
                }
                // b2 Maracatu - plays drums in mushroom grove (rhythmic bounce)
                else if (npc.atividade === "maracatu") {
                    npc.y = 440 + Math.abs(Math.sin(t / 180)) * -8;
                    if (Math.random() < 0.004) {
                        npc.textoFala = ["🎵", "🥁", "♪", "🎶"][Math.floor(Math.random()*4)];
                        npc.timerFala = 70;
                    }
                }
                // b3 Devo - walks near waterfall collecting energy
                else if (npc.atividade === "devo") {
                    npc.x += npc.dir * 0.7;
                    if (npc.x > 1560) { npc.x = 1560; npc.dir = -1; }
                    if (npc.x < 1350) { npc.x = 1350; npc.dir = 1; }
                    npc.y = 455 + Math.sin(t / 400) * 3;
                    if (Math.random() < 0.0025) {
                        npc.textoFala = ["⚡", "☀️", "🔋", "✨"][Math.floor(Math.random()*4)];
                        npc.timerFala = 80;
                    }
                }
                // b4 Frank - swims in the Great Lake (new position)
                else if (npc.atividade === "frank") {
                    npc.x = 2350 + Math.sin(t / 1100) * 180;
                    npc.y = 440 + Math.cos(t / 1100) * 90;
                    npc.noLago = true;
                    if (Math.random() < 0.002) {
                        npc.textoFala = ["🫧", "🐟", "🌊", "🐠"][Math.floor(Math.random()*4)];
                        npc.timerFala = 80;
                    }
                }
                // b5 Colombina - performs at market campfire
                else if (npc.atividade === "colombina") {
                    npc.y = 448 + Math.sin(t / 600) * 2.5;
                    if (Math.random() < 0.002) {
                        npc.textoFala = ["✨", "🎭", "📜", "💫"][Math.floor(Math.random()*4)];
                        npc.timerFala = 110;
                    }
                }
                // b6 Ziggy - circles near observatory looking at stars
                else if (npc.atividade === "ziggy") {
                    npc.angulo += 0.008;
                    npc.x = 3700 + Math.cos(npc.angulo) * 65;
                    npc.y = 390 + Math.sin(npc.angulo) * 28;
                    if (Math.random() < 0.002) {
                        npc.textoFala = ["⭐", "🔭", "🌌", "💥"][Math.floor(Math.random()*4)];
                        npc.timerFala = 90;
                    }
                }
            });
        }
    }

    desenhar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // ── APPLY CAMERA ───────────────────────────────────────────────────────
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);

        // Draw world background
        this.world.draw(this.ctx, this.mapaAtual, this.canvas.width, this.canvas.height, this.camera);

        // Draw structures (meu_jardim only)
        this.estruturas.forEach(est => {
            if (this.mapaAtual === "meu_jardim" && (est.id === "customizadora" || est.id === "mesaSolar")) {
                est.draw(this.ctx, this.anguloBalanco, this.player);
            }
        });

        // Draw NPCs in mundo_aberto
        if (this.mapaAtual === "mundo_aberto") {
            // Sort NPCs by Y position so ones lower on screen draw in front
            const sorted = [...this.npcs].sort((a, b) => a.y - b.y);
            sorted.forEach(npc => this.desenharNPC(npc));
        }

        // Draw player
        this.player.draw(this.ctx);

        // Bridge front rail over player
        if (this.mapaAtual === "mundo_aberto") {
            this.world.drawBridgeFront(this.ctx);
        }

        // Ambient particles
        this.particleManager.draw(this.ctx);

        // ── RESTORE (end camera transform) ────────────────────────────────────
        this.ctx.restore();

        // ── FIXED HUD ELEMENTS (no camera offset) ─────────────────────────────
        this.desenharHUDFixo();
    }

    desenharHUDFixo() {
        // Mini map indicator for mundo_aberto
        if (this.mapaAtual === "mundo_aberto") {
            const mmW = 180, mmH = 18;
            const mmX = this.canvas.width - mmW - 14;
            const mmY = 14;
            this.ctx.fillStyle = "rgba(0,0,0,0.4)";
            this.ctx.beginPath();
            this.ctx.roundRect(mmX, mmY, mmW, mmH, 6);
            this.ctx.fill();
            // Progress bar showing player position in world
            const progress = Math.max(0, Math.min(1, this.player.x / MUNDO_ABERTO_WIDTH));
            this.ctx.fillStyle = "#2a9d8f";
            this.ctx.beginPath();
            this.ctx.roundRect(mmX + 2, mmY + 2, Math.max(4, (mmW-4)*progress), mmH-4, 4);
            this.ctx.fill();
            // Player dot
            const dotX = mmX + 2 + (mmW-4)*progress;
            this.ctx.fillStyle = "#f2cc8f";
            this.ctx.beginPath();
            this.ctx.arc(dotX, mmY + mmH/2, 5, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.strokeStyle = "#3d2f26";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    desenharNPC(npc) {
        const ctx = this.ctx;
        let cutoffY = npc.y - 15;
        if (npc.morfologia === "longa") cutoffY = npc.y - 20;
        if (npc.morfologia === "gorda") cutoffY = npc.y - 10;

        const noLago = npc.noLago || npc.atividade === "frank";

        if (!noLago) {
            // Shadow
            ctx.fillStyle = "rgba(0,0,0,0.12)";
            ctx.beginPath();
            ctx.ellipse(npc.x, npc.y + 5, 22, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.save();
            ctx.beginPath();
            ctx.rect(npc.x - 55, npc.y - 130, 110, 130 + (cutoffY - npc.y));
            ctx.clip();
        }

        // Jabuli body
        ctx.fillStyle = npc.cor;
        ctx.beginPath();
        renderizarGeometriaGota(ctx, npc.x, npc.y, 22, npc.morfologia);
        ctx.fill();
        ctx.strokeStyle = "#3d2f26";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Eyes
        let olhoY = npc.y - 18;
        if (npc.morfologia === "longa") olhoY = npc.y - 22;
        if (npc.morfologia === "gorda") olhoY = npc.y - 14;
        ctx.fillStyle = "#1e1b1a";
        ctx.beginPath();
        ctx.arc(npc.x - 6, olhoY, 3, 0, Math.PI*2);
        ctx.arc(npc.x + 6, olhoY, 3, 0, Math.PI*2);
        ctx.fill();

        // Hat
        renderizarChapeuGenerico(ctx, npc.x, npc.y, npc.chapeu, npc.morfologia);

        if (noLago) {
            ctx.restore();
            // Water ripples
            const rt = (Date.now() / 300) % 1;
            ctx.strokeStyle = `rgba(168,218,220,${(1-rt)*0.8})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(npc.x, cutoffY + 4, 24*(1+rt*0.5), 6*(1+rt*0.5), 0, 0, Math.PI*2);
            ctx.stroke();
        }

        // Floating question mark indicator
        const bubbleY = npc.y - (npc.morfologia === "longa" ? 80 : 70);
        const floatY = bubbleY + Math.sin(Date.now()/210 + npc.x * 0.01) * 4;
        ctx.fillStyle = "#fdf0d5";
        ctx.strokeStyle = "#3d2f26";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(npc.x, floatY, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#3d2f26";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❓", npc.x, floatY);
        ctx.textBaseline = "alphabetic";

        // NPC name
        ctx.fillStyle = "#6e5e54";
        ctx.font = "bold 11px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(npc.nome, npc.x, npc.y - (npc.morfologia === "longa" ? 66 : 56));

        // Speech bubble
        if (npc.timerFala > 0 && npc.textoFala !== "") {
            this.desenharFalaNPC(npc);
        }
    }

    desenharFalaNPC(npc) {
        const ctx = this.ctx;
        ctx.font = "14px Arial";
        const tw = ctx.measureText(npc.textoFala).width;
        const bw = tw + 26, bh = 38;
        const bx = npc.x;
        const by = npc.y - (npc.morfologia === "longa" ? 106 : 98);

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#5a4235";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(bx - bw/2, by - bh/2, bw, bh, 12);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(bx-7, by+bh/2);
        ctx.lineTo(bx, by+bh/2+8);
        ctx.lineTo(bx+7, by+bh/2);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#5a4235";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(npc.textoFala, bx, by+2);
        ctx.textBaseline = "alphabetic";
    }

    rodar() {
        const loop = () => {
            this.atualizar();
            this.desenhar();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
