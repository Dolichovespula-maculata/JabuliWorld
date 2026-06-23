import { renderizarGeometriaGota, renderizarChapeuGenerico } from './Player.js';
import { obterSpriteTintada, obterSprite } from '../constants.js';

export class Structure {
    constructor(id, x, y, tipo, nome, raio) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.nome = nome;
        this.raio = raio;
    }

    checkCollision(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);
        return distancia < this.raio;
    }

    draw(ctx, anguloBalanco, player, pontoLuz) {
        // 1. Desenhar sombra matemática projetada
        ctx.save();

        let skewX = -0.6;
        let scaleY = -0.25;
        if (pontoLuz) {
            const dx = this.x - pontoLuz.x;
            const dy = (this.y + 30) - pontoLuz.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            skewX = (dx / dist) * 0.55;
            scaleY = -(dy / dist) * 0.28;
        }

        ctx.translate(this.x, this.y + 30);
        ctx.transform(1, 0, skewX, scaleY, 0, 0);
        ctx.translate(-this.x, -(this.y + 30));
        ctx.filter = "brightness(0) opacity(0.14)";
        this.drawGeometry(ctx, anguloBalanco, player, true);
        ctx.restore();

        // 2. Desenhar a estrutura real
        this.drawGeometry(ctx, anguloBalanco, player, false);
    }

    drawGeometry(ctx, anguloBalanco, player, isShadow) {
        // Configuração de Contorno (Traço de desenho à mão)
        ctx.strokeStyle = isShadow ? "transparent" : "#3d2f26";
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // Sombra da base
        if (!isShadow) {
            ctx.fillStyle = "rgba(42, 157, 143, 0.08)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + 45, this.raio, 18, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.tipo === "loja") {
            // REDESENHO: Carrinho Cozy de Comida Solarpunk

            // Roda do Carrinho
            ctx.fillStyle = "#8d705c";
            ctx.beginPath();
            ctx.arc(this.x - 35, this.y + 35, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Raios da roda
            ctx.beginPath();
            ctx.moveTo(this.x - 35, this.y + 35);
            ctx.lineTo(this.x - 35, this.y + 17);
            ctx.moveTo(this.x - 35, this.y + 35);
            ctx.lineTo(this.x - 35, this.y + 53);
            ctx.moveTo(this.x - 35, this.y + 35);
            ctx.lineTo(this.x - 53, this.y + 35);
            ctx.moveTo(this.x - 35, this.y + 35);
            ctx.lineTo(this.x - 17, this.y + 35);
            ctx.stroke();

            // Perna de suporte traseira
            ctx.fillStyle = "#5a4235";
            ctx.beginPath();
            ctx.rect(this.x + 35, this.y + 15, 10, 35);
            ctx.fill();
            ctx.stroke();

            // Corpo de Madeira do Carrinho
            ctx.fillStyle = "#eedfd2";
            ctx.beginPath();
            ctx.roundRect(this.x - 60, this.y - 15, 120, 50, 10);
            ctx.fill();
            ctx.stroke();

            // Linhas horizontais de tábuas de madeira
            ctx.beginPath();
            ctx.moveTo(this.x - 60, this.y + 2);
            ctx.lineTo(this.x + 60, this.y + 2);
            ctx.moveTo(this.x - 60, this.y + 18);
            ctx.lineTo(this.x + 60, this.y + 18);
            ctx.stroke();

            // Cesta de Frutas/Pãezinhos
            ctx.fillStyle = "#baa68a";
            ctx.beginPath();
            ctx.roundRect(this.x - 50, this.y - 28, 40, 14, 4);
            ctx.fill();
            ctx.stroke();

            // Itens dentro da cesta
            ctx.fillStyle = "#e76f51"; // Maçãs vermelhas
            ctx.beginPath();
            ctx.arc(this.x - 42, this.y - 25, 4, 0, Math.PI * 2);
            ctx.arc(this.x - 35, this.y - 25, 4, 0, Math.PI * 2);
            ctx.arc(this.x - 22, this.y - 25, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#2a9d8f"; // Verduras
            ctx.beginPath();
            ctx.arc(this.x - 28, this.y - 26, 5, 0, Math.PI * 2);
            ctx.fill();

            // Panela de Vapor (Buns)
            ctx.fillStyle = "#cfc3b3";
            ctx.beginPath();
            ctx.roundRect(this.x + 10, this.y - 32, 40, 18, 4);
            ctx.fill();
            ctx.stroke();

            // Tampa
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y - 32);
            ctx.lineTo(this.x + 50, this.y - 32);
            ctx.stroke();

            // Postes de Suporte do Telhado
            ctx.strokeStyle = "#3d2f26";
            ctx.beginPath();
            ctx.moveTo(this.x - 50, this.y - 15);
            ctx.lineTo(this.x - 50, this.y - 65);
            ctx.moveTo(this.x + 50, this.y - 15);
            ctx.lineTo(this.x + 50, this.y - 65);
            ctx.stroke();

            // Telhado Inclinado de Painel Solar Verde (Eco Roof)
            ctx.fillStyle = "#1e6051"; // Base do teto
            ctx.beginPath();
            ctx.moveTo(this.x - 70, this.y - 55);
            ctx.lineTo(this.x + 70, this.y - 55);
            ctx.lineTo(this.x + 55, this.y - 75);
            ctx.lineTo(this.x - 55, this.y - 75);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Listras brilhantes do painel solar verde-água
            ctx.strokeStyle = "#48bcae";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x - 45, this.y - 58); ctx.lineTo(this.x - 35, this.y - 72);
            ctx.moveTo(this.x - 25, this.y - 58); ctx.lineTo(this.x - 15, this.y - 72);
            ctx.moveTo(this.x - 5, this.y - 58); ctx.lineTo(this.x + 5, this.y - 72);
            ctx.moveTo(this.x + 15, this.y - 58); ctx.lineTo(this.x + 25, this.y - 72);
            ctx.moveTo(this.x + 35, this.y - 58); ctx.lineTo(this.x + 45, this.y - 72);
            ctx.stroke();

            // Outline final do teto
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 70, this.y - 55);
            ctx.lineTo(this.x + 70, this.y - 55);
            ctx.lineTo(this.x + 55, this.y - 75);
            ctx.lineTo(this.x - 55, this.y - 75);
            ctx.closePath();
            ctx.stroke();
        }
        else if (this.tipo === "custom") {
            // REDESENHO: Casinha de Árvore (Hollow Tree Stump House)

            // Sombra da base
            ctx.fillStyle = "rgba(42, 157, 143, 0.08)";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + 40, 55, 15, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tronco de madeira (Stump Body with flared roots)
            ctx.fillStyle = "#a17c66"; // warm tree bark color
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.moveTo(this.x - 45, this.y + 40); // Root left
            ctx.bezierCurveTo(this.x - 35, this.y + 20, this.x - 25, this.y - 20, this.x - 25, this.y - 20); // left trunk wall
            ctx.lineTo(this.x + 25, this.y - 20); // top flat cut of stump
            ctx.bezierCurveTo(this.x + 25, this.y - 20, this.x + 35, this.y + 20, this.x + 45, this.y + 40); // right trunk wall
            ctx.quadraticCurveTo(this.x + 20, this.y + 38, this.x, this.y + 40); // bottom flare
            ctx.quadraticCurveTo(this.x - 20, this.y + 38, this.x - 45, this.y + 40);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Textura dos anéis de madeira no topo plano (Y = -20)
            ctx.strokeStyle = "#725643";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y - 20, 22, 5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(this.x, this.y - 20, 12, 3, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Linhas verticais de casca de árvore
            ctx.strokeStyle = "#725643";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x - 18, this.y - 10); ctx.lineTo(this.x - 22, this.y + 25);
            ctx.moveTo(this.x + 18, this.y - 10); ctx.lineTo(this.x + 22, this.y + 25);
            ctx.stroke();

            // Porta Oca (Hollow Cave Door)
            ctx.fillStyle = "#2b1f1d";
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(this.x - 14, this.y + 10, 28, 30, [12, 12, 0, 0]);
            ctx.fill();
            ctx.stroke();

            // Luz aconchegante saindo da porta
            ctx.fillStyle = "rgba(253, 240, 213, 0.25)";
            ctx.beginPath();
            ctx.moveTo(this.x - 10, this.y + 40);
            ctx.lineTo(this.x - 25, this.y + 65);
            ctx.lineTo(this.x + 25, this.y + 65);
            ctx.lineTo(this.x + 10, this.y + 40);
            ctx.closePath();
            ctx.fill();

            // Postes de Suporte do Telhado
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 20, this.y - 20); ctx.lineTo(this.x - 20, this.y - 45);
            ctx.moveTo(this.x + 20, this.y - 20); ctx.lineTo(this.x + 20, this.y - 45);
            ctx.stroke();

            // Telhado de Palha / Folhas Acolhedor (A-frame Cozy Roof)
            ctx.fillStyle = "#e07a5f"; // Terracotta
            ctx.beginPath();
            ctx.moveTo(this.x - 35, this.y - 40);
            ctx.lineTo(this.x + 35, this.y - 40);
            ctx.lineTo(this.x, this.y - 65);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Detalhes do telhado (linhas de palha)
            ctx.strokeStyle = "#3d2f26";
            ctx.beginPath();
            ctx.moveTo(this.x - 15, this.y - 47); ctx.lineTo(this.x, this.y - 65);
            ctx.moveTo(this.x + 15, this.y - 47); ctx.lineTo(this.x, this.y - 65);
            ctx.moveTo(this.x, this.y - 40); ctx.lineTo(this.x, this.y - 65);
            ctx.stroke();

            // Pequena janela redonda com luz acesa
            ctx.fillStyle = "#fdf0d5"; // yellow glow
            ctx.beginPath();
            ctx.arc(this.x, this.y - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Grade da janela
            ctx.beginPath();
            ctx.moveTo(this.x - 8, this.y - 5); ctx.lineTo(this.x + 8, this.y - 5);
            ctx.moveTo(this.x, this.y - 13); ctx.lineTo(this.x, this.y + 3);
            ctx.stroke();
        }
        else if (this.tipo === "arvore") {
            // REDESENHO: Árvore Orgânica Retorcida Solarpunk

            // Tronco Retorcido Curvo
            ctx.fillStyle = "#5a4235";
            ctx.beginPath();
            ctx.moveTo(this.x - 18, this.y + 80);
            ctx.bezierCurveTo(this.x - 15, this.y + 20, this.x - 25, this.y - 30, this.x - 8, this.y - 65);
            ctx.lineTo(this.x + 10, this.y - 65);
            ctx.bezierCurveTo(this.x - 5, this.y - 20, this.x + 5, this.y + 20, this.x + 18, this.y + 80);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Galho Lateral Orgânico para o Balanço
            ctx.beginPath();
            ctx.moveTo(this.x - 2, this.y - 25);
            ctx.bezierCurveTo(this.x + 25, this.y - 28, this.x + 50, this.y - 22, this.x + 65, this.y - 15);
            ctx.lineTo(this.x + 65, this.y - 3);
            ctx.bezierCurveTo(this.x + 45, this.y - 12, this.x + 25, this.y - 16, this.x - 5, this.y - 13);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Folhagem / Copa (Vários círculos de folhas sobrepostos para profundidade)
            ctx.fillStyle = "#2a9d8f";

            const copas = [
                { cx: this.x - 30, cy: this.y - 75, r: 42 },
                { cx: this.x + 25, cy: this.y - 85, r: 52 },
                { cx: this.x - 5, cy: this.y - 105, r: 48 }
            ];

            copas.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            // Balanço
            ctx.save();
            ctx.translate(this.x + 52, this.y - 10);
            ctx.rotate(anguloBalanco);

            // Corda
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 52);
            ctx.stroke();

            // Pneu
            ctx.strokeStyle = "#2b1f1d";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(0, 62, 14, 0, Math.PI * 2);
            ctx.stroke();

            // Detalhe interno do pneu (buraco com contorno)
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 62, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 62, 10, 0, Math.PI * 2);
            ctx.stroke();

            if (player.noPneu) {
                // Desenha o Jabuli no balanço usando a sprite
                let spriteObj = obterSpriteTintada(player.nomePreset, player.cor);
                if (!spriteObj) {
                    spriteObj = obterSprite("Jabuli Clássico");
                }
                if (spriteObj && spriteObj.image) {
                    const config = spriteObj.config;
                    const sx = config.sx !== undefined ? config.sx : (config.larguraTotalImagem - config.larguraJabuli) / 2;
                    const sy = config.sy !== undefined ? config.sy : (config.alturaTotalImagem - config.alturaJabuli) / 2;
                    const sw = config.larguraJabuli;
                    const sh = config.alturaJabuli;

                    const aspect = sw / sh;
                    let dh = 58;
                    let dw = dh * aspect;
                    if (player.morfologia === "longa") {
                        dh = 72;
                        dw = dh * aspect * 0.7;
                    } else if (player.morfologia === "gorda") {
                        dh = 48;
                        dw = dh * aspect * 1.3;
                    }

                    ctx.save();
                    if (!player.facingRight) {
                        ctx.scale(-1, 1);
                    }
                    if (!player.nomePreset) {
                        ctx.filter = "grayscale(100%) opacity(60%)";
                    }
                    ctx.drawImage(spriteObj.image, sx, sy, sw, sh, -dw / 2, 65 - dh, dw, dh);
                    ctx.restore();
                }

                // Ajusta posições da entidade relativas ao mundo para desenho do balão de fala
                player.x = this.x + 52 + Math.sin(anguloBalanco) * 62;
                player.y = this.y - 10 + Math.cos(anguloBalanco) * 62;
            }
            ctx.restore();
        } else if (this.tipo === "terminal") {
            // TERMINAL SOLARPUNK ISOMÉTRICO
            const t = Date.now() / 1000;

            // Sombra do conjunto (losango suave)
            if (!isShadow) {
                ctx.fillStyle = "rgba(0,0,0,0.08)";
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 25);
                ctx.lineTo(this.x + 70, this.y + 45);
                ctx.lineTo(this.x, this.y + 65);
                ctx.lineTo(this.x - 70, this.y + 45);
                ctx.closePath();
                ctx.fill();
            }

            // Base de Metal - Face de Baixo da Extrusão
            ctx.fillStyle = "#7ca092";
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 60, this.y + 30);
            ctx.lineTo(this.x + 60, this.y + 30);
            ctx.lineTo(this.x + 60, this.y + 42);
            ctx.lineTo(this.x - 60, this.y + 42);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Face de Cima da Extrusão (Plataforma Isométrica)
            const baseGrd = ctx.createLinearGradient(this.x - 60, this.y + 20, this.x + 60, this.y + 40);
            baseGrd.addColorStop(0, "#eedfd2");
            baseGrd.addColorStop(1, "#acdfcf");
            ctx.fillStyle = baseGrd;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 18);
            ctx.lineTo(this.x + 60, this.y + 30);
            ctx.lineTo(this.x, this.y + 42);
            ctx.lineTo(this.x - 60, this.y + 30);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Detalhe de linhas de grade tecnológica na plataforma
            ctx.strokeStyle = "rgba(72,152,136,0.3)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 30, this.y + 24); ctx.lineTo(this.x + 30, this.y + 36);
            ctx.moveTo(this.x - 30, this.y + 36); ctx.lineTo(this.x + 30, this.y + 24);
            ctx.stroke();

            // Hastes Isométricas Laterais (Arcos metálicos)
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 2.5;
            // Haste esquerda
            ctx.beginPath();
            ctx.moveTo(this.x - 45, this.y + 25);
            ctx.quadraticCurveTo(this.x - 40, this.y - 25, this.x - 10, this.y - 50);
            ctx.stroke();
            // Haste direita
            ctx.beginPath();
            ctx.moveTo(this.x + 45, this.y + 25);
            ctx.quadraticCurveTo(this.x + 40, this.y - 25, this.x + 10, this.y - 50);
            ctx.stroke();

            // Haste vertical de sustentação da tela
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 30);
            ctx.lineTo(this.x, this.y - 45);
            ctx.stroke();

            // Tela Holográfica Isométrica Flutuante (losango brilhante inclinado)
            if (!isShadow) {
                const orbY = this.y - 65 + Math.sin(t * 1.5) * 4;
                ctx.save();
                ctx.translate(this.x, orbY);

                // Brilho holográfico de fundo
                const glowGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
                glowGrd.addColorStop(0, "rgba(72, 220, 196, 0.6)");
                glowGrd.addColorStop(1, "rgba(72, 220, 196, 0)");
                ctx.fillStyle = glowGrd;
                ctx.beginPath();
                ctx.arc(0, 0, 32, 0, Math.PI * 2);
                ctx.fill();

                // Moldura holográfica (Losango inclinado)
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                ctx.fillStyle = "rgba(72, 220, 196, 0.72)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -18);
                ctx.lineTo(26, -5);
                ctx.lineTo(0, 8);
                ctx.lineTo(-26, -5);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Símbolo holográfico de carregamento interno (+)
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-8, -5); ctx.lineTo(8, -5);
                ctx.moveTo(0, -13); ctx.lineTo(0, 3);
                ctx.stroke();

                ctx.restore();
            }

            // Pequenas plantinhas na base
            [[-38, 38], [38, 38], [-20, 41], [20, 41]].forEach(([dx, dy]) => {
                ctx.fillStyle = "#2a9d8f";
                ctx.beginPath();
                ctx.arc(this.x + dx, this.y + dy, 4, 0, Math.PI * 2);
                ctx.fill();
            });

        } else if (this.tipo === "mesa") {
            // MESA RÚSTICA ISOMÉTRICA DE ÁLBUM

            // Sombra da mesa
            if (!isShadow) {
                ctx.fillStyle = "rgba(0,0,0,0.06)";
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 35);
                ctx.lineTo(this.x + 72, this.y + 46);
                ctx.lineTo(this.x, this.y + 57);
                ctx.lineTo(this.x - 72, this.y + 46);
                ctx.closePath();
                ctx.fill();
            }

            // Pernas Traseiras/Laterais (Madeira isométrica)
            ctx.strokeStyle = "#3d2f26";
            ctx.lineWidth = 3.5;
            // Perna esquerda
            ctx.beginPath();
            ctx.moveTo(this.x - 45, this.y + 18);
            ctx.lineTo(this.x - 45, this.y + 46);
            ctx.stroke();
            // Perna direita
            ctx.beginPath();
            ctx.moveTo(this.x + 45, this.y + 18);
            ctx.lineTo(this.x + 45, this.y + 46);
            ctx.stroke();
            // Perna central frontal (mais próxima ao espectador)
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 24);
            ctx.lineTo(this.x, this.y + 50);
            ctx.stroke();

            // Travas de madeira conectando as pernas
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 45, this.y + 36);
            ctx.lineTo(this.x, this.y + 42);
            ctx.lineTo(this.x + 45, this.y + 36);
            ctx.stroke();

            // Tampo de Madeira de Baixo (Borda/Extrusão da mesa)
            ctx.fillStyle = "#8d705c";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 8);
            ctx.lineTo(this.x + 62, this.y + 18);
            ctx.lineTo(this.x + 62, this.y + 26);
            ctx.lineTo(this.x, this.y + 32);
            ctx.lineTo(this.x - 62, this.y + 26);
            ctx.lineTo(this.x - 62, this.y + 18);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Tampo de Cima da Mesa (Vidro Verde-Água Translúcido)
            ctx.fillStyle = "rgba(42, 157, 143, 0.82)";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 6);
            ctx.lineTo(this.x + 60, this.y + 16);
            ctx.lineTo(this.x, this.y + 24);
            ctx.lineTo(this.x - 60, this.y + 16);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Detalhe de brilho na borda de vidro
            ctx.strokeStyle = "#48bcae";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 10);
            ctx.lineTo(this.x + 48, this.y + 18);
            ctx.lineTo(this.x, this.y + 22);
            ctx.lineTo(this.x - 48, this.y + 18);
            ctx.closePath();
            ctx.stroke();

            // Livro Aberto Isométrico no Centro
            ctx.save();
            ctx.translate(this.x, this.y + 12);

            // Capa sob as páginas
            ctx.fillStyle = "#c44b2e";
            ctx.beginPath();
            ctx.moveTo(0, -11);
            ctx.lineTo(20, -5);
            ctx.lineTo(20, 7);
            ctx.lineTo(0, 1);
            ctx.lineTo(-20, 7);
            ctx.lineTo(-20, -5);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Páginas Abertas (Fundo Creme, isométrico)
            ctx.fillStyle = "#fdf0d5";

            // Lado Esquerdo do Livro
            ctx.beginPath();
            ctx.moveTo(-18, -4);
            ctx.lineTo(0, -9);
            ctx.lineTo(0, 1);
            ctx.lineTo(-18, 6);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Lado Direito do Livro
            ctx.beginPath();
            ctx.moveTo(0, -9);
            ctx.lineTo(18, -4);
            ctx.lineTo(18, 6);
            ctx.lineTo(0, 1);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Detalhe das linhas do lombo/dobra do livro
            ctx.strokeStyle = "#8d705c";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -9);
            ctx.lineTo(0, 2);
            ctx.stroke();

            // Miniaturas de "selos" ou desenhos isométicos nas páginas
            ctx.fillStyle = "#8338ec";
            ctx.fillRect(-12, 0, 4, 3);
            ctx.fillStyle = "#2a9d8f";
            ctx.fillRect(8, -1, 4, 3);

            ctx.restore();
        }

        // Nome da estrutura
        if (!isShadow) {
            ctx.fillStyle = "#3d2f26";
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(this.nome, this.x, this.y - 95);
        }
    }
}
export const estruturasPadrao = [
    new Structure("customizadora", 400, 390, "terminal", "Terminal de Resgate", 75),
    new Structure("mesaSolar", 840, 390, "mesa", "Mesa do Álbum", 70),
];
