import { obterSpriteTintada } from '../constants.js';

export function renderizarGeometriaGota(c, x, y, r, tipoMorfologia) {
    if (tipoMorfologia === "longa") {
        c.moveTo(x, y - 56);
        c.bezierCurveTo(x - r + 3, y - 35, x - r + 1, y, x, y);
        c.bezierCurveTo(x + r - 1, y , x + r - 3, y - 35, x, y - 56);
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
    let alturaFator = 44;
    if(morfologia === "longa") alturaFator = 54;
    if(morfologia === "gorda") alturaFator = 34;

    c.strokeStyle = "#3d2f26";
    c.lineWidth = 2.5;

    if (chapeu === "colombina") {
        c.fillStyle = "#ffffff"; 
        c.beginPath(); 
        c.moveTo(x - 12, y - alturaFator + 2); 
        c.lineTo(x, y - alturaFator - 22); 
        c.lineTo(x + 12, y - alturaFator + 2); 
        c.closePath();
        c.fill(); 
        c.stroke();

        c.fillStyle = "#e07a5f"; 
        c.beginPath(); 
        c.arc(x, y - alturaFator - 23, 4, 0, Math.PI*2); 
        c.fill(); 
        c.stroke();
    } else if (chapeu === "caboclo") {
        c.fillStyle = "#7d6b58"; 
        c.beginPath();
        c.rect(x - 24, y - alturaFator - 3, 48, 6);
        c.fill();
        c.stroke();

        c.fillStyle = "#ffb703"; 
        c.beginPath();
        c.rect(x - 14, y - alturaFator - 12, 28, 9);
        c.fill();
        c.stroke();
    } else if (chapeu === "gardachuva") {
        c.fillStyle = "#5a4a42"; 
        c.beginPath();
        c.rect(x - 2, y - alturaFator - 16, 3, 16); 
        c.fill();
        c.stroke();

        c.fillStyle = "#e07a5f"; 
        c.beginPath(); 
        c.arc(x, y - alturaFator - 16, 20, Math.PI, 0); 
        c.closePath();
        c.fill(); 
        c.stroke();

        c.fillStyle = "#f2cc8f"; 
        c.beginPath(); 
        c.arc(x, y - alturaFator - 16, 11, Math.PI, 0); 
        c.closePath();
        c.fill(); 
        c.stroke();
    } else if (chapeu === "devo") {
        c.fillStyle = "#e07a5f"; 
        c.beginPath();
        c.rect(x - 20, y - alturaFator - 5, 40, 6); 
        c.rect(x - 16, y - alturaFator - 11, 32, 6); 
        c.rect(x - 11, y - 17 - alturaFator, 22, 6);
        c.fill();
        c.stroke();
    } else if (chapeu === "darko") {
        c.fillStyle = "#5a4a42"; 
        c.beginPath();
        c.rect(x - 10, y - alturaFator - 16, 5, 18); 
        c.rect(x + 5, y - alturaFator - 16, 5, 18);
        c.fill();
        c.stroke();
    } else if (chapeu === "durden") {
        c.fillStyle = "#3d5a4c"; 
        c.beginPath(); 
        c.ellipse(x, y - alturaFator - 2, 20, 8, 0, 0, Math.PI*2); 
        c.fill();
        c.stroke();
    } else if (chapeu === "bowie") {
        c.fillStyle = "#ff5500"; 
        c.beginPath(); 
        c.arc(x, y - alturaFator, 16, Math.PI, 0); 
        c.closePath();
        c.fill();
        c.stroke();
    } else if (chapeu === "cogumelo") {
        // Stem band (white ring)
        c.fillStyle = "#f4f1eb";
        c.beginPath();
        c.rect(x - 12, y - alturaFator - 3, 24, 8);
        c.fill(); c.stroke();
        // Mushroom cap (dome)
        c.fillStyle = "#c44b2e";
        c.beginPath();
        c.arc(x, y - alturaFator - 3, 24, Math.PI, 0);
        c.closePath(); c.fill(); c.stroke();
        // Inner color band
        c.fillStyle = "#e07a5f";
        c.beginPath();
        c.arc(x, y - alturaFator - 3, 18, Math.PI, 0);
        c.closePath(); c.fill();
        // White spots
        c.fillStyle = "rgba(255,255,255,0.88)";
        [[0,-14],[-9,-9],[9,-9],[-14,-4],[14,-4],[0,-3]].forEach(([dx,dy]) => {
            c.beginPath();
            c.arc(x+dx, y - alturaFator - 3 + dy, 3.5, 0, Math.PI*2);
            c.fill();
        });
    }
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

    update(input, canvasWidth, canvasHeight) {
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

        let dx = 0;
        let dy = 0;

        if (input.isPressed('w') || input.isPressed('arrowup')) dy -= this.velocidade;
        if (input.isPressed('s') || input.isPressed('arrowdown')) dy += this.velocidade;
        if (input.isPressed('a') || input.isPressed('arrowleft')) dx -= this.velocidade;
        if (input.isPressed('d') || input.isPressed('arrowright')) dx += this.velocidade;

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
        if (this.x < 40) this.x = 40;
        if (this.y < 150) this.y = 150;
        if (this.x > canvasWidth - 40) this.x = canvasWidth - 40;
        if (this.y > canvasHeight - 90) this.y = canvasHeight - 90;
    }

    enviarMensagem(texto) {
        if (texto.trim() === "") return;
        this.textoFala = texto;
        this.timerFala = 240;
    }

    draw(ctx) {
        if (this.noPneu) {
            this.drawSpeechBubble(ctx);
            return;
        }

        let cutoffY = this.y - 15;
        if (this.morfologia === "longa") cutoffY = this.y - 20;
        if (this.morfologia === "gorda") cutoffY = this.y - 10;

        if (!this.noLago) {
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + 4, this.raio, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Clip no corpo para parecer submerso
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.x - 50, this.y - 120, 100, 120 + (cutoffY - this.y));
            ctx.clip();
        }

        // Gota / Sprite (Usa obterSpriteTintada para suportar cores/presets dinâmicos)
        const spriteObj = obterSpriteTintada(this.nomePreset, this.cor);
        
        ctx.save();
        ctx.translate(this.x, this.y);

        let wobbleAngle = 0;
        if (this.isWalking) {
            wobbleAngle = Math.sin(this.walkTime) * 0.08;
        }
        ctx.rotate(wobbleAngle);

        if (spriteObj && spriteObj.image) {
            const config = spriteObj.config;
            const sx = (config.larguraTotalImagem - config.larguraJabuli) / 2;
            const sy = (config.alturaTotalImagem - config.alturaJabuli) / 2;
            const sw = config.larguraJabuli;
            const sh = config.alturaJabuli;
            
            // Distorcer com base na morfologia (mudar o formato/tamanho)
            let dw = config.larguraDesenho;
            let dh = config.alturaDesenho;
            if (this.morfologia === "longa") {
                dw = 42;
                dh = 72;
            } else if (this.morfologia === "gorda") {
                dw = 62;
                dh = 48;
            }

            ctx.save();
            if (!this.facingRight) {
                ctx.scale(-1, 1);
            }
            ctx.drawImage(spriteObj.image, sx, sy, sw, sh, -dw / 2, -dh, dw, dh);
            ctx.restore();
        } else {
            // Desenhar gota vetorial original como fallback (no ponto central 0, 0)
            ctx.fillStyle = this.cor;
            ctx.beginPath();
            renderizarGeometriaGota(ctx, 0, 0, this.raio, this.morfologia);
            ctx.fill();
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Olhos
            let olhoY = -18;
            if (this.morfologia === "longa") olhoY = -22;
            if (this.morfologia === "gorda") olhoY = -14;

            ctx.fillStyle = "#1e1b1a";
            ctx.beginPath();
            ctx.arc(-6, olhoY, 3, 0, Math.PI * 2);
            ctx.arc(6, olhoY, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Chapéu (só desenha se tiver preset ativo, acoplado ao balanço em 0,0)
        if (this.nomePreset) {
            renderizarChapeuGenerico(ctx, 0, 0, this.chapeuEquipado, this.morfologia);
        } else {
            // Desenhar cadeado na barriga do Jabuli bloqueado
            let lockY = -8;
            if (this.morfologia === "longa") lockY = -12;
            if (this.morfologia === "gorda") lockY = -6;

            ctx.fillStyle = "#3d2f26";
            ctx.font = "14px Arial";
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
