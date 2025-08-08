import { convierteRadianes,distanciaEntrePuntos , FOV, modo, canvasAlto, canvasAncho, zBuffer } from "./globals.js";

const FOVRadianes = convierteRadianes(FOV);
const FOV_medio = convierteRadianes(FOV / 2);

export class Sprite {
  constructor(x, y, imagen, jugador, ctx) {
    this.x = x;
    this.y = y;
    this.imagen = imagen;

    this.distancia = 0;
    this.angulo = 0;

    this.visible = false;
    this.jugador = jugador;
    this.ctx = ctx;

  }

  //CALCULAMOS EL ÁNGULO CON RESPECTO AL JUGADOR
  calculaAngulo() {
    var vectX = this.x - this.jugador.x;
    var vectY = this.y - this.jugador.y;

    var anguloJugadorObjeto = Math.atan2(vectY, vectX);
    var diferenciaAngulo = this.jugador.anguloRotacion - anguloJugadorObjeto;

    if (diferenciaAngulo < -3.14159) {
        diferenciaAngulo += 2.0 * 3.14159;
    } else if (diferenciaAngulo > 3.14159) {
        diferenciaAngulo -= 2.0 * 3.14159;
    }

    diferenciaAngulo = Math.abs(diferenciaAngulo);

    if (diferenciaAngulo < FOV_medio) {
        this.visible = true;
    } else {
        this.visible = false;
    }
    }

  calculaDistancia() {
    this.distancia = distanciaEntrePuntos(this.jugador.x, this.jugador.y, this.x, this.y)
  }

  actualizaDatos() {
    this.calculaAngulo();
    this.calculaDistancia();
  }

  dibuja() {
    this.actualizaDatos();
    //punto mapa (Borrar)
    if (modo == 1) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
    }

    if (this.visible == true) {
      var altoTile = 500;		//Es la altura que tendrá el sprite al renderizarlo
      var distanciaPlanoProyeccion = (canvasAncho / 2) / Math.tan(FOV / 2);
      var alturaSprite = (altoTile / this.distancia) * distanciaPlanoProyeccion;

      //CALCULAMOS DONDE EMPIEZA Y ACABA LA LÍNEA, CENTRÁNDOLA EN PANTALLA (EN VERTICAL)
      var y0 = parseInt(canvasAlto / 2) - parseInt(alturaSprite / 2);
      var y1 = y0 + alturaSprite;

      var altoTextura = 64;
      var anchoTextura = 64;

      var alturaTextura = y0 - y1;
      var anchuraTextura = alturaTextura;	//LOS SPRITES SON CUADRADOS

      //---------------------------------------------------------------------------
      // CALCULAMOS LA COORDENADA X DEL SPRITE
      var dx = this.x - this.jugador.x;
      var dy = this.y - this.jugador.y;

      var spriteAngle = Math.atan2(dy, dx) - this.jugador.anguloRotacion;

      var viewDist = 500;

      var x0 = Math.tan(spriteAngle) * viewDist;
      var x = (canvasAncho / 2 + x0 - anchuraTextura / 2);

      //-----------------------------------------------------------------------------
      this.ctx.imageSmoothingEnabled = false;	//PIXELAMOS LA IMAGEN

      //proporción de anchura de X (según nos acerquemos, se verán más anchas las líneas verticales)
      var anchuraColumna = alturaTextura / altoTextura;

      //DIBUJAMOS EL SPRITE COLUMNA A COLUMNA PARA EVITAR QUE SE VEA TRAS UN MURO
      //LO HAGO CON DOS BUCLES, PARA ASEGURARME QUE DIBUJO LÍNEA A LÍNEA Y NO TIRAS DE LA IMAGEN 

      for (let i = 0; i < anchoTextura; i++) {
        for (let j = 0; j < anchuraColumna; j++) {

          var x1 = parseInt(x + ((i - 1) * anchuraColumna) + j);

          //COMPARAMOS LA LÍNEA ACTUAL CON LA DISTANCIA DEL ZBUFFER PARA DECIDIR SI DIBUJAMOS
          if (zBuffer[x1] > this.distancia) {
            this.ctx.drawImage(this.imagen, i, 0, 1, altoTextura - 1, x1, y1, 1, alturaTextura);
          }
        }
      }
    }
  }

}