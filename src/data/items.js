/**
 * @file items.js
 * @description Registro de estruturas interativas do jogo (objetos clicáveis no cenário).
 *
 * ─── COMO ADICIONAR UMA NOVA ESTRUTURA ───────────────────────────────────────
 *
 * 1. Adicione uma entrada no array ESTRUTURAS_PADRAO:
 *
 *    {
 *      id:   "minhaEstrutura",  // ID único, usado nos listeners de evento
 *      x:    1300,              // Posição X inicial (pode ser sobrescrita por Game.js)
 *      y:    900,               // Posição Y inicial
 *      tipo: "terminal",        // Tipo visual: "terminal" | "mesa" | "loja" | "custom" | "arvore"
 *      nome: "Minha Estrutura", // Nome exibido acima da estrutura no jogo
 *      raio: 75,                // Raio de colisão/interação em pixels
 *    }
 *
 * 2. Para que a estrutura abra um menu ao interagir, edite em Game.js:
 *    - setupCanvasClickListener()  — clique do mouse
 *    - interagirProximidade()      — tecla E
 *    - atualizar() > colisões      — colisão física
 *
 * 3. Para adicionar um novo TIPO VISUAL de estrutura, edite:
 *    src/entities/Structure.js > drawGeometry()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Structure } from '../entities/Structure.js';

/**
 * Estruturas padrão que aparecem na Ilha Inicial (Meu Jardim).
 * As posições x/y podem ser sobrescritas em Game.js após instanciação.
 */
export const ESTRUTURAS_PADRAO = [
    new Structure(
        "customizadora",   // id
        1300,              // x (ajustado em Game.js)
        900,               // y (ajustado em Game.js)
        "terminal",        // tipo visual
        "Terminal de Resgate", // nome exibido
        75                 // raio de colisão
    ),
    new Structure(
        "mesaSolar",       // id
        1300,              // x (ajustado em Game.js)
        1400,              // y (ajustado em Game.js)
        "mesa",            // tipo visual
        "Mesa do Álbum",   // nome exibido
        70                 // raio de colisão
    ),
];
