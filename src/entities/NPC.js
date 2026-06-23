/**
 * @file NPC.js
 * @description Classe NPC — encapsula estado e comportamento de IA de cada personagem
 * no Mundo Aberto.
 *
 * ─── COMO ADICIONAR UM NOVO COMPORTAMENTO DE NPC ──────────────────────────────
 *
 * 1. Em src/data/characters.js, defina o campo npc.comportamento do personagem:
 *    comportamento: "meuComportamento"
 *
 * 2. Neste arquivo, adicione um método privado:
 *    _updateMeuComportamento(t) { ... }
 *    (t = Date.now())
 *
 * 3. No switch dentro de update(), adicione o case:
 *    case 'meuComportamento': this._updateMeuComportamento(t); break;
 *
 * Campos de estado que você pode usar dentro do NPC:
 *   this.x, this.y   — posição atual (você muda aqui)
 *   this.dir         — direção: 1 = direita, -1 = esquerda
 *   this.angulo      — ângulo de órbita (para comportamentos circulares)
 *   this.baseX, this.baseY  — ponto de ancoragem para órbitas
 *   this.noLago      — true = NPC está nadando
 *   this.textoFala   — emoji/texto no balão de fala
 *   this.timerFala   — countdown; quando > 0 o balão fica visível
 * ─────────────────────────────────────────────────────────────────────────────
 */

export class NPC {
    /**
     * @param {object} dados - Dados do personagem (de characters.js > npc + campos de identidade)
     */
    constructor(dados) {
        // ── Identidade ──────────────────────────────────────────────────────────
        this.id         = dados.id;
        this.set        = dados.set;
        this.nome       = dados.nome;
        this.cor        = dados.cor;
        this.morfologia = dados.morfologia || 'normal';
        this.chapeu     = dados.chapeu || null;

        // ── Posição e estado de IA ───────────────────────────────────────────────
        const npcData   = dados.npc;
        this.x          = npcData.x;
        this.y          = npcData.y;
        this.dir        = npcData.dir        !== undefined ? npcData.dir   : 1;
        this.noLago     = npcData.noLago     || false;
        this.angulo     = npcData.angulo     !== undefined ? npcData.angulo : 0;
        this.baseX      = npcData.baseX      !== undefined ? npcData.baseX  : npcData.x;
        this.baseY      = npcData.baseY      !== undefined ? npcData.baseY  : npcData.y;
        this.glitchTimer = npcData.glitchTimer !== undefined ? npcData.glitchTimer : 0;

        // ── Comportamento ────────────────────────────────────────────────────────
        this.atividade  = npcData.comportamento;
        this._emojis    = npcData.emojis || ['✨'];
        this.desc       = npcData.desc   || '';

        // ── Fala ─────────────────────────────────────────────────────────────────
        this.textoFala  = '';
        this.timerFala  = 0;
    }

    // ─── Tick de IA ─────────────────────────────────────────────────────────────
    update() {
        const t = Date.now();
        if (this.timerFala > 0) this.timerFala--;

        switch (this.atividade) {
            case 'serrano':    this._updateSerrano(t);    break;
            case 'maracatu':   this._updateMaracatu(t);   break;
            case 'cogumelo':   this._updateCogumelo(t);   break;
            case 'devo':       this._updateDevo(t);       break;
            case 'frank':      this._updateFrank(t);      break;
            case 'colombina':  this._updateColombina(t);  break;
            case 'ziggy':      this._updateZiggy(t);      break;
            case 'toytoy':     this._updateToytoy(t);     break;
            case 'jpegfeio':   this._updateJpegfeio(t);   break;
            case 'onirica':    this._updateOnirica(t);    break;
            default: break; // comportamento desconhecido — fica parado
        }
    }

    // ─── Fala aleatória ─────────────────────────────────────────────────────────
    _falarAcaso(probabilidade, duracao = 80) {
        if (Math.random() < probabilidade) {
            this.textoFala = this._emojis[Math.floor(Math.random() * this._emojis.length)];
            this.timerFala = duracao;
        }
    }

    // ─── Comportamentos individuais ─────────────────────────────────────────────

    /** Serrano: passeio lateral na Zona 1 */
    _updateSerrano(t) {
        this.x += this.dir * 0.5;
        if (this.x > 580) { this.x = 580; this.dir = -1; }
        if (this.x < 300) { this.x = 300; this.dir =  1; }
        this.y = 1980 + Math.sin(t / 400) * 5;
        this._falarAcaso(0.003, 90);
    }

    /** Maracatu: dança circular no Bosque */
    _updateMaracatu(t) {
        this.x = 1300 + Math.sin(t / 640) * 55;
        this.y = 1100 + Math.cos(t / 420) * 20;
        this._falarAcaso(0.004, 70);
    }

    /** Cogumelo: órbita lenta na Zona dos Cogumelos */
    _updateCogumelo(t) {
        this.x = 2050 + Math.sin(t / 820) * 42;
        this.y = 1060 + Math.cos(t / 550) * 18;
        this._falarAcaso(0.003, 85);
    }

    /** Devo: passeio lateral no Rio */
    _updateDevo(t) {
        this.x += this.dir * 0.6;
        if (this.x > 2680) { this.x = 2680; this.dir = -1; }
        if (this.x < 2380) { this.x = 2380; this.dir =  1; }
        this.y = 1200 + Math.sin(t / 380) * 4;
        this._falarAcaso(0.0025, 80);
    }

    /** Frank: nado elíptico no Rio */
    _updateFrank(t) {
        this.x = 2750 + Math.sin(t / 1100) * 240;
        this.y = 1600 + Math.cos(t / 1100) * 130;
        this.noLago = true;
        this._falarAcaso(0.002, 80);
    }

    /** Colombina: performance na calçada da Paulista */
    _updateColombina(t) {
        this.x = 3850 + Math.sin(t / 700) * 28;
        this.y = 1400 + Math.cos(t / 500) * 12;
        this._falarAcaso(0.002, 110);
    }

    /** Ziggy: órbita circular no Observatório */
    _updateZiggy() {
        this.angulo += 0.007;
        this.x = 5000 + Math.cos(this.angulo) * 72;
        this.y =  870 + Math.sin(this.angulo) * 32;
        this._falarAcaso(0.002, 90);
    }

    /** Toytoy: pulos saltitantes perto do Auditório */
    _updateToytoy(t) {
        this.x += this.dir * 1.5;
        if (this.x > 750) { this.x = 750; this.dir = -1; }
        if (this.x < 450) { this.x = 450; this.dir =  1; }
        this.y = 800 + Math.sin(t / 200) * 8 - Math.abs(Math.sin(t / 150)) * 30;
        this._falarAcaso(0.005, 60);
    }

    /** Jpegfeio: teletransportes glitchados pela Paulista */
    _updateJpegfeio() {
        this.glitchTimer = (this.glitchTimer || 0) + 1;
        if (this.glitchTimer % 45 === 0) {
            this.x += (Math.random() - 0.5) * 120;
            this.y += (Math.random() - 0.5) * 60;
            this.x = Math.max(3400, Math.min(this.x, 4300));
            this.y = Math.max(800,  Math.min(this.y, 1500));
        } else {
            this.x += (Math.random() - 0.5) * 3;
            this.y += (Math.random() - 0.5) * 3;
        }
        this._falarAcaso(0.004, 70);
    }

    /** Onírica: flutuação em órbita lemniscata suave (Pico do Jaraguá) */
    _updateOnirica(t) {
        const orbitSpeed = t / 1400;
        this.x = this.baseX + Math.sin(orbitSpeed) * 80;
        this.y = this.baseY + Math.sin(orbitSpeed * 2) * 35;
        this._falarAcaso(0.0025, 100);
    }
}

/**
 * Cria um array de instâncias NPC a partir da lista de personagens
 * que possuem dados de NPC (npc !== null).
 *
 * @param {Array} personagens - Array de objetos personagem com campo npc preenchido
 * @returns {NPC[]}
 */
export function criarNPCsDosPersonagens(personagens) {
    return personagens
        .filter(p => p.npc !== null)
        .map(p => new NPC(p));
}
