import { normalizaAngulo, distanciaEntrePuntos, canvasAlto, canvasAncho, FOV, tamTile, zBuffer, modo, tiles } from "./globals.js";

export class Rayo {
  constructor(con, escenario, x, y, anguloJugador, incrementoAngulo, columna) {
    this.ctx = con;
    this.escenario = escenario;

    this.x = x;
    this.y = y;

    this.incrementoAngulo = incrementoAngulo;
    this.anguloJugador = anguloJugador;
    this.angulo = anguloJugador + incrementoAngulo;

    this.wallHitX = 0;
    this.wallHitY = 0;

    //LO SUSTITUIREMOS LUEGO POR VARIABLES LOCALES
    this.wallHitXHorizontal = 0;	//colisión con pared
    this.wallHitYHorizontal = 0;	//colisicón con pared

    this.wallHitXVertical = 0;	//colisión con pared
    this.wallHitYVertical = 0;	//colisicón con pared

    this.columna = columna;		//para saber la columna que hay que renderizar
    this.distancia = 0;	//para saber el tamaño de la pared al hacer el render

    this.pixelTextura = 0;	//pixel / columna de la textura
    this.idTextura = 0;		//valor de la matriz

    this.distanciaPlanoProyeccion = (canvasAncho / 2) / Math.tan(FOV / 2);
    //============================================
    //PRUEBAS
    this.hCamara = 0; //movimiento vertical de la camara

  }
  //HAY QUE NORMALIZAR EL ÁNGULO PARA EVITAR QUE SALGA NEGATIVO
  setAngulo(angulo) {
    this.anguloJugador = angulo;
    this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
  }

  cast() {
    this.xIntercept = 0;
    this.yIntercept = 0;

    this.xStep = 0;
    this.yStep = 0;

    //TENEMOS QUE SABER EN QUÉ DIRECCIÓN VA EL RAYO
    this.abajo = false;
    this.izquierda = false;

    if (this.angulo < Math.PI) {
        this.abajo = true;
    }

    if (this.angulo > Math.PI / 2 && this.angulo < 3 * Math.PI / 2) {
        this.izquierda = true;
    }

    //=======================================================================
    // HORIZONTAL									
    var choqueHorizontal = false;	//detectamos si hay un muro

    //BUSCAMOS LA PRIMERA INTERSECCIÓN HORIZONTAL (X,Y)
    this.yIntercept = Math.floor(this.y / tamTile) * tamTile; 						//el Y es fácil, se redondea por abajo para conocer el siguiente

    //SI APUNTA HACIA ABAJO, INCREMENTAMOS 1 TILE
    if (this.abajo) {
        this.yIntercept += tamTile;		//no se redondea por abajo, sino por arriba, así que sumamos 1 a la Y
    }

    //SE LE SUMA EL CATETO ADYACENTE
    var adyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);	//calculamos la x con la tangente
    this.xIntercept = this.x + adyacente;

    //------------------------------------------------------------------------
    //CALCULAMOS LA DISTANCIA DE CADA PASO
    this.yStep = tamTile;								//al colisionar con la Y, la distancia al próximo es la del tile
    this.xStep = this.yStep / Math.tan(this.angulo);	//calculamos el dato con la tangente

    //SI VAMOS HACIA ARRIBA O HACIA LA IZQUIERDA, EL PASO ES NEGATIVO
    if (!this.abajo) {
        this.yStep *= -1;
    }

    //CONTROLAMOS EL INCREMENTO DE X, NO SEA QUE ESTÉ INVERTIDO
    if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) {
      this.xStep *= -1;
    }

    //COMO LAS INTERSECCIONES SON LÍNEAS, TENEMOS QUE AÑADIR UN PIXEL EXTRA O QUITARLO PARA QUE ENTRE
    //DENTRO DE LA CASILLA
    var siguienteXHorizontal = this.xIntercept;
    var siguienteYHorizontal = this.yIntercept;

    //SI APUNTA HACIA ARRIBA, FORZAMOS UN PIXEL EXTRA
    if (!this.abajo) {
        siguienteYHorizontal--;
    }

    //BUCLE PARA BUSCAR EL PUNTO DE COLISIÓN
    while (!choqueHorizontal) {
      //OBTENEMOS LA CASILLA (REDONDEANDO POR ABAJO)
      var casillaX = parseInt(siguienteXHorizontal / tamTile);
      var casillaY = parseInt(siguienteYHorizontal / tamTile);

      if (this.escenario.colision(casillaX, casillaY)) {
        choqueHorizontal = true;
        this.wallHitXHorizontal = siguienteXHorizontal;
        this.wallHitYHorizontal = siguienteYHorizontal;
      }
      else {
        siguienteXHorizontal += this.xStep;
        siguienteYHorizontal += this.yStep;
      }
    }
    //=======================================================================
    // VERTICAL									
    var choqueVertical = false;	//detectamos si hay un muro

    //BUSCAMOS LA PRIMERA INTERSECCIÓN VERTICAL (X,Y)
    this.xIntercept = Math.floor(this.x / tamTile) * tamTile; 		//el x es fácil, se redondea por abajo para conocer el siguiente

    //SI APUNTA HACIA LA DERECHA, INCREMENTAMOS 1 TILE
    if (!this.izquierda) {
        this.xIntercept += tamTile;		//no se redondea por abajo, sino por arriba, así que sumamos 1 a la X
    }

    //SE LE SUMA EL CATETO OPUESTO
    var opuesto = (this.xIntercept - this.x) * Math.tan(this.angulo);
    this.yIntercept = this.y + opuesto;

    //------------------------------------------------------------------------
    //CALCULAMOS LA DISTANCIA DE CADA PASO
    this.xStep = tamTile;								//al colisionar con la X, la distancia al próximo es la del tile

    //SI VA A LA IZQUIERDA, INVERTIMOS
    if (this.izquierda) {
        this.xStep *= -1;
    }


    this.yStep = tamTile * Math.tan(this.angulo);	//calculamos el dato con la tangente

    //CONTROLAMOS EL INCREMENTO DE Y, NO SEA QUE ESTÉ INVERTIDO
    if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) {
      this.yStep *= -1;
    }

    //COMO LAS INTERSECCIONES SON LÍNEAS, TENEMOS QUE AÑADIR UN PIXEL EXTRA O QUITARLO PARA QUE ENTRE
    //DENTRO DE LA CASILLA
    var siguienteXVertical = this.xIntercept;
    var siguienteYVertical = this.yIntercept;

    //SI APUNTA HACIA IZQUIERDA, FORZAMOS UN PIXEL EXTRA
    if (this.izquierda) {
        siguienteXVertical--;
    }

    //BUCLE PARA BUSCAR EL PUNTO DE COLISIÓN
    while (!choqueVertical && (siguienteXVertical >= 0 && siguienteYVertical >= 0 && siguienteXVertical < canvasAncho && siguienteYVertical < canvasAlto)) {
      //OBTENEMOS LA CASILLA (REDONDEANDO POR ABAJO)
      var casillaX = parseInt(siguienteXVertical / tamTile);
      var casillaY = parseInt(siguienteYVertical / tamTile);

      if (this.escenario.colision(casillaX, casillaY)) {
        choqueVertical = true;
        this.wallHitXVertical = siguienteXVertical;
        this.wallHitYVertical = siguienteYVertical;
      } else {
        siguienteXVertical += this.xStep;
        siguienteYVertical += this.yStep;
      }
    }
    //============================================================
    //MIRAMOS CUÁL ES EL MÁS CORTO ¿VERTICAL U HORIZONTAL?

    //INICIALIZAMOS CON DISTANCIAS GRANDES PARA QUE SEPA CUAL LE TOCA
    var distanciaHorizontal = 9999;
    var distanciaVertical = 9999;

    if (choqueHorizontal) {
      distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
    }

    if (choqueVertical) {
      distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
    }

    //COMPARAMOS LAS DISTANCIAS
    if (distanciaHorizontal < distanciaVertical) {
      this.wallHitX = this.wallHitXHorizontal;
      this.wallHitY = this.wallHitYHorizontal;
      this.distancia = distanciaHorizontal;

      //PIXEL TEXTURA
      var casilla = parseInt(this.wallHitX / tamTile);
      this.pixelTextura = this.wallHitX - (casilla * tamTile);

      //ID TEXTURA
      this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);

    } else {
      this.wallHitX = this.wallHitXVertical;
      this.wallHitY = this.wallHitYVertical;
      this.distancia = distanciaVertical;

      //PIXEL TEXTURA
      var casilla = parseInt(this.wallHitY / tamTile) * tamTile;
      this.pixelTextura = this.wallHitY - casilla;

      //ID TEXTURA
      this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);
    }

    //CORREGIMOS EL EFECTO OJO DE PEZ
    this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));

    //GUARDAMOS LA INFO EN EL ZBUFFER
    zBuffer[this.columna] = this.distancia;
  }

  color() {
    //https://www.w3schools.com/colors/colors_shades.asp
    //36 posibles matices
    var paso = 526344;		//Todos son múltiplos de #080808 = 526344(decimal);

    var bloque = parseInt(canvasAlto / 36);
    var matiz = parseInt(this.distancia / bloque);
    var gris = matiz * paso;

    var colorHex = "#" + gris.toString(16);		//convertimos a hexadecimal (base 16)

    return (colorHex);
  }

  renderPared() {
    var altoTile = 500;		//Es la altura que tendrá el muro al renderizarlo
    var alturaMuro = (altoTile / this.distancia) * this.distanciaPlanoProyeccion;

    //CALCULAMOS DONDE EMPIEZA Y ACABA LA LÍNEA, CENTRÁNDOLA EN PANTALLA
    var y0 = parseInt(canvasAlto / 2) - parseInt(alturaMuro / 2);
    var y1 = y0 + alturaMuro;
    var x = this.columna;

    var altura = 0;	//borrar cuando usemos el código de abajo

    //DIBUJAMOS CON TEXTURA
    var altoTextura = 64;

    var alturaTextura = y0 - y1;
    this.ctx.imageSmoothingEnabled = false;	//PIXELAMOS LA IMAGEN
    this.ctx.drawImage(tiles, this.pixelTextura, ((this.idTextura - 1) * altoTextura), this.pixelTextura, 63, x, y1 + altura, 1, alturaTextura);
  }

  dibuja() {
    this.cast();
    this.renderPared();
  }
}
