import { convierteRadianes, normalizaAngulo } from "./functions.js";
import { FOV} from "./globals.js";
import { Rayo } from "./rayo.js";


export class Player {
  constructor(con, escenario, x, y) {
    this.ctx = con;
    this.escenario = escenario;

    this.x = x;
    this.y = y;

    this.avanza = 0;	//-1 atrás, 1 adelante
    this.gira = 0;		//-1 izquierda, 1 derecha

    this.anguloRotacion = 0;

    this.velGiro = convierteRadianes(3);		//3 grados en radianes
    this.velMovimiento = 3;

    //VISIÓN (RENDER)
    this.numRayos = 500;		//Cantidad de rayos que vamos a castear (los mismos que tenga el ancho del canvas)
    this.rayos = [];					//Array con todos los rayos

    //CALCULAMOS EL ANGULO DE LOS RAYOS
    var medioFOV = FOV / 2;
    var incrementoAngulo = convierteRadianes(FOV / this.numRayos);
    var anguloInicial = convierteRadianes(this.anguloRotacion - medioFOV);

    var anguloRayo = anguloInicial;

    //CREAMOS RAYOS
    for (let i = 0; i < this.numRayos; i++) {

      this.rayos[i] = new Rayo(this.ctx, this.escenario, this.x, this.y, this.anguloRotacion, anguloRayo, i);
      anguloRayo += incrementoAngulo;
    }
  }

  //LÓGICA DEL TECLADO
  arriba() {
    this.avanza = 1;
  }

  abajo() {
    this.avanza = -1;
  }

  derecha() {
    this.gira = 1;
  }

  izquierda() {
    this.gira = -1;
  }

  avanzaSuelta() {
    this.avanza = 0;
  }

  giraSuelta() {
    this.gira = 0;
  }

  colision(x, y) {
    var choca = false;

    //AVERIGUAMOS LA CASILLA A LA QUE CORRESPONDEN NUESTRAS COORDENADAS
    var casillaX = parseInt(x / this.escenario.anchoT);
    var casillaY = parseInt(y / this.escenario.altoT);

    if (this.escenario.colision(casillaX, casillaY))
      choca = true;

    return choca;
  }

  //ACTUALIZAMOS LA POSICIÓN
  actualiza() {
    //AVANZAMOS
    var nuevaX = this.x + this.avanza * Math.cos(this.anguloRotacion) * this.velMovimiento;
    var nuevaY = this.y + this.avanza * Math.sin(this.anguloRotacion) * this.velMovimiento;

    if (!this.colision(nuevaX, nuevaY)) {
      this.x = nuevaX;
      this.y = nuevaY;
    }

    //GIRAMOS
    this.anguloRotacion += this.gira * this.velGiro;
    this.anguloRotacion = normalizaAngulo(this.anguloRotacion);	//normalizamos

    //ACTUALIZAMOS LOS RAYOS
    for (let i = 0; i < this.numRayos; i++) {
      this.rayos[i].x = this.x;
      this.rayos[i].y = this.y;
      this.rayos[i].setAngulo(this.anguloRotacion);
    }
  }

  dibuja() {
    //ANTES DE DIBUJAR ACTUALIZAMOS
    this.actualiza();

    //RAYOS
    for (let i = 0; i < this.numRayos; i++) {
      this.rayos[i].dibuja();
    }
  }
}