/**
 * @file characters.js
 * @description Registro central de todos os personagens Jabuli do jogo.
 *
 * ─── COMO ADICIONAR UM NOVO PERSONAGEM ────────────────────────────────────
 *
 * 1. Coloque a imagem PNG do sprite em:  media/jabuli/SeuNomeAqui.png
 *
 * 2. Adicione uma entrada neste objeto PERSONAGENS com uma chave de código:
 *
 *    "MEU-CODIGO": {
 *      // ── Identidade ────────────────────────────────────────────────────
 *      id:         "meuId",          // ID único interno (sem espaços)
 *      set:        "meuSet",         // Conjunto de sprites (pode ser igual ao id)
 *      morfologia: "normal",         // "normal" | "longa" | "gorda"
 *      nome:       "Meu Jabuli",     // Nome exibido no jogo
 *      cor:        "#ff0000",        // Cor de destaque (hex)
 *      criador:    "SeuNome",        // Nome do criador
 *      insp:       "Inspiração...",  // Texto de inspiração (curto)
 *      icon:       "🎨",             // Emoji de ícone
 *
 *      // ── Sprite ────────────────────────────────────────────────────────
 *      sprite: {
 *        path: "media/jabuli/SeuNomeAqui.png",
 *        // Deixe o restante em 400x400 — o sistema detecta automaticamente
 *        larguraTotalImagem: 400,
 *        alturaTotalImagem:  400,
 *        larguraJabuli:      240,
 *        alturaJabuli:       280,
 *        fatorSombraW:       0.44,
 *        fatorSombraH:       0.08,
 *        offsetSombraY:      -3
 *      },
 *
 *      // ── NPC no Mundo Aberto (null = só jogável, não aparece como NPC) ──
 *      npc: {
 *        zona:          "Nome da Zona",   // Zona/bioma onde aparece
 *        x:             1000,             // Posição X no mundo
 *        y:             1500,             // Posição Y no mundo
 *        desc:          "Descrição...",   // Texto do card de lore
 *        comportamento: "meuSet",         // ID do comportamento (ver NPC.js)
 *        emojis:        ['🎨','✨'],       // Emojis de fala aleatórios
 *        // Campos opcionais:
 *        dir:           1,               // Direção inicial: 1 = direita, -1 = esquerda
 *        noLago:        false,           // true = o NPC fica dentro d'água
 *      }
 *    }
 *
 * 3. Para que o NPC se mova, adicione o comportamento em: src/entities/NPC.js
 *    (método update, case "meuSet")
 *
 * 4. Para que apareça na Vitrine do álbum, ele já é registrado automaticamente!
 * ────────────────────────────────────────────────────────────────────────────
 */

export const PERSONAGENS = {
    // ─── Jabuli Clássico ───────────────────────────────────────────────────────
    "CLASSICO": {
        id: "default", set: "classico", morfologia: "normal",
        nome: "Jabuli Clássico", cor: "#d94141",
        criador: "Ryan", insp: "O Jabuli clássico e amigável.", icon: "🔴",
        sprite: {
            path: "media/jabuli/jabuli_commom-type1.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: null // Jabuli Clássico é apenas jogável
    },

    // ─── Jabuli Serrano ────────────────────────────────────────────────────────
    "BONECO-01": {
        id: "b1", set: "serrano", morfologia: "longa",
        chapeu: "gardachuva",
        nome: "Jabuli Serrano", cor: "#8338ec",
        criador: "Ryan", insp: "Clima serrano do agreste.", icon: "☂️",
        sprite: {
            path: "media/jabuli/JabuliEBA1.1.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.34, fatorSombraH: 0.06, offsetSombraY: -4
        },
        npc: {
            zona: "Parque Ibirapuera",
            x: 440, y: 1980, dir: 1,
            desc: "Serrano cuida das plantações do prado. Ele diz que cada semente plantada com amor vira uma canção da terra.",
            comportamento: "serrano",
            emojis: ['🌾', '🍅', '🌱', '💧', '🌿']
        }
    },

    // ─── Gota Maracatu ────────────────────────────────────────────────────────
    "BONECO-02": {
        id: "b2", set: "maracatu", morfologia: "gorda",
        chapeu: "caboclo",
        nome: "Gota Maracatu", cor: "#ff006e",
        criador: "Ryan", insp: "Baque Solto pernambucano.", icon: "🪓",
        sprite: {
            path: "media/jabuli/JabuliEBA2.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.52, fatorSombraH: 0.09, offsetSombraY: -3
        },
        npc: {
            zona: "Vila Madalena",
            x: 1300, y: 1100,
            desc: "Maracatu dança entre as árvores encantadas do bosque. O ritmo mágico faz os cogumelos brilharem!",
            comportamento: "maracatu",
            emojis: ['🎵', '🥁', '♪', '🎶', '🌲']
        }
    },

    // ─── Jabuli Devo ──────────────────────────────────────────────────────────
    "BONECO-03": {
        id: "b3", set: "devo", morfologia: "normal",
        chapeu: "devo",
        nome: "Jabuli Devo", cor: "#e76f51",
        criador: "Ryan", insp: "Energia limpa e eletrônica.", icon: "🔺",
        sprite: {
            path: "media/jabuli/JabuliEBA3.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: {
            zona: "Marginal Pinheiros",
            x: 2520, y: 1200, dir: 1,
            desc: "Devo medita à beira da cachoeira, coletando energia dos íons da água. Ela diz que a chuva é o computador da natureza.",
            comportamento: "devo",
            emojis: ['⚡', '☀️', '🌊', '✨']
        }
    },

    // ─── Máscara Frank ────────────────────────────────────────────────────────
    "BONECO-04": {
        id: "b4", set: "frank", morfologia: "longa",
        chapeu: "darko",
        nome: "Máscara Frank", cor: "#5a4a42",
        criador: "Ryan", insp: "Mistérios do agreste.", icon: "🐰",
        sprite: {
            path: "media/jabuli/JabuliEBA4.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.36, fatorSombraH: 0.06, offsetSombraY: -4
        },
        npc: {
            zona: "Marginal Pinheiros",
            x: 2750, y: 1600,
            noLago: true,
            desc: "Frank nada no Grande Rio todas as manhãs. Ele diz que os peixes lhe contam segredos do mundo subaquático.",
            comportamento: "frank",
            emojis: ['🫧', '🐟', '🌊', '🐠']
        }
    },

    // ─── Colombina da Sombra ──────────────────────────────────────────────────
    "BONECO-05": {
        id: "b5", set: "colombina", morfologia: "normal",
        chapeu: "colombina",
        nome: "Colombina da Sombra", cor: "#ffffff",
        criador: "Ryan", insp: "Teatro de rua veneziano.", icon: "🎭",
        sprite: {
            path: "media/jabuli/JabuliEBA5.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: {
            zona: "Avenida Paulista",
            x: 3850, y: 1400,
            desc: "Colombina performa no calçadão da Avenida Paulista, recitando poesias dramáticas e contando histórias para qualquer Jabuli que queira ouvir.",
            comportamento: "colombina",
            emojis: ['✨', '🎭', '📜', '💫']
        }
    },

    // ─── Ziggy Star ───────────────────────────────────────────────────────────
    "BONECO-06": {
        id: "b6", set: "ziggy", morfologia: "gorda",
        chapeu: "bowie",
        nome: "Ziggy Star", cor: "#ff5500",
        criador: "Ryan", insp: "Uma estrela vinda do espaço.", icon: "⚡",
        sprite: {
            path: "media/jabuli/JabuliEBA6.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.48, fatorSombraH: 0.09, offsetSombraY: -3
        },
        npc: {
            zona: "Pico do Jaraguá",
            x: 5000, y: 870,
            angulo: 0, // campo de estado para órbita
            desc: "Ziggy usa o Observatório do Platô para mapear constelações. Cada estrela recebe um nome dela mesma.",
            comportamento: "ziggy",
            emojis: ['⭐', '🔭', '🌌', '💥']
        }
    },

    // ─── Jabuli Cogumelo ──────────────────────────────────────────────────────
    "BONECO-07": {
        id: "b7", set: "cogumelo", morfologia: "gorda",
        chapeu: "cogumelo",
        nome: "Jabuli Cogumelo", cor: "#c44b2e",
        criador: "Ryan", insp: "Nascido das profundezas do bosque encantado. Fala com os esporos.", icon: "🍄",
        sprite: {
            path: "media/jabuli/JabuliEBA7.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.54, fatorSombraH: 0.10, offsetSombraY: -3
        },
        npc: {
            zona: "Liberdade",
            x: 2050, y: 1060,
            desc: "Cogumelo é a guardiã dos anéis mágicos. Ela ouvia os esporos no vento e decifrava suas mensagens ancestrais.",
            comportamento: "cogumelo",
            emojis: ['🍄', '✨', '🌿', '💫', '🌙']
        }
    },

    // ─── EBAtoytoy ────────────────────────────────────────────────────────────
    "TOYTOY": {
        id: "toytoy", set: "toytoy", morfologia: "normal",
        nome: "EBAtoytoy", cor: "#4cc9f0",
        criador: "Ryan", insp: "Brinquedo e diversão pura.", icon: "🧸",
        sprite: {
            path: "media/jabuli/EBAtoytoy.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: {
            zona: "Parque Ibirapuera",
            x: 600, y: 800, dir: 1,
            desc: "Toytoy é pura energia infantil! Ele vive pulando perto do Auditório, testando a acústica do gramado com seus saltos acrobáticos.",
            comportamento: "toytoy",
            emojis: ['🧸', '🎈', '🍭', '🏃', '✨']
        }
    },

    // ─── EBAjpegfeio ──────────────────────────────────────────────────────────
    "JPEGFEIO": {
        id: "jpegfeio", set: "jpegfeio", morfologia: "longa",
        nome: "EBAjpegfeio", cor: "#8ac926",
        criador: "Ryan", insp: "Compactado e cheio de artefatos.", icon: "👾",
        sprite: {
            path: "media/jabuli/EBAjpegfeio.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: {
            zona: "Avenida Paulista",
            x: 4100, y: 1200,
            glitchTimer: 0, // campo de estado para glitch
            desc: "Jpegfeio é um Jabuli digital compactado com artefatos de imagem. Ele se move de forma espasmódica e cheia de glitches pelas calçadas cinzas da Paulista.",
            comportamento: "jpegfeio",
            emojis: ['👾', '💾', '💿', '🔌', '💻']
        }
    },

    // ─── EBAonirica ───────────────────────────────────────────────────────────
    "ONIRICA": {
        id: "onirica", set: "onirica", morfologia: "gorda",
        nome: "EBAonirica", cor: "#ff99c8",
        criador: "Ryan", insp: "Nascido dos sonhos mais profundos.", icon: "✨",
        sprite: {
            path: "media/jabuli/EBAonirica.png",
            larguraTotalImagem: 400, alturaTotalImagem: 400,
            larguraJabuli: 240, alturaJabuli: 280,
            fatorSombraW: 0.44, fatorSombraH: 0.08, offsetSombraY: -3
        },
        npc: {
            zona: "Pico do Jaraguá",
            x: 4800, y: 2000,
            baseX: 4800, baseY: 2000, // campos de estado para órbita
            desc: "Onírica flutua suavemente em órbitas infinitas no Pico do Jaraguá. Ela vive em um transe sonhador perpétuo, sussurrando segredos do mundo astral.",
            comportamento: "onirica",
            emojis: ['💤', '✨', '☁️', '🌙', '🔮']
        }
    }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Retorna array com todos os dados de personagem (para a Vitrine do álbum).
 * Inclui o código de desbloqueio em cada entrada.
 */
export function listarPersonagens() {
    return Object.entries(PERSONAGENS).map(([codigo, p]) => ({
        ...p,
        codigo,
        chapeu: p.chapeu || null
    }));
}

/**
 * Retorna apenas os personagens que têm dados de NPC (aparecem no Mundo Aberto).
 */
export function listarNPCs() {
    return Object.entries(PERSONAGENS)
        .filter(([, p]) => p.npc !== null)
        .map(([, p]) => p);
}

/**
 * Retorna o SPRITE_MAP no formato legado que constants.js/obterSprite() espera.
 * Isso permite que o sistema de sprites atual continue funcionando sem alterações.
 */
export function gerarSpriteMapLegado() {
    const map = {};
    for (const p of Object.values(PERSONAGENS)) {
        if (p.sprite && p.sprite.path) {
            map[p.nome] = {
                caminhoImagem:        p.sprite.path,
                larguraTotalImagem:   p.sprite.larguraTotalImagem,
                alturaTotalImagem:    p.sprite.alturaTotalImagem,
                larguraJabuli:        p.sprite.larguraJabuli,
                alturaJabuli:         p.sprite.alturaJabuli,
                larguraDesenho:       50,
                alturaDesenho:        58,
                fatorSombraW:         p.sprite.fatorSombraW,
                fatorSombraH:         p.sprite.fatorSombraH,
                offsetSombraY:        p.sprite.offsetSombraY
            };
        }
    }
    return map;
}

/**
 * Retorna o bancoCodigos no formato legado que UIManager.js espera.
 */
export function gerarBancoCodigosLegado() {
    const banco = {};
    for (const [codigo, p] of Object.entries(PERSONAGENS)) {
        banco[codigo] = {
            id:         p.id,
            set:        p.set,
            morfologia: p.morfologia,
            chapeu:     p.chapeu || null,
            nome:       p.nome,
            cor:        p.cor,
            criador:    p.criador,
            insp:       p.insp,
            icon:       p.icon || '⭐'
        };
    }
    return banco;
}
