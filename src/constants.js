export const configuracaoMapas = {
    "meu_jardim":   { solo: "#a2d2ff", grama: "#d3f39c", nome: "Pátio Solarpunk" },
    "mundo_aberto": { solo: "#a2d2ff", grama: "#d3f39c", nome: "Mundo Aberto" }
};

export const bancoCodigos = {
    "CLASSICO": { id: "default", set: "classico", morfologia: "normal", chapeu: null, nome: "Jabuli Clássico", cor: "#d94141", criador: "Ryan", insp: "O Jabuli clássico e amigável.", icon: "🔴" },
    "BONECO-01": { id: "b1", set: "serrano", morfologia: "longa", chapeu: "gardachuva", nome: "Jabuli Serrano", cor: "#8338ec", criador: "Ryan", insp: "Clima serrano do agreste.", icon: "☂️" },
    "BONECO-02": { id: "b2", set: "maracatu", morfologia: "gorda", chapeu: "caboclo", nome: "Gota Maracatu", cor: "#ff006e", criador: "Ryan", insp: "Baque Solto pernambucano.", icon: "🪓" },
    "BONECO-03": { id: "b3", set: "devo", morfologia: "normal", chapeu: "devo", nome: "Jabuli Devo", cor: "#e76f51", criador: "Ryan", insp: "Energia limpa e eletrônica.", icon: "🔺" },
    "BONECO-04": { id: "b4", set: "frank", morfologia: "longa", chapeu: "darko", nome: "Máscara Frank", cor: "#5a4a42", criador: "Ryan", insp: "Mistérios do agreste.", icon: "🐰" },
    "BONECO-05": { id: "b5", set: "colombina", morfologia: "normal", chapeu: "colombina", nome: "Colombina da Sombra", cor: "#ffffff", criador: "Ryan", insp: "Teatro de rua veneziano.", icon: "🎭" },
    "BONECO-06": { id: "b6", set: "ziggy", morfologia: "gorda", chapeu: "bowie", nome: "Ziggy Star", cor: "#ff5500", criador: "Ryan", insp: "Uma estrela vinda do espaço.", icon: "⚡" },
    "BONECO-07": { id: "b7", set: "cogumelo", morfologia: "gorda", chapeu: "cogumelo", nome: "Jabuli Cogumelo", cor: "#c44b2e", criador: "Ryan", insp: "Nascido das profundezas do bosque encantado. Fala com os esporos.", icon: "🍄" }
};

// MAPA DE SPRITES CONFIGURÁVEIS PARA OS JABULIS
export const SPRITE_MAP = {
    "Jabuli Clássico": {
        caminhoImagem: "media/jabuli/jabuli_commom-type1.png",
        
        // Dimensões originais da imagem (400x400)
        larguraTotalImagem: 400,
        alturaTotalImagem: 400,
        
        // Área onde o Jabuli está centralizado dentro da imagem (240x280)
        larguraJabuli: 240,
        alturaJabuli: 280,
        
        // Tamanho final que o Jabuli será desenhado na tela
        larguraDesenho: 50,
        alturaDesenho: 58
    }
    // Você pode adicionar novas sprites para outros presets aqui seguindo o mesmo padrão!
};

const loadedSprites = {};

/**
 * Retorna o objeto contendo a imagem carregada e sua configuração para o preset fornecido.
 * Se a imagem ainda não foi instanciada, ela é carregada sob demanda (lazy-loading).
 * @param {string} nomePreset - O nome do preset do Jabuli (ex: "Jabuli Clássico")
 * @returns {{image: HTMLImageElement, config: object} | null}
 */
export function obterSprite(nomePreset) {
    if (!nomePreset) return null;
    if (loadedSprites[nomePreset]) {
        return loadedSprites[nomePreset];
    }
    
    const config = SPRITE_MAP[nomePreset];
    if (config && config.caminhoImagem) {
        const img = new Image();
        img.src = config.caminhoImagem;
        loadedSprites[nomePreset] = {
            image: img,
            config: config
        };
        return loadedSprites[nomePreset];
    }
    return null;
}

const spriteCache = {};

/**
 * Retorna uma versão colorida dinamicamente da sprite do Jabuli para o preset e cor fornecidos.
 * Preserva texturas, sombras e olhos pretos usando composite 'color'.
 * @param {string} nomePreset - Nome do preset
 * @param {string} corHex - Cor de destino (ex: "#8338ec")
 */
export function obterSpriteTintada(nomePreset, corHex) {
    if (!nomePreset) return null;
    const cacheKey = `${nomePreset}_${corHex}`;
    if (spriteCache[cacheKey]) {
        return spriteCache[cacheKey];
    }

    // Tentar obter sprite específica do preset ou cair de volta na clássica
    let config = SPRITE_MAP[nomePreset];
    let baseImgObj = null;

    if (config) {
        baseImgObj = obterSprite(nomePreset);
    } else {
        // Fallback: usar a clássica (vermelha) como base para tint
        config = SPRITE_MAP["Jabuli Clássico"];
        baseImgObj = obterSprite("Jabuli Clássico");
    }

    if (!baseImgObj || !baseImgObj.image.complete || baseImgObj.image.naturalWidth === 0) {
        return null; // Não carregado ainda
    }

    const baseImg = baseImgObj.image;
    
    // Canvas 1: Desenha a silhueta preenchida com a cor sólida
    const canvasTint = document.createElement('canvas');
    canvasTint.width = baseImg.naturalWidth;
    canvasTint.height = baseImg.naturalHeight;
    const ctxTint = canvasTint.getContext('2d');

    ctxTint.drawImage(baseImg, 0, 0);
    ctxTint.globalCompositeOperation = 'source-in';
    ctxTint.fillStyle = corHex;
    ctxTint.fillRect(0, 0, canvasTint.width, canvasTint.height);

    // Canvas 2: Combina a imagem original com o preenchimento de cor usando 'color'
    const canvasRes = document.createElement('canvas');
    canvasRes.width = baseImg.naturalWidth;
    canvasRes.height = baseImg.naturalHeight;
    const ctxRes = canvasRes.getContext('2d');

    ctxRes.drawImage(baseImg, 0, 0);
    ctxRes.globalCompositeOperation = 'color';
    ctxRes.drawImage(canvasTint, 0, 0);

    spriteCache[cacheKey] = {
        image: canvasRes,
        config: config
    };

    return spriteCache[cacheKey];
}


