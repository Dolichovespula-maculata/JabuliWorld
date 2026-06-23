# 🌿 Jabuli World — Guia do Desenvolvedor

> Um jogo 2D isométrico de exploração solarpunk, construído com HTML5 Canvas puro.

---

## 📦 Como Rodar Localmente

```bash
cd jabuliword
npm install
npm run dev
```

O jogo abre em `http://localhost:5173` (ou porta disponível).

---

## 🗂️ Estrutura de Pastas

```
src/
├── main.js                         # Ponto de entrada — não mude aqui
├── constants.js                    # Utilitários de sprite (lazy-loading de imagens)
│
├── data/                           # 🗄️ DADOS PUROS — editados com frequência
│   ├── characters.js               # Todos os Jabulis: visual, sprite, NPC
│   └── items.js                    # Estruturas interativas (Terminal, Mesa do Álbum)
│
├── engine/                         # ⚙️ MOTOR — raramente editado
│   ├── Game.js                     # Loop principal, câmera, colisão, input
│   ├── Input.js                    # Captura de teclado/mouse
│   └── ParticleManager.js          # Partículas de efeito
│
├── entities/                       # 🎭 ENTIDADES — objetos do mundo
│   ├── Player.js                   # Jogador (movimento, render, chapéu)
│   ├── NPC.js                      # Classe NPC com sistema de comportamentos
│   └── Structure.js                # Objetos interativos (Terminal, Mesa)
│
├── world/                          # 🌍 MUNDO — renderização e dados de cenário
│   ├── World.js                    # Orquestrador — importa tudo e delega
│   │
│   ├── scenes/                     # 🗺️ CENAS — onde ficam posições e conteúdo
│   │   ├── MeuJardim.js            # Ilha Inicial (árvores, torres, ponte)
│   │   └── MundoAberto.js          # São Paulo fantástico (biomas, landmarks, rio)
│   │
│   └── renderers/                  # 🎨 RENDERERS — funções draw* por categoria
│       ├── TreeRenderer.js         # Árvores: ACTree, EnchantedTree, YellowIpe, PinkIpe
│       ├── BuildingRenderer.js     # Prédios: MASP, Copan, FIESP, Catedral, Torii...
│       ├── PropRenderer.js         # Props: cogumelo, grama, turbina, painel solar...
│       └── InfraRenderer.js        # Infra: pontes, lagos, rios
│
└── ui/
    └── UIManager.js                # HUD, Vitrine, resgate de código, menus
```

---

## 👾 Como Adicionar um Novo Personagem (Jabuli)

### 1. Coloque o sprite

Adicione a imagem PNG em:
```
media/jabuli/SeuPersonagem.png
```

### 2. Registre o personagem em `src/data/characters.js`

```js
"MEU-CODIGO": {
    // ── Identidade ───────────────────────────────────────────────────────
    id:         "meuId",          // ID único interno (sem espaços ou acentos)
    set:        "meuSet",         // Conjunto de sprites (geralmente igual ao id)
    morfologia: "normal",         // "normal" | "longa" | "gorda"
    nome:       "Meu Jabuli",     // Nome exibido no jogo
    cor:        "#ff6b6b",        // Cor de destaque (hex)
    criador:    "SeuNome",        // Nome do criador
    insp:       "Inspiração...",  // Texto curto de inspiração
    icon:       "🌟",             // Emoji de ícone

    // ── Sprite ────────────────────────────────────────────────────────────
    sprite: {
        path: "media/jabuli/SeuPersonagem.png",
        larguraTotalImagem: 400,  // Largura do arquivo PNG
        alturaTotalImagem:  400,  // Altura do arquivo PNG
        larguraJabuli:      240,  // Largura do personagem no sprite
        alturaJabuli:       280,  // Altura do personagem no sprite
        fatorSombraW:       0.44, // Largura relativa da sombra
        fatorSombraH:       0.08, // Altura relativa da sombra
        offsetSombraY:      -3    // Deslocamento vertical da sombra
    },

    // ── Aparece como NPC no Mundo Aberto? ───────────────────────────────
    // Se não quiser NPC, use npc: null
    npc: {
        zona:          "Parque Ibirapuera", // Nome da zona (só para referência)
        x:             600,                 // Posição X no mapa do Mundo Aberto
        y:             900,                 // Posição Y no mapa do Mundo Aberto
        dir:           1,                   // Direção inicial: 1 = direita, -1 = esquerda
        desc:          "Meu personagem faz X e Y...",
        comportamento: "meuSet",            // Comportamento de IA (ver NPC.js)
        emojis:        ['🌟', '✨']          // Emojis que aparecem nos balões de fala
    }
},
```

### 3. (Opcional) Adicione um comportamento de IA em `src/entities/NPC.js`

Se o comportamento padrão de caminhada não servir, abra `NPC.js` e:

```js
// Método privado (adicione dentro da classe NPC):
_updateMeuSet(t) {
    // t = Date.now()
    this.x += this.dir * 0.8;
    if (this.x > 700) { this.x = 700; this.dir = -1; }
    if (this.x < 500) { this.x = 500; this.dir =  1; }
    this._falarAcaso(0.003);  // probabilidade de falar por frame
}

// No switch dentro de update(), adicione:
case 'meuSet': this._updateMeuSet(t); break;
```

### 4. Pronto! ✅
O personagem aparecerá automaticamente na **Vitrine do Álbum** e no **Mundo Aberto**.

---

## 🗺️ Como Criar um Novo Cenário

### 1. Crie o arquivo de dados da cena

```
src/world/scenes/MinhaCena.js
```

Exporte pelo menos:
```js
export const MINHA_CENA_WIDTH  = 3000;
export const MINHA_CENA_HEIGHT = 2000;
export const ARVORES_MC = [
    { x: 500, y: 800, s: 1.0, tipo: 'tree' },
    { x: 1200, y: 600, s: 1.2, tipo: 'yellowIpe' },
];
```

### 2. Importe a cena em `src/world/World.js`

```js
import { MINHA_CENA_WIDTH, MINHA_CENA_HEIGHT, ARVORES_MC } from './scenes/MinhaCena.js';
```

### 3. Adicione o mapa ao Game.js

Em `getWorldWidth()` e `getWorldHeight()`, adicione o novo caso:
```js
if (this.mapaAtual === 'minha_cena') return MINHA_CENA_WIDTH;
```

### 4. Crie a transição (porta/ponte)

Em `atualizar()` dentro de `Game.js`:
```js
if (this.mapaAtual === 'meu_jardim' && /* condição de saída */) {
    this.irParaMapa('minha_cena');
}
```

---

## 🏛️ Como Adicionar um Novo Landmark/Prédio

### 1. Crie a função de draw em `src/world/renderers/BuildingRenderer.js`

```js
export function drawMeuPredio(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // ...canvas drawing code...
    ctx.restore();
}
```

### 2. Re-exporte em `src/world/World.js`

```js
import { drawMeuPredio } from './renderers/BuildingRenderer.js';
export { drawMeuPredio };  // adicione à re-exportação existente
```

### 3. Adicione o case no switch de `Game.js`

```js
case 'meuPredio': drawMeuPredio(this.ctx, item.x, item.y); break;
```

### 4. Adicione a entrada na cena desejada

Em `src/world/scenes/MundoAberto.js`:
```js
export const LANDMARKS_MA = [
    // ...existentes...
    { tipo: 'meuPredio', x: 4500, y: 1200 },
];
```

---

## 🌳 Tipos de Árvore Disponíveis

| Tipo | Renderer | Bioma recomendado |
|---|---|---|
| `tree` | `drawACTree` | Genérico, borda de mapa |
| `enchantedTree` | `drawEnchantedTree` | Vila Madalena, bosques |
| `yellowIpe` | `drawYellowIpe` | Parque Ibirapuera |
| `pinkIpe` | `drawPinkIpe` | Liberdade, Ibirapuera |

Para **adicionar um novo tipo de árvore**, edite `TreeRenderer.js` e siga o padrão das existentes.

---

## 🏙️ Landmarks Disponíveis

| Tipo | Função | Localização no mapa |
|---|---|---|
| `auditorioIbirapuera` | `drawAuditorioIbirapuera` | Parque Ibirapuera |
| `obelisco` | `drawObelisco` | Parque Ibirapuera |
| `monumentoBandeiras` | `drawMonumentoBandeiras` | Parque Ibirapuera |
| `toriiGate` | `drawToriiGate` | Liberdade |
| `temploOriental` | `drawTemploOriental` | Liberdade |
| `catedralDaSe` | `drawCatedralDaSe` | Marginal |
| `masp` | `drawMASP` | Avenida Paulista |
| `fiesp` | `drawFIESP` | Avenida Paulista |
| `copan` | `drawCopan` | Avenida Paulista |
| `edificioItalia` | `drawEdificioItalia` | Avenida Paulista |
| `jaraguaAntenna` | `drawJaraguaAntenna` | Pico do Jaraguá |
| `graffitiWall` | `drawGraffitiWall` | Vila Madalena |
| `liberdadeLamp` | `drawLiberdadeLamp` | Liberdade |
| `giantMushroomHouse` | `drawGiantMushroomHouse` | Qualquer |
| `observatoryDome` | `drawObservatoryDome` | Pico do Jaraguá |
| `telescope` | `drawTelescope` | Observatório |
| `solarPanel` | `drawSolarPanel` | Qualquer |
| `windTurbine` | `drawWindTurbine` | Qualquer |

---

## 🧠 Sistema de Comportamentos de NPC

Cada NPC executa um comportamento declarado no campo `npc.comportamento` de `characters.js`.

Os comportamentos são métodos privados da classe `NPC` em `src/entities/NPC.js`.

| Comportamento | Descrição |
|---|---|
| `serrano` | Passeio lateral (vai e volta) |
| `maracatu` | Dança em elipse circular |
| `cogumelo` | Órbita lenta elipsoidal |
| `devo` | Passeio lateral + seno vertical |
| `frank` | Nado elíptico no rio |
| `colombina` | Oscilação em senóide dupla |
| `ziggy` | Órbita circular constante |
| `toytoy` | Salto parabólico rápido |
| `jpegfeio` | Teletransporte glitchado |
| `onirica` | Lemniscata flutuante suave |

---

## ⚙️ Projeção Isométrica

O jogo usa projeção isométrica com perspectiva. A função `projetarCoordenadas(x, y)` em `Game.js`:

1. **Rotaciona** o ponto 45° no plano XY
2. **Aplica perspectiva** proporcional à distância da câmera
3. Retorna `{ x, y, scale }` — o `scale` é usado para redimensionar objetos distantes

O **painter's algorithm** (Y-sort) ordena todos os elementos pela soma `(x + y)` antes de desenhar, garantindo que objetos mais ao sul fiquem na frente.

---

## 🎮 Controles do Jogo

| Tecla | Ação |
|---|---|
| `W` / `↑` | Mover para cima/norte |
| `S` / `↓` | Mover para baixo/sul |
| `A` / `←` | Mover para esquerda/oeste |
| `D` / `→` | Mover para direita/leste |
| `E` | Interagir com NPC ou estrutura próxima |
| `ESC` | Fechar todos os menus |

---

## 📜 Fluxo de Jogo

```
Tela Inicial → Jabuli World: Ilha Inicial
                    │
                    ├── Terminal de Resgate  → Inserir código → Desbloqueio Jabuli
                    ├── Mesa do Álbum        → Vitrine → Equipar personagem
                    └── Ponte →  Mundo Aberto (São Paulo fantástico)
                                    │
                                    ├── Parque Ibirapuera (entrada)
                                    ├── Vila Madalena (bosque encantado)
                                    ├── Liberdade (cogumelos e torii)
                                    ├── Marginal Pinheiros (rio + Ponte Estaiada)
                                    ├── Avenida Paulista (prédios icônicos)
                                    └── Pico do Jaraguá (topo montanhoso)
```

---

## 📝 Convenções do Projeto

- **Português brasileiro** para variáveis de domínio do jogo, inglês para código técnico
- Funções de draw sempre recebem `(ctx, x, y, ...)` — primeiro o contexto, depois posição
- Novos arquivos seguem o padrão já existente: comentário `@file`, seções com `// ─── Nome`
- Dados de design (posições, cores, nomes) vivem em `src/data/` e `src/world/scenes/`
- Lógica de engine (loop, câmera, colisão) fica em `src/engine/Game.js`
