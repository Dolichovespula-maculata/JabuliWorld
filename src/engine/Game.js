import { Input } from './Input.js';
import { ParticleManager } from './ParticleManager.js';
import { Player, renderizarGeometriaGota, renderizarChapeuGenerico } from '../entities/Player.js';
import { World, MEU_JARDIM_WIDTH, MEU_JARDIM_HEIGHT, MUNDO_ABERTO_WIDTH, MUNDO_ABERTO_HEIGHT } from '../world/World.js';
import { estruturasPadrao } from '../entities/Structure.js';
import { obterSpriteTintada } from '../constants.js';

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
        this.player = new Player(1200, 1200); // Start centered in the expanded Patio
        this.world = new World();

        this.mapaAtual = "meu_jardim";
        
        // Reposition structures in the expanded patio (2400 x 1800)
        this.estruturas = estruturasPadrao;
        this.estruturas.forEach(est => {
            if (est.id === "customizadora") {
                est.x = 900;
                est.y = 1000;
            } else if (est.id === "mesaSolar") {
                est.x = 1500;
                est.y = 1000;
            }
        });

        // Camera for scrolling world in both dimensions
        this.camera = { x: 1200 - this.canvas.width / 2, y: 1200 - this.canvas.height * 0.6 };

        this.tempoAnimacao = 0;
        this.anguloBalanco = 0;
        this.uiManager = null;

        // NPCs spread across mundo_aberto (5000px width x 3000px height world)
        this.npcs = [
            {
                id: "b7", set: "cogumelo", x: 1400, y: 1000,
                cor: "#c44b2e", chapeu: "cogumelo", morfologia: "gorda",
                nome: "Jabuli Cogumelo", atividade: "cogumelo",
                desc: "Cogumelo habita o coração do bosque encantado. Dizem que ela consegue ouvir os esporos viajarem pelo vento e decifrar suas mensagens.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b1", set: "serrano", x: 600, y: 1100,
                cor: "#8338ec", chapeu: "gardachuva", morfologia: "longa",
                nome: "Jabuli Serrano", atividade: "serrano",
                desc: "Serrano cultiva tomates orgânicos na horta comunitária. Ele acredita que toda comida deve ser cultivada com amor e respeito pela terra.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b2", set: "maracatu", x: 1520, y: 1050,
                cor: "#ff006e", chapeu: "caboclo", morfologia: "gorda",
                nome: "Gota Maracatu", atividade: "maracatu",
                desc: "Maracatu toca tambores no bosque dos cogumelos. O ritmo mágico faz os cogumelos brilharem!",
                textoFala: "", timerFala: 0, dirBounce: 1
            },
            {
                id: "b3", set: "devo", x: 2000, y: 1450,
                cor: "#e76f51", chapeu: "devo", morfologia: "normal",
                nome: "Jabuli Devo", atividade: "devo", dir: 1,
                desc: "Devo contempla a cachoeira enquanto coleta energia solar residual. Ela diz que a água é o computador da natureza.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b4", set: "frank", x: 2700, y: 1500,
                cor: "#5a4a42", chapeu: "darko", morfologia: "longa",
                nome: "Máscara Frank", atividade: "frank", noLago: true,
                desc: "Frank mergulha no Grande Lago todas as manhãs. He says the fish tell him secrets of the underwater world.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b5", set: "colombina", x: 3750, y: 1600,
                cor: "#ffffff", chapeu: "colombina", morfologia: "normal",
                nome: "Colombina da Sombra", atividade: "colombina",
                desc: "Colombina performa ao redor da fogueira do mercado, contando histórias para qualquer Jabuli que queira ouvir.",
                textoFala: "", timerFala: 0
            },
            {
                id: "b6", set: "ziggy", x: 4500, y: 900,
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

    projetarCoordenadas(x, y) {
        const camX = this.camera.x + this.canvas.width / 2;
        const camY = this.camera.y + this.canvas.height * 0.6;
        
        const dx = x - camX;
        const dy = y - camY;
        
        const focalLength = 600;
        const perspectiveIntensity = 0.55;
        const tiltFactor = 0.55;
        
        const divisor = focalLength - dy * perspectiveIntensity;
        const scale = divisor > 100 ? focalLength / divisor : 6.0;
        
        const screenX = this.canvas.width / 2 + dx * scale;
        const screenY = this.canvas.height * 0.6 + dy * scale * tiltFactor;
        
        return { x: screenX, y: screenY, scale: scale };
    }

    getWorldWidth() {
        return this.mapaAtual === "mundo_aberto" ? MUNDO_ABERTO_WIDTH : MEU_JARDIM_WIDTH;
    }

    getWorldHeight() {
        return this.mapaAtual === "mundo_aberto" ? MUNDO_ABERTO_HEIGHT : MEU_JARDIM_HEIGHT;
    }

    setupCanvasClickListener() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
            const clickY = ((e.clientY - rect.top) / rect.height) * this.canvas.height;

            if (this.mapaAtual === "meu_jardim") {
                const customizadora = this.estruturas.find(est => est.id === "customizadora");
                if (customizadora) {
                    const proj = this.projetarCoordenadas(customizadora.x, customizadora.y);
                    if (Math.hypot(clickX - proj.x, clickY - proj.y) < (customizadora.raio + 25) * proj.scale) {
                        if (this.uiManager) this.uiManager.toggleMenu('customizadora');
                        return;
                    }
                }
                const mesaSolar = this.estruturas.find(est => est.id === "mesaSolar");
                if (mesaSolar) {
                    const proj = this.projetarCoordenadas(mesaSolar.x, mesaSolar.y);
                    if (Math.hypot(clickX - proj.x, clickY - proj.y) < (mesaSolar.raio + 25) * proj.scale) {
                        if (this.uiManager) this.uiManager.toggleMenu('vitrine');
                        return;
                    }
                }
            }

            if (this.mapaAtual === "mundo_aberto") {
                for (let npc of this.npcs) {
                    const proj = this.projetarCoordenadas(npc.x, npc.y);
                    if (Math.hypot(clickX - proj.x, clickY - proj.y) < 45 * proj.scale) {
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
        
        if (idMapa === "mundo_aberto") {
            this.player.x = 100;
            this.player.y = 1500;
        } else {
            this.player.x = 1200;
            this.player.y = 1200;
        }

        const worldW = this.getWorldWidth();
        const worldH = this.getWorldHeight();
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height * 0.6;
        this.camera.x = Math.max(0, Math.min(targetX, worldW - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(targetY, worldH - this.canvas.height));

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

        // ── SWIMMING CHECK ─────────────────────────────────────────────────────
        if (this.mapaAtual === "mundo_aberto") {
            const lakeCx = 2700, lakeCy = 1500, lakeRx = 500, lakeRy = 320;
            const dx = this.player.x - lakeCx;
            const dy = this.player.y - lakeCy;
            const inLake = (dx*dx)/(lakeRx*lakeRx) + (dy*dy)/(lakeRy*lakeRy) <= 1;

            // Bridge path checking in world coordinates
            const naPonte = (this.player.x >= 2150 && this.player.x <= 3250 &&
                             this.player.y >= 1455 && this.player.y <= 1545);

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

        // ── PLAYER UPDATE with world dimensions ───────────────────────────────
        const worldW = this.getWorldWidth();
        const worldH = this.getWorldHeight();
        
        this.player.update(this.input, worldW, worldH);
        
        // Enforce world boundaries
        if (this.player.x < 40) this.player.x = 40;
        if (this.player.x > worldW - 40) this.player.x = worldW - 40;
        if (this.player.y < 150) this.player.y = 150;
        if (this.player.y > worldH - 90) this.player.y = worldH - 90;

        // ── CAMERA UPDATE (Horizontal and Vertical) ───────────────────────────
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height * 0.6;
        this.camera.x = Math.max(0, Math.min(targetX, worldW - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(targetY, worldH - this.canvas.height));

        // ── MAP TRANSITIONS ────────────────────────────────────────────────────
        if (this.mapaAtual === "meu_jardim" && this.player.x > MEU_JARDIM_WIDTH - 60) {
            this.irParaMapa("mundo_aberto");
            this.player.x = 70;
            this.player.y = 1500;
        } else if (this.mapaAtual === "mundo_aberto" && this.player.x < 50) {
            this.irParaMapa("meu_jardim");
            this.player.x = MEU_JARDIM_WIDTH - 100;
            this.player.y = 1200;
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

                // b7 Cogumelo - sways in mushroom kingdom
                if (npc.atividade === "cogumelo") {
                    npc.x = 1400 + Math.sin(t / 820) * 38;
                    npc.y = 1000 + Math.sin(t / 500) * 12;
                    if (Math.random() < 0.003) {
                        npc.textoFala = ["🍄","✨","🌿","💫","🌙"][Math.floor(Math.random()*5)];
                        npc.timerFala = 85;
                    }
                }
                // b1 Serrano - tends the garden
                else if (npc.atividade === "serrano") {
                    npc.y = 1100 + Math.sin(t / 350) * 4;
                    if (Math.random() < 0.003) {
                        npc.textoFala = ["🍅", "🌱", "💧", "🌿"][Math.floor(Math.random()*4)];
                        npc.timerFala = 90;
                    }
                }
                // b2 Maracatu - rhythmic bounce
                else if (npc.atividade === "maracatu") {
                    npc.y = 1050 + Math.abs(Math.sin(t / 180)) * -8;
                    if (Math.random() < 0.004) {
                        npc.textoFala = ["🎵", "🥁", "♪", "🎶"][Math.floor(Math.random()*4)];
                        npc.timerFala = 70;
                    }
                }
                // b3 Devo - walks collecting energy
                else if (npc.atividade === "devo") {
                    npc.x += npc.dir * 0.7;
                    if (npc.x > 2100) { npc.x = 2100; npc.dir = -1; }
                    if (npc.x < 1850) { npc.x = 1850; npc.dir = 1; }
                    npc.y = 1450 + Math.sin(t / 400) * 3;
                    if (Math.random() < 0.0025) {
                        npc.textoFala = ["⚡", "☀️", "🔋", "✨"][Math.floor(Math.random()*4)];
                        npc.timerFala = 80;
                    }
                }
                // b4 Frank - swims in the Great Lake
                else if (npc.atividade === "frank") {
                    npc.x = 2700 + Math.sin(t / 1100) * 220;
                    npc.y = 1500 + Math.cos(t / 1100) * 120;
                    npc.noLago = true;
                    if (Math.random() < 0.002) {
                        npc.textoFala = ["🫧", "🐟", "🌊", "🐠"][Math.floor(Math.random()*4)];
                        npc.timerFala = 80;
                    }
                }
                // b5 Colombina - campfire performer
                else if (npc.atividade === "colombina") {
                    npc.y = 1600 + Math.sin(t / 600) * 2.5;
                    if (Math.random() < 0.002) {
                        npc.textoFala = ["✨", "🎭", "📜", "💫"][Math.floor(Math.random()*4)];
                        npc.timerFala = 110;
                    }
                }
                // b6 Ziggy - circles near observatory looking at stars
                else if (npc.atividade === "ziggy") {
                    npc.angulo += 0.008;
                    npc.x = 4500 + Math.cos(npc.angulo) * 65;
                    npc.y = 900 + Math.sin(npc.angulo) * 28;
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

        // 1. Draw world background (which projects ground grid/paths/lake)
        this.world.draw(this.ctx, this.mapaAtual, this.canvas.width, this.canvas.height, this.camera, this.player, (x, y) => this.projetarCoordenadas(x, y));

        // 2. Collect all elements to Y-sort
        const sortList = [];

        // Add static scene elements from the world
        const worldElms = this.world.obterElementosCenario(this.mapaAtual);
        worldElms.forEach(elm => sortList.push({
            tipo: elm.tipo,
            x: elm.x,
            y: elm.y,
            s: elm.s,
            r: elm.r,
            cor: elm.cor,
            phase: elm.phase
        }));

        // Add structures if in Patio
        if (this.mapaAtual === "meu_jardim") {
            this.estruturas.forEach(est => {
                if (est.id === "customizadora" || est.id === "mesaSolar") {
                    sortList.push({ tipo: "structure", x: est.x, y: est.y, ref: est });
                }
            });
        }

        // Add NPCs if in Mundo Aberto
        if (this.mapaAtual === "mundo_aberto") {
            this.npcs.forEach(npc => {
                sortList.push({ tipo: "npc", x: npc.x, y: npc.y, ref: npc });
            });
        }

        // Add Player
        sortList.push({ tipo: "player", x: this.player.x, y: this.player.y, ref: this.player });

        // Sort by world Y coordinate (ascending)
        sortList.sort((a, b) => a.y - b.y);

        // 3. Draw each element projected and Y-sorted
        sortList.forEach(item => {
            const proj = this.projetarCoordenadas(item.x, item.y);
            
            // Frustum Culling: Skip drawing if far outside screen boundaries
            if (proj.x < -160 || proj.x > this.canvas.width + 160 || proj.y < -160 || proj.y > this.canvas.height + 160) {
                return;
            }

            // Save and apply matrix transformation wrapper
            this.ctx.save();
            this.ctx.translate(proj.x, proj.y);
            this.ctx.scale(proj.scale, proj.scale);
            this.ctx.translate(-item.x, -item.y);

            // Execute actual drawing code relative to the transformed coordinate system
            if (item.tipo === "tree") {
                this.world.drawACTree(this.ctx, 0, 0, item.s);
            } else if (item.tipo === "bush") {
                this.world.drawBush(this.ctx, 0, 0, item.s);
            } else if (item.tipo === "mushroom") {
                const alpha = 0.30 + Math.sin(Date.now()/950 + item.phase)*0.22;
                this.world.drawMushroomTopDown(this.ctx, 0, 0, item.r, item.cor, alpha);
            } else if (item.tipo === "marketTent") {
                this.world.drawMarketTent(this.ctx, item.x, item.y, item.cor);
            } else if (item.tipo === "barrel") {
                this.world.drawBarrel(this.ctx, item.x, item.y);
            } else if (item.tipo === "campfire") {
                this.world.drawCampfire(this.ctx, item.x, item.y);
            } else if (item.tipo === "gardenPatch") {
                this.world.drawGardenPatch(this.ctx, item.x, item.y);
            } else if (item.tipo === "observatoryDome") {
                this.world.drawObservatoryDome(this.ctx, item.x, item.y);
            } else if (item.tipo === "telescope") {
                this.world.drawTelescope(this.ctx, item.x, item.y);
            } else if (item.tipo === "solarPanel") {
                this.world.drawSolarPanel(this.ctx, item.x, item.y);
            } else if (item.tipo === "structure") {
                item.ref.draw(this.ctx, this.anguloBalanco, this.player);
            } else if (item.tipo === "npc") {
                this.desenharNPC(item.ref);
            } else if (item.tipo === "player") {
                item.ref.draw(this.ctx);
            }

            this.ctx.restore();
        });

        // 4. Draw bridge front rail over sorted elements (Mundo Aberto only)
        if (this.mapaAtual === "mundo_aberto") {
            this.world.drawBridgeFront(this.ctx, (x, y) => this.projetarCoordenadas(x, y));
        }

        // 5. Draw ambient particles (flat screen space overlay)
        this.particleManager.draw(this.ctx);

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

        // Setup translation, rotation (wobble) and scale (flip)
        ctx.save();
        ctx.translate(npc.x, npc.y);

        // Animação de balanço (wobble) constante para NPCs ativos
        let wobbleAngle = Math.sin(Date.now() / 120 + npc.x) * 0.08;
        ctx.rotate(wobbleAngle);

        // Determinar direção horizontal do NPC
        let facingRight = true;
        if (npc.dir !== undefined && npc.dir < 0) {
            facingRight = false;
        } else if (npc.atividade === "frank") {
            // Derivada do movimento circular: se cosseno < 0, está indo para a esquerda
            if (Math.cos(Date.now() / 1100) < 0) facingRight = false;
        } else if (npc.atividade === "ziggy") {
            // Derivada do movimento orbital: se seno > 0, está indo para a esquerda
            if (Math.sin(npc.angulo) > 0) facingRight = false;
        } else if (npc.atividade === "cogumelo") {
            // Derivada do balanço: se cosseno < 0, está indo para a esquerda
            if (Math.cos(Date.now() / 820) < 0) facingRight = false;
        }

        if (!facingRight) {
            ctx.scale(-1, 1);
        }

        const spriteObj = obterSpriteTintada(npc.nome, npc.cor);
        if (spriteObj && spriteObj.image) {
            const config = spriteObj.config;
            const sx = (config.larguraTotalImagem - config.larguraJabuli) / 2;
            const sy = (config.alturaTotalImagem - config.alturaJabuli) / 2;
            const sw = config.larguraJabuli;
            const sh = config.alturaJabuli;
            
            // Distorcer conforme morfologia
            let dw = config.larguraDesenho;
            let dh = config.alturaDesenho;
            if (npc.morfologia === "longa") {
                dw = 42;
                dh = 72;
            } else if (npc.morfologia === "gorda") {
                dw = 62;
                dh = 48;
            }

            ctx.drawImage(spriteObj.image, sx, sy, sw, sh, -dw / 2, -dh, dw, dh);
            
            // Chapéu
            renderizarChapeuGenerico(ctx, 0, 0, npc.chapeu, npc.morfologia);
        } else {
            // Fallback vetorial
            ctx.fillStyle = npc.cor;
            ctx.beginPath();
            renderizarGeometriaGota(ctx, 0, 0, 22, npc.morfologia);
            ctx.fill();
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Olhos
            let olhoY = -18;
            if (npc.morfologia === "longa") olhoY = -22;
            if (npc.morfologia === "gorda") olhoY = -14;
            ctx.fillStyle = "#1e1b1a";
            ctx.beginPath();
            ctx.arc(-6, olhoY, 3, 0, Math.PI*2);
            ctx.arc(6, olhoY, 3, 0, Math.PI*2);
            ctx.fill();

            // Chapéu
            renderizarChapeuGenerico(ctx, 0, 0, npc.chapeu, npc.morfologia);
        }

        ctx.restore(); // Restaura a translação, rotação e escala

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
