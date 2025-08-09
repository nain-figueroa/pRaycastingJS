import { sprites, canvasAlto, canvasAncho, modo, tiles} from "./globals.js";
import { reescalaCanvas, renderSprites } from "./functions.js";
import { Level } from "./level.js";
import { Player } from "./player.js";
import { Sprite } from "./sprite.js";

var canvas;
var ctx;
var FPS = 50;

//OBJETOS
var escenario;
var jugador;


//----------------------------------------------------------------------
//TECLADO
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
      jugador.avanzaSuelta();
      break;
    case 'ArrowDown':
      jugador.avanzaSuelta();
      break;
    case 'ArrowLeft':
      jugador.giraSuelta();
      break;
    case 'ArrowRight':
      jugador.giraSuelta();
      break;
  }
});

//----------------------------------------------------------------------
//NIVEL 1
var nivel1 = [
  [1, 1, 2, 1, 1, 1, 2, 2, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 1, 2, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 3, 3, 1],
  [1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//-------------------------------------------------------------------------------------
//SPRITES

var imgArmor;
var imgPlanta;

function inicializaSprites() {
  //CARGAMOS SPRITES
  imgArmor = new Image();
  imgArmor.src = "img/armor.png";

  imgPlanta = new Image();
  imgPlanta.src = "img/planta.png";

  //CREAMOS LOS OBJETOS PARA LAS IMÁGENES
  sprites[0] = new Sprite(300, 120, imgArmor, jugador, ctx);
  sprites[1] = new Sprite(150, 150, imgArmor, jugador, ctx);
  sprites[2] = new Sprite(320, 300, imgPlanta, jugador, ctx);
  sprites[3] = new Sprite(300, 380, imgPlanta, jugador, ctx);

}

//============================================================================ 
export function inicializa() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  //CARGAMOS TILES
  tiles.src = "img/walls.png";

  //MODIFICA EL TAMAÑO DEL CANVAS
  canvas.width = canvasAncho;
  canvas.height = canvasAlto;

  escenario = new Level(canvas, ctx, nivel1);
  jugador = new Player(ctx, escenario, 100, 100);

  //CARGAMOS LOS SPRITES DESPUÉS DEL ESCENARIO Y EL JUGADOR
  inicializaSprites();

  //EMPEZAMOS A EJECUTAR EL BUCLE PRINCIPAL
  setInterval(function () { principal(); }, 1000 / FPS);

  //AMPLIAMOS EL CANVAS CON CSS
  reescalaCanvas();
}

window.inicializa = inicializa;

function borraCanvas() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}


//PINTA COLORES BÁSICOS PARA SUELO Y TECHO
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