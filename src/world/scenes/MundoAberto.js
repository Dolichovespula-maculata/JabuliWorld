/**
 * @file MundoAberto.js
 * @description Dados de cena do Mundo Aberto (São Paulo fantástico).
 *
 * ─── COMO EDITAR ESTE CENÁRIO ────────────────────────────────────────────────
 *
 * • Tamanho do mapa:   MUNDO_ABERTO_WIDTH / MUNDO_ABERTO_HEIGHT
 *
 * • Biomas (minimap):  edite BIOMAS_MA
 *   Cada bioma tem { id, x, w, color, label }
 *   x  = posição inicial em X no mundo
 *   w  = largura do bioma em pixels de mundo
 *
 * • Adicionar árvore:  empurre em ARVORES_MA
 *   Ex: { x: 500, y: 800, s: 1.1, tipo: 'yellowIpe' }
 *   Tipos: 'tree' | 'enchantedTree' | 'yellowIpe' | 'pinkIpe'
 *
 * • Adicionar landmark (prédio/monumento): empurre em LANDMARKS_MA
 *   Ex: { tipo: 'masp', x: 3450, y: 1350 }
 *   Tipos disponíveis: ver lista abaixo em LANDMARKS_MA
 *
 * • Adicionar arbusto: empurre em ARBUSTOS_MA
 *
 * • Adicionar cogumelo: empurre em COGUMELOS_MA
 *   { x, y, r, cor, phase }
 *
 * • Rio (Marginal Pinheiros): edite CONFIGURACAO_RIO
 *
 * • Pontes: edite PONTES_MA
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Dimensões do mapa ────────────────────────────────────────────────────────
export const MUNDO_ABERTO_WIDTH  = 5600;
export const MUNDO_ABERTO_HEIGHT = 3200;

// ─── Biomas (usados no minimap e para referência de posicionamento) ────────────
export const BIOMAS_MA = [
    { id: 'entrada',   x:    0, w:  900, color: '#4f772d', label: 'Parque Ibirapuera' },
    { id: 'bosque',    x:  900, w:  800, color: '#f72585', label: 'Vila Madalena'     },
    { id: 'cogumelos', x: 1700, w:  700, color: '#e63946', label: 'Liberdade'         },
    { id: 'rio',       x: 2400, w:  800, color: '#457b9d', label: 'Marginal Pinheiros'},
    { id: 'cidade',    x: 3200, w: 1200, color: '#5c677d', label: 'Avenida Paulista'  },
    { id: 'plato',     x: 4400, w: 1200, color: '#d8a48f', label: 'Pico do Jaraguá'  },
];

// ─── Árvores ──────────────────────────────────────────────────────────────────
// Formato: { x, y, s, tipo }
export const ARVORES_MA = [
    // ── Parque Ibirapuera ──────────────────────────────────────────────────────
    { x:  180, y:  600, s: 1.10, tipo: 'yellowIpe' },
    { x:  320, y: 1100, s: 1.20, tipo: 'yellowIpe' },
    { x:  680, y:  850, s: 1.15, tipo: 'yellowIpe' },
    { x:  220, y: 2200, s: 1.10, tipo: 'yellowIpe' },
    { x:  150, y: 1000, s: 1.20, tipo: 'pinkIpe'   },
    { x:  480, y: 2300, s: 1.30, tipo: 'pinkIpe'   },
    { x:  780, y: 1050, s: 1.25, tipo: 'pinkIpe'   },

    // ── Vila Madalena ──────────────────────────────────────────────────────────
    { x:  980, y:  850, s: 1.00, tipo: 'enchantedTree' },
    { x: 1150, y: 2350, s: 1.10, tipo: 'enchantedTree' },
    { x: 1380, y:  750, s: 1.05, tipo: 'enchantedTree' },
    { x: 1550, y: 2150, s: 1.15, tipo: 'enchantedTree' },

    // ── Liberdade ─────────────────────────────────────────────────────────────
    { x: 1750, y:  950, s: 1.10, tipo: 'pinkIpe' },
    { x: 1950, y: 2300, s: 1.20, tipo: 'pinkIpe' },
    { x: 2250, y: 1050, s: 1.15, tipo: 'pinkIpe' },
    { x: 2350, y: 2400, s: 1.20, tipo: 'pinkIpe' },

    // ── Marginal Pinheiros (margens do rio) ────────────────────────────────────
    { x: 2520, y:  600, s: 0.95, tipo: 'tree' },
    { x: 2510, y: 1100, s: 0.90, tipo: 'tree' },
    { x: 2530, y: 2100, s: 0.95, tipo: 'tree' },
    { x: 2500, y: 2600, s: 0.90, tipo: 'tree' },
    { x: 2980, y:  700, s: 0.95, tipo: 'tree' },
    { x: 2990, y: 1200, s: 0.90, tipo: 'tree' },
    { x: 2970, y: 2200, s: 0.95, tipo: 'tree' },
    { x: 3010, y: 2700, s: 0.90, tipo: 'tree' },

    // ── Avenida Paulista (canteiros centrais) ──────────────────────────────────
    { x: 3350, y: 1450, s: 1.00, tipo: 'tree' },
    { x: 3350, y: 1750, s: 1.00, tipo: 'tree' },
    { x: 3500, y: 1450, s: 1.00, tipo: 'tree' },
    { x: 3500, y: 1750, s: 1.00, tipo: 'tree' },
    { x: 4150, y: 1450, s: 1.00, tipo: 'tree' },
    { x: 4150, y: 1750, s: 1.00, tipo: 'tree' },

    // ── Pico do Jaraguá ────────────────────────────────────────────────────────
    { x: 4550, y:  900, s: 1.00, tipo: 'tree' },
    { x: 4750, y: 2200, s: 1.10, tipo: 'tree' },
    { x: 5100, y:  850, s: 1.05, tipo: 'tree' },
    { x: 5350, y: 2300, s: 1.15, tipo: 'tree' },
    { x: 5500, y: 1000, s: 1.00, tipo: 'tree' },
];

// ─── Árvores de borda (geradas por loop — não mude sem entender o impacto) ────
export function gerarArvoresBorda() {
    const arvores = [];
    for (let tx = 0; tx <= MUNDO_ABERTO_WIDTH; tx += 450) {
        arvores.push({ x: tx, y: 70, s: 0.65, tipo: 'tree' });
        arvores.push({ x: tx, y: MUNDO_ABERTO_HEIGHT - 70, s: 0.65, tipo: 'tree' });
    }
    return arvores;
}

// ─── Arbustos ─────────────────────────────────────────────────────────────────
// Junto aos canteiros da Paulista
export const ARBUSTOS_MA = [
    { x: 3350, y: 1530, s: 0.72 },
    { x: 3500, y: 1530, s: 0.72 },
    { x: 4150, y: 1530, s: 0.72 },
    { x: 3350, y: 1670, s: 0.72 },
    { x: 3500, y: 1670, s: 0.72 },
    { x: 4150, y: 1670, s: 0.72 },
];

// ─── Cogumelos luminosos (Liberdade) ──────────────────────────────────────────
// Formato: { x, y, r, cor, phase }
export const COGUMELOS_MA = [
    { x: 1900, y: 1200, r: 16, cor: '#e63946', phase: 0 },
    { x: 2200, y: 1300, r: 18, cor: '#e63946', phase: 1 },
    { x: 1800, y: 2100, r: 15, cor: '#e63946', phase: 2 },
];

// ─── Landmarks (prédios/monumentos) ───────────────────────────────────────────
// Formato: { tipo, x, y }
// Tipos disponíveis (ver BuildingRenderer.js para os draw*):
//   'auditorioIbirapuera' | 'obelisco' | 'monumentoBandeiras'
//   'toriiGate' | 'temploOriental'
//   'catedralDaSe' | 'masp' | 'fiesp' | 'copan' | 'edificioItalia'
//   'jaraguaAntenna' | 'graffitiWall' | 'liberdadeLamp'
//   'giantMushroomHouse' | 'observatoryDome' | 'telescope'
export const LANDMARKS_MA = [
    // ── Parque Ibirapuera ──────────────────────────────────────────────────────
    { tipo: 'obelisco',             x:  250, y: 1400 },
    { tipo: 'auditorioIbirapuera',  x:  550, y:  700 },
    { tipo: 'monumentoBandeiras',   x:  750, y: 2000 },

    // ── Liberdade ─────────────────────────────────────────────────────────────
    { tipo: 'temploOriental',       x: 2000, y: 1100 },
    { tipo: 'toriiGate',            x: 1850, y: 1600 },
    { tipo: 'toriiGate',            x: 2150, y: 1600 },

    // ── Marginal Pinheiros ────────────────────────────────────────────────────
    { tipo: 'catedralDaSe',         x: 3100, y:  800 },

    // ── Avenida Paulista ──────────────────────────────────────────────────────
    { tipo: 'masp',                 x: 3450, y: 1350 },
    { tipo: 'fiesp',                x: 3700, y: 1200 },
    { tipo: 'copan',                x: 3950, y: 1250 },
    { tipo: 'edificioItalia',       x: 4250, y: 1300 },

    // ── Pico do Jaraguá ────────────────────────────────────────────────────────
    { tipo: 'jaraguaAntenna',       x: 4600, y:  750 },
    { tipo: 'jaraguaAntenna',       x: 4800, y:  700 },
    { tipo: 'jaraguaAntenna',       x: 5200, y:  730 },
];

// ─── Rio (Marginal Pinheiros) ──────────────────────────────────────────────────
export const CONFIGURACAO_RIO = {
    centroX: 2750,
    largura:  250,
    // Faixa de colisão do jogador (para nadar):
    colisaoMinX: 2610,
    colisaoMaxX: 2890,
};

// ─── Pontes ───────────────────────────────────────────────────────────────────
// Formato: { x0, x1, y, altura, isEstaiada }
export const PONTES_MA = [
    // Ponte Estaiada sobre o Rio (Marginal Pinheiros)
    { x0: 2200, x1: 3300, y: 1600, altura: 100, isEstaiada: true },
    // Ponte de entrada (conecta à Ilha Inicial)
    { x0: 0,    x1: 420,  y: 1600, altura: 100, isEstaiada: false },
];

// ─── Trigger de retorno para a Ilha Inicial ───────────────────────────────────
export const TRIGGER_RETORNO = { maxX: 50, minY: 1550, maxY: 1650 };

// ─── Quantidade de tufos de grama ─────────────────────────────────────────────
export const QTD_TUFOS_GRAMA_MA = 480;

// ─── Quantidade de nuvens (sombras no chão) ────────────────────────────────────
export const QTD_NUVENS_MA = 6;
