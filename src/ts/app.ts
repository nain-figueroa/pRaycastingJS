import { sprites,  canvasAlto, canvasAncho, tiles } from "./globalsVar.js";
import { level1 } from "./levels.js";
import { renderSprites } from "./modules/functions.js";
import { Level } from "./modules/level.js";
import { Player } from "./modules/player.js";
import { Sprite } from "./modules/sprite.js";

declare global {
    interface Window {
        inicializa: () => void;
    }
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let FPS = 50;

let escenario: Level;
let jugador: Player;

document.addEventListener('keydown', function (tecla) {
    switch (tecla.key) {
        case 'ArrowUp':
            jugador.arriba();
            break;
        case 'ArrowDown':
            jugador.abajo();
            break;
        case 'ArrowRight':
            jugador.derecha();
            break;
        case 'ArrowLeft':
            jugador.izquierda();
            break;
    }
});

document.addEventListener('keyup', function (tecla) {
    switch (tecla.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            jugador.avanzaSuelta();
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            jugador.giraSuelta();
            break;
    }
});

// SPRITES
let imgArmor: HTMLImageElement;
let imgPlanta: HTMLImageElement;

function inicializaSprites() {
    imgArmor = new Image();
    imgArmor.src = "img/armor.png";

    imgPlanta = new Image();
    imgPlanta.src = "img/planta.png";

    sprites[0] = new Sprite(300, 120, imgArmor, jugador, ctx);
    sprites[1] = new Sprite(150, 150, imgArmor, jugador, ctx);
    sprites[2] = new Sprite(320, 300, imgPlanta, jugador, ctx);
    sprites[3] = new Sprite(300, 380, imgPlanta, jugador, ctx);
}

export function inicializa(): void {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    tiles.src = "img/walls.png";

    canvas.width = canvasAncho;
    canvas.height = canvasAlto;

    escenario = new Level(canvas, ctx, level1);
    jugador = new Player(ctx, escenario, 100, 100);

    inicializaSprites();

    setInterval(function () { principal(); }, 1000 / FPS);
}

window.inicializa = inicializa;

function borraCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function sueloTecho() {
    ctx.fillStyle = '#666666';
    ctx.fillRect(0, 0, 500, 250);

    ctx.fillStyle = '#752300';
    ctx.fillRect(0, 250, 500, 500);
}

function principal() {
    borraCanvas();
    sueloTecho();
    jugador.dibuja();
    renderSprites(sprites);
}