import { normalizaAngulo, distanciaEntrePuntos, canvasAlto, canvasAncho, FOV} from "./global.js";

var tamTile = 50;


export class Rayo {
    constructor(con, escenario, x, y, anguloJugador, incrementoAngulo, columna) {
        this.ctx = con;
        this.escenario = escenario;
        this.x = x;
        this.y = y;

        this.anguloJugador = anguloJugador
        this.incrementoAngulo = incrementoAngulo;
        this.angulo = anguloJugador + incrementoAngulo;
        
        this.wallHitx = 0;
        this.wallHity = 0;
        
        this.wallHitxHorizontal = 0;
        this.wallHitxVertical = 0;
        
        this.wallHityHorizontal = 0;
        this.wallHityVertical = 0;

        this.columna = columna;
        this.distancia = 0;

        this.distanciaPlanoProyeccion = (canvasAncho / 2) / Math.tan(FOV / 2);

    }

    setAngulo(angulo) {
        this.anguloJugador = angulo;
        this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
    }

    cast() {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.xStep = 0;
        this.yStep = 0;

        //Saber hacía donde mira el rayo
        this.abajo = false;
        this.izquierda = false;

        if (this.angulo < Math.PI) {
            this.abajo = true;
        }

        if (this.angulo > Math.PI / 2 && this.angulo < 3 * (Math.PI / 2)) {
            this.izquierda = true;
        }

        //Averiguar colision horizontal
        var choqueHorizontal = false;

        //Buscar primer intersección
        this.yIntercept = Math.floor(this.y / tamTile) * tamTile;

        //Si apunta hacía abajo, se incrementa un tile
        if (this.abajo) {
            this.yIntercept += tamTile;
        }

        var adyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);
        this.xIntercept = this.x + adyacente;

        //Calcular la distancia de cada paso
        this.yStep = tamTile;
        this.xStep = this.yStep / Math.tan(this.angulo);

        //Si vamos hacía arriba se invierte el paso y
        if (!this.abajo) {
            this.yStep *= -1;
        }

        //Comprobar coherencia del paso X
        if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) {
            this.xStep *= -1;
        }

        var siguienteXHorizontal = this.xIntercept;
        var siguienteYHorizontal = this.yIntercept;

        //Si se apunta hacía arriba, se resta un pixel para forzar la colisión
        if (!this.abajo) {
            siguienteYHorizontal = Math.floor(siguienteYHorizontal) - 0.0001;
        }

        //Bucle para buscar punto de colision
        while (!choqueHorizontal) {
            //Obtener casilla redondeando por abajo
            var casillaX = parseInt(siguienteXHorizontal / tamTile);
            var casillaY = parseInt(siguienteYHorizontal / tamTile);

            if (this.escenario.colision(casillaX, casillaY)) {
                choqueHorizontal = true;
                this.wallHitxHorizontal = siguienteXHorizontal;
                this.wallHityHorizontal = siguienteYHorizontal;
            } else {
                siguienteXHorizontal += this.xStep;
                siguienteYHorizontal += this.yStep;
            }
        }

        //Colision vertical
        var choqueVertical = false;
        //Primer choque
        this.xIntercept = Math.floor(this.x / tamTile) * tamTile;

        //Si apunta a la derechas incrementa 1 tile
        if (!this.izquierda) {
            this.xIntercept += tamTile;
        }

        //Se le suma el cateto opuesto
        var opuesto = (this.xIntercept - this.x) * Math.tan(this.angulo);
        this.yIntercept = this.y + opuesto;

        //Distancia de cada paso
        this.xStep = tamTile;

        //Si va a la izquierda se invierte
        if (this.izquierda) {
            this.xStep *= -1;
        }

        this.yStep = tamTile * Math.tan(this.angulo);

        //Si Y va hacía arriba se invierte
        if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) {
            this.yStep *= -1
        }

        var siguienteXVertical = this.xIntercept;
        var siguienteYVertical = this.yIntercept;

        if (this.izquierda) {
            siguienteXVertical = Math.floor(siguienteXVertical) - 0.0001;
        }

        //Bucle para colision
        var mapaAncho = this.escenario.ancho * tamTile;
        var mapaAlto = this.escenario.alto * tamTile;

        while (!choqueVertical && (siguienteXVertical >= 0 && siguienteYVertical >= 0 && siguienteXVertical < mapaAncho && siguienteYVertical < mapaAlto)) {
            //Obtener casilla redondeando por abajo
            var casillaX = parseInt(siguienteXVertical / tamTile);
            var casillaY = parseInt(siguienteYVertical / tamTile);

            if (this.escenario.colision(casillaX, casillaY)) {
                choqueVertical = true;
                this.wallHitxVertical = siguienteXVertical;
                this.wallHityVertical = siguienteYVertical;
            } else {
                siguienteXVertical += this.xStep;
                siguienteYVertical += this.yStep;
            }
        }

        var distanciaHorizontal = 9999;
        var distanciaVertical = 9999;

        if (choqueHorizontal) {
            distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitxHorizontal, this.wallHityHorizontal);
        }
        if (choqueVertical) {
            distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitxVertical, this.wallHityVertical);
        }

        if (distanciaHorizontal <= distanciaVertical) {
            this.wallHitx = this.wallHitxHorizontal;
            this.wallHity = this.wallHityHorizontal;
            this.distancia = distanciaHorizontal;
        } else {
            this.wallHitx = this.wallHitxVertical;
            this.wallHity = this.wallHityVertical;
            this.distancia = distanciaVertical;
        }

        //Coreccion ojo de pez
        // this.distancia = this.distancia * (Math.cos(this.angulo - this.anguloJugador));
        //let dif = normalizaAngulo(this.angulo - this.anguloJugador);
        //this.distancia *= Math.cos(dif);
    }

    rederPared() {
        // this.cast();
        var altoTile = 500; 
        var alturaMuro = (altoTile / this.distancia) * this.distanciaPlanoProyeccion;
        //var alturaMuro = Math.min(alturaMuro, canvasAlto);

        //Calcular  fin e inicio de la linea
        var y0 = parseInt(canvasAlto/2) - parseInt(alturaMuro / 2);
        var y1 = y0 + alturaMuro;
        var x = this.columna;

        //Dibujar columna
        this.ctx.beginPath();
        this.ctx.moveTo(x, y0);
        this.ctx.lineTo(x, y1);
        this.ctx.strokeStyle = '#666666';
        this.ctx.stroke();

    }

    dibuja() {
        this.cast();
        this.rederPared();
        // var xDestino = this.wallHitx;
        // var yDestion = this.wallHity;

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.x, this.y);
        // this.ctx.lineTo(xDestino, yDestion);
        // this.ctx.strokeStyle = 'red';
        // this.ctx.stroke();
    }


}