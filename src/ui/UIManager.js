import { bancoCodigos } from '../constants.js';
import { renderizarGeometriaGota, renderizarChapeuGenerico } from '../entities/Player.js';

export class UIManager {
    constructor(game) {
        this.game = game;

        // Estado inicial de inventário de Jabulis completos (todos trancados de início)
        this.inventario = { 
            default: false, // Jabuli Clássico trancado inicialmente (precisa de código CLASSICO)
            b1: false, 
            b2: false, 
            b3: false, 
            b4: false, 
            b5: false, 
            b6: false,
            b7: false
        };
        this.bonecosAtivados = {};

        this.setupDragAndDrop();
        this.setupChatListener();
        this.setupEscapeListener();
    }

    setupDragAndDrop() {
        document.querySelectorAll('.game-menu').forEach(menu => {
            const header = menu.querySelector('.menu-drag-zone');
            if (!header) return;
            let isDragging = false, startX, startY;
            
            header.addEventListener('mousedown', e => {
                isDragging = true;
                startX = e.clientX - menu.offsetLeft;
                startY = e.clientY - menu.offsetTop;
                document.querySelectorAll('.game-menu').forEach(m => m.style.zIndex = 10);
                menu.style.zIndex = 11;
            });
            
            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                menu.style.left = (e.clientX - startX) + 'px';
                menu.style.top = (e.clientY - startY) + 'px';
            });
            
            document.addEventListener('mouseup', () => isDragging = false);
        });
    }

    setupChatListener() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    this.enviarMensagem();
                }
            });
        }
    }

    setupEscapeListener() {
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.game-menu').forEach(menu => {
                    menu.style.display = "none";
                });
            }
        });
    }

    toggleMenu(id) {
        const menu = document.getElementById(`menu-${id}`);
        if (!menu) return;
        menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
        
        if (id === 'vitrine' && menu.style.display === "flex") {
            this.renderizarGridSelos();
            this.selecionarSelo({ 
                id: "default",
                codigo: "CLASSICO",
                nome: "Jabuli Clássico", 
                cor: "#d94141", 
                morfologia: "normal", 
                chapeu: null,
                criador: "Ryan", 
                insp: "O Jabuli clássico e amigável.",
                unlocked: !!this.inventario["default"]
            });
        }
    }

    renderizarGridSelos() {
        const container = document.getElementById('vitrine-lista-selos');
        if (!container) return;

        container.innerHTML = "";

        const colecao = [
            { id: "default", codigo: "CLASSICO", nome: "Jabuli Clássico", cor: "#d94141", morfologia: "normal", chapeu: null, criador: "Ryan", insp: "O Jabuli clássico e amigável.", unlocked: !!this.inventario["default"] },
            { id: "b1", codigo: "BONECO-01", nome: "Jabuli Serrano", cor: "#8338ec", morfologia: "longa", chapeu: "gardachuva", criador: "Ryan", insp: "Clima serrano do agreste.", unlocked: !!this.inventario["b1"] },
            { id: "b2", codigo: "BONECO-02", nome: "Gota Maracatu", cor: "#ff006e", morfologia: "gorda", chapeu: "caboclo", criador: "Ryan", insp: "Baque Solto pernambucano.", unlocked: !!this.inventario["b2"] },
            { id: "b3", codigo: "BONECO-03", nome: "Jabuli Devo", cor: "#e76f51", morfologia: "normal", chapeu: "devo", criador: "Ryan", insp: "Energia limpa e eletrônica.", unlocked: !!this.inventario["b3"] },
            { id: "b4", codigo: "BONECO-04", nome: "Máscara Frank", cor: "#5a4a42", morfologia: "longa", chapeu: "darko", criador: "Ryan", insp: "Mistérios do agreste.", unlocked: !!this.inventario["b4"] },
            { id: "b5", codigo: "BONECO-05", nome: "Colombina da Sombra", cor: "#ffffff", morfologia: "normal", chapeu: "colombina", criador: "Ryan", insp: "Teatro de rua veneziano.", unlocked: !!this.inventario["b5"] },
            { id: "b6", codigo: "BONECO-06", nome: "Ziggy Star", cor: "#ff5500", morfologia: "gorda", chapeu: "bowie", criador: "Ryan", insp: "Uma estrela vinda do espaço.", unlocked: !!this.inventario["b6"] }
        ];

        colecao.forEach(selo => {
            const canvasId = `canvas-selo-icon-${selo.codigo}`;
            const slot = document.createElement('div');
            slot.className = `stamp-slot ${selo.unlocked ? 'unlocked' : 'locked'}`;
            
            slot.innerHTML = `
                <div class="stamp-badge">
                    <canvas id="${canvasId}" width="40" height="40"></canvas>
                </div>
                <div class="stamp-tooltip">
                    <div class="stamp-tooltip-inner">
                        <strong style="color: #e07a5f;">${selo.nome}</strong><br>
                        ${selo.unlocked ? '🔓 Desbloqueado' : '🔒 Bloqueado'}<br>
                        <span style="font-size: 9px; color: #777;">${selo.insp}</span>
                    </div>
                </div>
            `;

            slot.addEventListener('click', () => {
                this.selecionarSelo(selo);
            });

            container.appendChild(slot);

            setTimeout(() => {
                const canvasEl = document.getElementById(canvasId);
                if (canvasEl) {
                    const ctx = canvasEl.getContext('2d');
                    ctx.clearRect(0, 0, 40, 40);
                    ctx.fillStyle = selo.cor;
                    ctx.beginPath();
                    renderizarGeometriaGota(ctx, 20, 34, 12, selo.morfologia);
                    ctx.fill();

                    // Olhos
                    ctx.fillStyle = "#000";
                    ctx.beginPath();
                    ctx.arc(16, 24, 1.5, 0, Math.PI * 2);
                    ctx.arc(24, 24, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }, 20);
        });
    }

    selecionarSelo(selo) {
        const polaroidCanvas = document.getElementById('canvas-vitrine-polaroid');
        const polaroidNome = document.getElementById('polaroid-nome-selo');
        const polaroidDesc = document.getElementById('polaroid-desc-selo');

        if (!polaroidCanvas || !polaroidNome || !polaroidDesc) return;

        polaroidNome.innerText = selo.nome;

        const isUnlocked = this.inventario[selo.id];

        if (isUnlocked) {
            const player = this.game.player;
            const isEquipped = (player.cor === selo.cor && player.morfologia === selo.morfologia && player.chapeuEquipado === selo.chapeu);

            const equipBtnHtml = isEquipped
                ? `<button class="btn-equip-album equipped" disabled>Equipado ✓</button>`
                : `<button class="btn-equip-album" id="btn-equip-preset">Equipar Jabuli</button>`;

            polaroidDesc.innerHTML = `
                <b>Criador:</b> ${selo.criador}<br>
                <b>Inspiração:</b> "${selo.insp}"<br>
                <span style="color: #81b29a; font-weight: bold;">🔓 Resgatado!</span>
                ${equipBtnHtml}
            `;

            // Evento do botão Equipar
            if (!isEquipped) {
                const btnEquip = document.getElementById('btn-equip-preset');
                if (btnEquip) {
                    btnEquip.addEventListener('click', () => {
                        this.equiparPreset(selo);
                    });
                }
            }

            const ctx = polaroidCanvas.getContext('2d');
            ctx.clearRect(0, 0, 120, 120);

            // Sombra
            ctx.fillStyle = "rgba(0,0,0,0.04)";
            ctx.beginPath();
            ctx.ellipse(60, 100, 24, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Gota
            ctx.fillStyle = selo.cor;
            ctx.beginPath();
            renderizarGeometriaGota(ctx, 60, 95, 24, selo.morfologia);
            ctx.fill();

            // Olhos
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(54, 76, 2.5, 0, Math.PI * 2);
            ctx.arc(66, 76, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Chapéu
            renderizarChapeuGenerico(ctx, 60, 95, selo.chapeu, selo.morfologia);
        } else {
            polaroidNome.innerText = "???";
            polaroidDesc.innerHTML = `
                <span style="color: #e07a5f; font-weight: bold;">🔒 Selo Bloqueado</span><br>
                Insira o código do seu brinquedo físico (ex: <b>${selo.codigo}</b>) na Casinha de Árvore para liberá-lo!
            `;
            const ctx = polaroidCanvas.getContext('2d');
            ctx.clearRect(0, 0, 120, 120);

            // Desenhar cadeado
            ctx.fillStyle = "#baa68a";
            ctx.font = "bold 40px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🔒", 60, 60);
        }
    }

    equiparPreset(p) {
        const player = this.game.player;
        player.cor = p.cor;
        player.morfologia = p.morfologia;
        player.chapeuEquipado = p.chapeu;
        player.nomePreset = p.nome;
        player.nome = p.nome;

        // Re-renderizar painéis
        this.selecionarSelo(p);
        this.renderizarGridSelos();
    }

    fecharJanela(id) {
        const menu = document.getElementById(`menu-${id}`);
        if (menu) menu.style.display = "none";
    }

    resgatarCodigo() {
        const input = document.getElementById('code-input');
        const status = document.getElementById('custom-status');
        const codigo = input.value.trim().toUpperCase();

        if (bancoCodigos[codigo]) {
            const data = bancoCodigos[codigo];
            if (this.bonecosAtivados[codigo]) {
                status.innerHTML = `<b style="color: #baa68a">Código já resgatado!</b>`;
                return;
            }
            this.bonecosAtivados[codigo] = true;
            this.inventario[data.id] = true; // Libera o Jabuli correspondente

            this.equiparPreset({
                id: data.id,
                nome: data.nome,
                cor: data.cor,
                morfologia: data.morfologia,
                chapeu: data.chapeu,
                criador: data.criador,
                insp: data.insp
            });

            status.innerHTML = `<b style="color: #81b29a">Código validado com sucesso!</b>`;
            input.value = "";

            const menuVitrine = document.getElementById('menu-vitrine');
            if (menuVitrine && menuVitrine.style.display === "flex") {
                this.renderizarGridSelos();
            }
        } else {
            status.innerHTML = `<b style="color: #e07a5f">Código não encontrado.</b>`;
        }
    }

    abrirLoreNPC(npc) {
        // Fechar outras janelas
        document.querySelectorAll('.game-menu').forEach(menu => {
            menu.style.display = "none";
        });

        const menuLore = document.getElementById('menu-lore');
        if (!menuLore) return;

        document.getElementById('lore-npc-name').innerText = npc.nome;
        document.getElementById('lore-npc-creator').innerText = "Ryan";
        
        let codeStr = "N/A";
        if (npc.id === "b1") codeStr = "BONECO-01";
        if (npc.id === "b2") codeStr = "BONECO-02";
        if (npc.id === "b3") codeStr = "BONECO-03";
        if (npc.id === "b4") codeStr = "BONECO-04";
        if (npc.id === "b5") codeStr = "BONECO-05";
        if (npc.id === "b6") codeStr = "BONECO-06";
        document.getElementById('lore-npc-code').innerText = codeStr;

        document.getElementById('lore-npc-insp').innerText = npc.desc || "Uma gota muito especial.";

        const comicContainer = document.getElementById('lore-npc-comic-container');
        comicContainer.innerHTML = this.obterTextoComic(npc.id);

        menuLore.style.display = "flex";

        const canvas = document.getElementById('canvasLoreNPC');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 60, 60);

            // Sombra
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.beginPath();
            ctx.ellipse(30, 52, 16, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Gota
            ctx.fillStyle = npc.cor;
            ctx.beginPath();
            renderizarGeometriaGota(ctx, 30, 48, 12, npc.morfologia);
            ctx.fill();
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Olhos
            let olhoY = 48 - 10;
            if (npc.morfologia === "longa") olhoY = 48 - 12;
            if (npc.morfologia === "gorda") olhoY = 48 - 8;
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(27, olhoY, 1.5, 0, Math.PI * 2);
            ctx.arc(33, olhoY, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Chapéu
            renderizarChapeuGenerico(ctx, 30, 48, npc.chapeu, npc.morfologia);
        }
    }

    obterTextoComic(npcId) {
        const stories = {
            b1: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: ⛰️ O Vento do Agreste</div>
                    <div class="comic-text">O vento soprava forte sobre as montanhas de Pernambuco. Serrano abre seu guarda-chuva e começa a flutuar graciosamente!</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: 🍊 A Colheita Doce</div>
                    <div class="comic-text">No alto de uma colina, ele avista um cacho de pitangas maduras: "Isso vai fazer um ótimo suco para o lanche!"</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: ☕ Encontro Cozy</div>
                    <div class="comic-text">Serrano compartilha suas pitangas na casinha de árvore. "A tecnologia solarpunk é ótima, mas compartilhar com amigos é melhor ainda!"</div>
                </div>
            `,
            b2: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: 🥁 O Baque do Corão</div>
                    <div class="comic-text">O som do tambor ecoa no Mundo Aberto. Maracatu dança no ritmo do Baque Solto, agitando o ar!</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: 🌱 Sintonizando a Horta</div>
                    <div class="comic-text">O ritmo da dança ressoa no solo. Os brotos de tomate na horta começam a crescer visivelmente mais rápidos e saudáveis!</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: 🌸 Festival de Cores</div>
                    <div class="comic-text">Flores coloridas se abrem ao redor de Maracatu: "A música é o adubo natural do nosso mundo!"</div>
                </div>
            `,
            b3: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: 🔺 Captador Solar</div>
                    <div class="comic-text">Devo caminha sobre a ponte de madeira. Seu chapéu piramidal brilha intensamente sob a luz do meio-dia.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: ⚡ Energia no Jardim</div>
                    <div class="comic-text">Ele conecta sua energia solar acumulada aos robozinhos limpadores do pátio: "Todos os sistemas limpos e operacionais!"</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: 🎵 Batida Silenciosa</div>
                    <div class="comic-text">Devo distribui fones de ouvido ecológicos para as gotinhas dançarem em uma festa silenciosa e sustentável.</div>
                </div>
            `,
            b4: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: 🐰 O Guardião do Lago</div>
                    <div class="comic-text">Frank nada pacientemente sob a ponte de madeira. Ele conhece todos os segredos do fundo da lagoa.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: Bridge Noturno</div>
                    <div class="comic-text">Frank usa cogumelos brilhantes para guiar as carpas perdidas de volta ao centro do lago à noite.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: 🌾 Semente da Sorte</div>
                    <div class="comic-text">Ele deixa uma semente mágica de vitória-régia na margem para quem encontrar seu código secreto.</div>
                </div>
            `,
            b5: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: 🎭 O Palco da Natureza</div>
                    <div class="comic-text">Colombina da Sombra sobe em uma pedra perto do lago e recita poesias dramáticas para o vento.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: 🌧️ Efeito Chuva</div>
                    <div class="comic-text">As turbinas de vapor do prédio geram uma névoa fina, criando um holofote de arco-íris perfeito para a apresentação de Colombina.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: 👏 Aplausos Aquáticos</div>
                    <div class="comic-text">As carpas koi sobem à superfície e batem suas caudas em aprovação ao show poético!</div>
                </div>
            `,
            b6: `
                <div class="comic-panel">
                    <div class="comic-title">Quadro 1: ⚡ Queda Estelar</div>
                    <div class="comic-text">Ziggy Star desce em um feixe de luz azul e pousa no Mundo Aberto. Ele veio diretamente do espaço!</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 2: 🌀 Magnetismo Sustentável</div>
                    <div class="comic-text">Ziggy ajuda a alinhar as engrenagens da mesa solarpunk com seus raios cósmicos de energia azul.</div>
                </div>
                <div class="comic-panel">
                    <div class="comic-title">Quadro 3: 🌌 Olhar no Horizonte</div>
                    <div class="comic-text">Olhando para as estrelas, ele sorri: "A Terra Solarpunk é a colônia mais bonita do universo."</div>
                </div>
            `
        };
        return stories[npcId] || `<p class="comic-text">Nenhuma história registrada para este Jabuli.</p>`;
    }

    enviarMensagem() {
        const input = document.getElementById('chat-input');
        if (!input || input.value.trim() === "") return;
        this.game.player.enviarMensagem(input.value);
        input.value = "";
    }
}
