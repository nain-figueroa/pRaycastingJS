import {Player} from "./player.js"
import { Level } from "./level.js";

var canvas;
var ctx;
const FPS = 50;

//Dimensiones canvas
var canvasAncho = 500;
var canvasAlto = 500;

var escenario;
var jugador;


//Nivel
var nivel1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//Teclado
document.addEventListener('keydown', function(tecla){
  switch(tecla.code) {
    case 'ArrowUp':
      jugador.arriba();
      break;
    case 'ArrowDown':
      jugador.abajo();
      break;
    case 'ArrowLeft':
      jugador.izquierda();
      break;
    case 'ArrowRight':
      jugador.derecha();
      break;
  }
});

document.addEventListener('keyup', function(tecla) {
  switch(tecla.code) {
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

export function inicializa() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  //Modificar el tamaño del canvas
  canvas.width = canvasAncho;
  canvas.height = canvasAlto;

  escenario = new Level(canvas, ctx, nivel1);
  jugador = new Player(ctx, escenario, 200, 100);

  //Iniciamos el bucle principal del juego
  setInterval(function(){principal();}, 1000/FPS);
}

window.inicializa = inicializa;

function borrarCanvas() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}


function principal(){
  borrarCanvas();
  escenario.dibuja();
  jugador.dibuja();
}
