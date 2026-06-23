/**
 * @file MeuJardim.js
 * @description Dados de cena da Ilha Inicial (Meu Jardim).
 *
 * ─── COMO EDITAR ESTE CENÁRIO ────────────────────────────────────────────────
 *
 * • Tamanho do mapa:   MEU_JARDIM_WIDTH / MEU_JARDIM_HEIGHT
 * • Adicionar árvore:  empurre um objeto em ARVORES_MJ
 *   Ex:  { x: 1200, y: 500, s: 1.0, tipo: 'tree' }
 *
 * • Adicionar arbusto: empurre em ARBUSTOS_MJ
 *   Ex:  { x: 1100, y: 700, s: 0.75 }
 *
 * • Tipos de árvore disponíveis:
 *   'tree'          — Árvore solarpunk padrão (verde-água)
 *   'enchantedTree' — Árvore encantada com brilho pulsante
 *   'yellowIpe'     — Ipê Amarelo
 *   'pinkIpe'       — Ipê Rosa
 *
 * • Nuvens (sombras no chão): edite NUVENS_MJ
 *   São geradas automaticamente no World.js caso o array esteja vazio.
 *
 * • Torres solarpunk: edite TORRES_SOLARPUNK_MJ
 *   { x, y, s } — s é a escala (0 a 1)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Dimensões do mapa ────────────────────────────────────────────────────────
export const MEU_JARDIM_WIDTH  = 2600;
export const MEU_JARDIM_HEIGHT = 1900;

// ─── Ilha: geometria da elipse ────────────────────────────────────────────────
// A ilha é uma elipse centrada em (1300, 960) com raios (1080, 775).
// O jogador não pode sair dessa área (verificado em Game.js).
export const ILHA_CENTRO_X = 1300;
export const ILHA_CENTRO_Y = 960;
export const ILHA_RAIO_X   = 1080;
export const ILHA_RAIO_Y   = 775;

// ─── Árvores ──────────────────────────────────────────────────────────────────
// Formato: { x, y, s, tipo }
// (array vazio = sem árvores manuais; serão geradas automaticamente se desejar)
export const ARVORES_MJ = [
    // Nenhuma árvore manual na ilha inicial — a vegetação é composta de arbustos
];

// ─── Arbustos ─────────────────────────────────────────────────────────────────
// Caminho de hedge entre a praça e a Customizadora (Norte)
export const ARBUSTOS_MJ = [];
(function gerarArbustosMJ() {
    for (let py = 700; py <= 900; py += 70) {
        ARBUSTOS_MJ.push({ x: 1100, y: py, s: 0.75 });
        ARBUSTOS_MJ.push({ x: 1500, y: py, s: 0.75 });
    }
})();

// ─── Tufos de grama ───────────────────────────────────────────────────────────
// Gerados proceduralmente dentro da ellipse da ilha.
// Quantidade e seed podem ser ajustados abaixo:
export const QTD_TUFOS_GRAMA_MJ = 200;

// ─── Nuvens (sombras no chão) ─────────────────────────────────────────────────
export const QTD_NUVENS_MJ = 12;

// ─── Torres Solarpunk ─────────────────────────────────────────────────────────
export const TORRES_SOLARPUNK_MJ = [
    { x:  500, y: 400, s: 0.50 },
    { x: 1300, y: 320, s: 0.85 },
    { x: 2100, y: 400, s: 0.48 },
];

// ─── Ponte de Saída (para o Mundo Aberto) ─────────────────────────────────────
// A ponte vai de x=2300 até x=2600 (borda direita do mapa), centrada em y=1200
export const PONTE_SAIDA = { x0: 2300, x1: 2600, y: 1200, altura: 120 };

// ─── Zona de transição de mapa ────────────────────────────────────────────────
// Quando o jogador passa desta coordenada X, vai para o Mundo Aberto
export const TRIGGER_SAIDA_X = MEU_JARDIM_WIDTH - 80;
