/**
 * @file constants.js
 * @description Utilitários de sprite e configuração de mapas.
 *
 * Os dados de personagens estão em:  src/data/characters.js
 * Os dados de estruturas estão em:   src/data/items.js
 *
 * Este arquivo é responsável por:
 *   - Carregar e cachear imagens de sprites (lazy-loading)
 *   - Detectar bounding box de imagens transparentes
 *   - Re-exportar o bancoCodigos no formato legado (para UIManager.js)
 */

import { PERSONAGENS, gerarSpriteMapLegado, gerarBancoCodigosLegado } from './data/characters.js';

// ─── Re-exportações legadas ────────────────────────────────────────────────────
// Mantidas para compatibilidade com UIManager.js sem necessidade de editar aquele arquivo.
export const bancoCodigos = gerarBancoCodigosLegado();

// ─── Configuração de mapas (referência rápida para nomes/cores de solo) ────────
export const configuracaoMapas = {
    "meu_jardim":   { solo: "#a2d2ff", grama: "#d3f39c", nome: "Ilha Inicial"   },
    "mundo_aberto": { solo: "#a2d2ff", grama: "#d3f39c", nome: "Mundo Aberto"  }
};

// ─── Cache de sprites carregados ─────────────────────────────────────────────
const loadedSprites = {};

// Gera o mapa de sprites a partir dos dados de personagens centralizados
const SPRITE_MAP = gerarSpriteMapLegado();

/**
 * Retorna o objeto { image, config } para o preset fornecido.
 * Se a imagem ainda não foi carregada, inicia o carregamento (lazy-loading).
 *
 * @param {string} nomePreset - Nome do preset (ex: "Jabuli Clássico")
 * @returns {{ image: HTMLImageElement, config: object } | null}
 */
export function obterSprite(nomePreset) {
    if (!nomePreset) return null;
    if (loadedSprites[nomePreset]) return loadedSprites[nomePreset];

    const config = SPRITE_MAP[nomePreset];
    if (config && config.caminhoImagem) {
        const img = new Image();
        img.src = config.caminhoImagem;

        const spriteObj = {
            image: img,
            config: {
                ...config,
                sx: (config.larguraTotalImagem - config.larguraJabuli) / 2,
                sy: (config.alturaTotalImagem  - config.alturaJabuli)  / 2,
            }
        };

        img.onload = () => {
            const bounds = detectarLimitesImagem(img);
            spriteObj.config.larguraTotalImagem = img.naturalWidth;
            spriteObj.config.alturaTotalImagem  = img.naturalHeight;
            spriteObj.config.larguraJabuli = bounds.sw;
            spriteObj.config.alturaJabuli  = bounds.sh;
            spriteObj.config.sx = bounds.sx;
            spriteObj.config.sy = bounds.sy;
        };

        loadedSprites[nomePreset] = spriteObj;
        return spriteObj;
    }
    return null;
}

/**
 * Alias de obterSprite. O parâmetro corHex é mantido por compatibilidade de assinatura
 * com o código existente, mas não é mais utilizado (sprites não são re-coloridas).
 *
 * @param {string} nomePreset
 * @param {string} corHex - Ignorado; mantido por compatibilidade
 */
export function obterSpriteTintada(nomePreset, corHex) {
    if (!nomePreset) return null;
    return obterSprite(nomePreset) || obterSprite("Jabuli Clássico");
}

/**
 * Analisa a imagem e retorna o retângulo envolvente (bounding box) dos pixels
 * visíveis (não transparentes), com padding de 2px de segurança.
 *
 * @param {HTMLImageElement} img
 * @returns {{ sx: number, sy: number, sw: number, sh: number }}
 */
function detectarLimitesImagem(img) {
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth  || img.width  || 400;
    canvas.height = img.naturalHeight || img.height || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let imgData;
    try {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
        return { sx: (canvas.width - 240) / 2, sy: (canvas.height - 280) / 2, sw: 240, sh: 280 };
    }

    const data = imgData.data;
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 5) {
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX < minX || maxY < minY) {
        return { sx: (canvas.width - 240) / 2, sy: (canvas.height - 280) / 2, sw: 240, sh: 280 };
    }

    return {
        sx: Math.max(0, minX - 2),
        sy: Math.max(0, minY - 2),
        sw: Math.min(canvas.width,  maxX + 2) - Math.max(0, minX - 2),
        sh: Math.min(canvas.height, maxY + 2) - Math.max(0, minY - 2),
    };
}
