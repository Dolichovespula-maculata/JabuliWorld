import { obterSpriteTintada, obterSprite } from '../constants.js';

export function renderizarGeometriaGota(c, x, y, r, tipoMorfologia) {
    if (tipoMorfologia === "longa") {
        c.moveTo(x, y - 56);
        c.bezierCurveTo(x - r + 3, y - 35, x - r + 1, y, x, y);
        c.bezierCurveTo(x + r - 1, y, x + r - 3, y - 35, x, y - 56);
    } else if (tipoMorfologia === "gorda") {
        c.moveTo(x, y - 36);
        c.bezierCurveTo(x - r - 8, y - 20, x - r - 8, y, x, y);
        c.bezierCurveTo(x + r + 8, y, x + r + 8, y - 20, x, y - 36);
    } else {
        c.moveTo(x, y - 46);
        c.bezierCurveTo(x - r - 3, y - 28, x - r - 3, y, x, y);
        c.bezierCurveTo(x + r + 3, y, x + r + 3, y - 28, x, y - 46);
    }
}

export function renderizarChapeuGenerico(c, x, y, chapeu, morfologia) {
    // Sistema de chapéus desativado a pedido do usuário.
}

export class Player {
    constructor(x = 640, y = 480) {
        this.x = x;
        this.y = y;
        this.velocidade = 6;
        this.raio = 22;
        this.cor = "#cccccc";
        this.nome = "Sem Jabuli";
        this.emInteracao = false;
        this.noPneu = false;
        this.noLago = false;
        this.chapeuEquipado = null;
        this.morfologia = "normal";
        this.nomePreset = null; // null significa que nenhum Jabuli está equipado/desbloqueado
        this.textoFala = "";
        this.timerFala = 0;
        this.facingRight = true;
        this.isWalking = false;
        this.walkTime = 0;
    }

    update(input, canvasWidth, canvasHeight, isInfinite = false) {
        if (this.timerFala > 0) {
            this.timerFala--;
        }

        // Se não possuir Jabuli equipado, não pode andar!
        if (!this.nomePreset) {
            return;
        }

        if (this.noPneu) {
            return;
        }

        // In the 45° rotated iso view WASD maps to diagonal world axes:
        //  W = screen-up    → world NW: dx -, dy -
        //  S = screen-down  → world SE: dx +, dy +
        //  A = screen-left  → world SW: dx -, dy +
        //  D = screen-right → world NE: dx +, dy -
        const diag = 0.7071067811865476; // 1/√2 for normalization
        const v = this.velocidade;
        let dx = 0, dy = 0;

        if (input.isPressed('w') || input.isPressed('arrowup'))    { dx -= v * diag; dy -= v * diag; }
        if (input.isPressed('s') || input.isPressed('arrowdown'))  { dx += v * diag; dy += v * diag; }
        if (input.isPressed('a') || input.isPressed('arrowleft'))  { dx -= v * diag; dy += v * diag; }
        if (input.isPressed('d') || input.isPressed('arrowright')) { dx += v * diag; dy -= v * diag; }

        this.x += dx;
        this.y += dy;

        // Atualizar direção horizontal do Jabuli
        if (dx < 0) {
            this.facingRight = false;
        } else if (dx > 0) {
            this.facingRight = true;
        }

        // Animação de balanço (wobble) ao andar
        if (dx !== 0 || dy !== 0) {
            this.isWalking = true;
            this.walkTime += 0.15;
        } else {
            this.isWalking = false;
            this.walkTime = 0;
        }

        // Limitar às bordas
        if (!isInfinite) {
            if (this.x < 40) this.x = 40;
            if (this.y < 150) this.y = 150;
            if (this.x > canvasWidth - 40) this.x = canvasWidth - 40;
            if (this.y > canvasHeight - 90) this.y = canvasHeight - 90;
        } else {
            // Em mapa infinito, limitamos apenas a não atravessar o início (x = 0) pela esquerda se não estiver na ponte
            const onBridge = (this.x >= 0 && this.x <= 420 && this.y >= 1550 && this.y <= 1650);
            if (this.x < 40 && !onBridge) {
                this.x = 40;
            }
        }
    }

    enviarMensagem(texto) {
        if (texto.trim() === "") return;
        this.textoFala = texto;
        this.timerFala = 240;
    }

    draw(ctx, pontoLuz) {
        if (this.noPneu) {
            this.drawSpeechBubble(ctx);
            return;
        }

        // 1. Carregar a sprite
        let spriteObj = obterSpriteTintada(this.nomePreset, this.cor);
        if (!spriteObj) {
            spriteObj = obterSprite("Jabuli Clássico");
        }

        // 2. Extrair dimensões para calcular a sombra e tamanho de desenho
        let sx = 80, sy = 60, sw = 240, sh = 280;
        let fatorSombraW = 0.44;
        let fatorSombraH = 0.10;
        let offsetSombraY = 2;

        if (spriteObj) {
            const config = spriteObj.config;
            sx = config.sx !== undefined ? config.sx : (config.larguraTotalImagem - config.larguraJabuli) / 2;
            sy = config.sy !== undefined ? config.sy : (config.alturaTotalImagem - config.alturaJabuli) / 2;
            sw = config.larguraJabuli;
            sh = config.alturaJabuli;

            if (config.fatorSombraW !== undefined) fatorSombraW = config.fatorSombraW;
            if (config.fatorSombraH !== undefined) fatorSombraH = config.fatorSombraH;
            if (config.offsetSombraY !== undefined) offsetSombraY = config.offsetSombraY;
        }

        const aspect = sw / sh;
        let dh = 58;
        let dw = dh * aspect;
        if (this.morfologia === "longa") {
            dh = 72;
            dw = dh * aspect * 0.7;
        } else if (this.morfologia === "gorda") {
            dh = 48;
            dw = dh * aspect * 1.3;
        }

        let cutoffY = this.y - 15;
        if (this.morfologia === "longa") cutoffY = this.y - 20;
        if (this.morfologia === "gorda") cutoffY = this.y - 10;

        // 3. Wobble ao andar
        let wobbleAngle = 0;
        if (this.isWalking) {
            wobbleAngle = Math.sin(this.walkTime) * 0.08;
        }

        // Clip submerso no lago (sem sombra projetada)
        if (this.noLago) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.x - 50, this.y - 120, 100, 120 + (cutoffY - this.y));
            ctx.clip();
        }

        // 4. Desenhar o corpo do personagem
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(wobbleAngle);

        if (spriteObj && spriteObj.image) {
            ctx.save();
            if (!this.facingRight) {
                ctx.scale(-1, 1);
            }
            if (!this.nomePreset) {
                ctx.filter = "grayscale(100%) opacity(60%)";
            }
            ctx.drawImage(spriteObj.image, sx, sy, sw, sh, -dw / 2, -dh, dw, dh);
            ctx.restore();
        }

        if (!this.nomePreset) {
            // Desenhar cadeado na barriga do Jabuli bloqueado
            let lockY = -15;
            ctx.fillStyle = "#3d2f26";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🔒", 0, lockY);
        }

        ctx.restore(); // Restaura a translação e rotação

        if (this.noLago) {
            ctx.restore();

            // Ondulações concêntricas de água (ripples)
            let t = Date.now() / 300;
            let rippleScale1 = 1 + (t % 1);
            let rippleAlpha1 = 1 - (t % 1);

            let rippleScale2 = 1 + ((t + 0.5) % 1);
            let rippleAlpha2 = 1 - ((t + 0.5) % 1);

            ctx.lineWidth = 2;

            // Ripple 1
            ctx.strokeStyle = `rgba(168, 218, 220, ${rippleAlpha1 * 0.8})`;
            ctx.beginPath();
            ctx.ellipse(this.x, cutoffY + 3, this.raio * 1.1 * rippleScale1, 6 * rippleScale1, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Ripple 2 (Branca)
            ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAlpha2 * 0.9})`;
            ctx.beginPath();
            ctx.ellipse(this.x, cutoffY + 3, this.raio * 0.8 * rippleScale2, 4.5 * rippleScale2, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Contorno estático na linha d'água
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(this.x, cutoffY + 3, this.raio * 0.9, 5, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Nome
        ctx.fillStyle = "#4a332c";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(this.nome, this.x, this.y - (this.morfologia === "longa" ? 66 : 56));

        // Balão de fala
        this.drawSpeechBubble(ctx);
    }

    drawSpeechBubble(ctx) {
        if (this.timerFala > 0 && this.textoFala !== "") {
            ctx.font = "14px Arial";
            let larguraTexto = ctx.measureText(this.textoFala).width;
            let larguraBalao = larguraTexto + 24;
            let alturaBalao = 38;
            let balaoX = this.x;
            let balaoY = this.noPneu ? this.y + 5 : this.y - (this.morfologia === "longa" ? 104 : 96);

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#5a4235";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(balaoX - larguraBalao / 2, balaoY - alturaBalao / 2, larguraBalao, alturaBalao, 12);
            ctx.fill();
            ctx.stroke();

            // Setinha
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(balaoX - 6, balaoY + alturaBalao / 2);
            ctx.lineTo(balaoX, balaoY + alturaBalao / 2 + 8);
            ctx.lineTo(balaoX + 6, balaoY + alturaBalao / 2);
            ctx.fill();
            ctx.stroke();

            // Cobrir contorno interno
            ctx.beginPath();
            ctx.moveTo(balaoX - 5, balaoY + alturaBalao / 2);
            ctx.lineTo(balaoX + 5, balaoY + alturaBalao / 2);
            ctx.stroke();

            ctx.fillStyle = "#5a4235";
            ctx.textAlign = "center";
            ctx.fillText(this.textoFala, balaoX, balaoY + 5);
        }
    }
}
