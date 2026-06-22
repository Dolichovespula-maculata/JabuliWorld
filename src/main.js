import { Game } from './engine/Game.js';
import { UIManager } from './ui/UIManager.js';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    const ui = new UIManager(game);
    game.setUIManager(ui);

    // Registrar funções globais para que os botões HTML (onclick) consigam acessá-las
    window.enviarMensagem = () => ui.enviarMensagem();
    window.irParaMapa = (mapId) => game.irParaMapa(mapId);
    window.resgatarCodigo = () => ui.resgatarCodigo();
    window.toggleMenu = (id) => ui.toggleMenu(id);
    window.fecharJanela = (id) => ui.fecharJanela(id);

    // Iniciar o loop do jogo
    game.rodar();
});
