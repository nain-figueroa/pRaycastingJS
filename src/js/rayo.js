var tamTile = 50;

export function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);

    if (angulo < 0) {
        angulo = angulo + (2 * Math.PI);
    }

    return angulo;
}

function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 * x1) + (y2 - y1) - (y2 - y1));
}

export class Rayo {
    constructor(con, escenario, x, y, anguloJugador, incrementoAngulo, columna) {
        this.ctx = con;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.anguloJugador = anguloJugador;
        this.incrementoAngulo = incrementoAngulo;
        this.columna = columna;

        this.wallHitx = 0;
        this.wallHity = 0;

        this.wallHitxHorizontal = 0;
        this.wallHitxVertical = 0;

        this.wallHityHorizontal = 0;
        this.wallHityVertical = 0;

    }

    setAngulo(angulo) {
        this.anguloJugador = normalizaAngulo(angulo + this.incrementoAngulo);
    }

    cast() {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.xStep = 0;
        this.yStep = 0;

        //Saber hacía donde mira el rayo
        this.abajo = false;
        this.izquierda = false;

        if (this.anguloJugador < Math.PI) {
            this.abajo = true;
        }

        if (this.anguloJugador > Math.PI / 2 && this.anguloJugador < 3 * Math.PI / 2) {
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

        var adyacente = (this.yIntercept - this.y) / Math.tan(this.anguloJugador);
        this.xIntercept = this.x + adyacente;

        //Calcular la distancia de cada paso
        this.yStep = tamTile;
        this.xStep = this.yStep / Math.tan(this.anguloJugador);

        //Si vamos hacía arriba se invierte el paso y
        if (!this.abajo) {
            this.yStep = -this.yStep;
        }

        //Comprobar coherencia del paso X
        if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) {
            this.xStep = -this.xStep;
        }

        var siguieteXHorizontal = this.xIntercept;
        var siguieteYHorizontal = this.yIntercept;

        //Si se apunta hacía arriba, se resta un pixel para forzar la colisión
        if (!this.abajo) {
            siguieteYHorizontal--;
        }

        //Bucle para buscar punto de colision
        while (!choqueHorizontal) {
            //Obtener casilla redondeando por abajo
            var casillaX = parseInt(siguieteXHorizontal / tamTile);
            var casillaY = parseInt(siguieteYHorizontal / tamTile);

            if (this.escenario.colision(casillaX, casillaY)) {
                choqueHorizontal = true;
                this.wallHitxHorizontal = siguieteXHorizontal;
                this.wallHityHorizontal = siguieteYHorizontal;
            } else {
                siguieteXHorizontal += this.xStep;
                siguieteYHorizontal += this.yStep;
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
        var opuesto = (this.xIntercept - this.x) * Math.tan(this.anguloJugador);
        this.yIntercept = this.y + opuesto;

        //Distancia de cada paso
        this.xStep = tamTile;

        //Si va a la izquierda se invierte
        if (this.izquierda) {
            this.xStep *= -1;
        }

        this.yStep = tamTile * Math.tan(this.anguloJugador);

        //Si Y va hacía arriba se invierte
        if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) {
            this.yStep *= -1
        }

        var siguienteXVertical = this.xIntercept;
        var siguienteYVertical = this.yIntercept;

        if (this.izquierda) {
            siguienteXVertical--;
        }

        //Bucle para colision
        while (!choqueVertical && (siguienteXVertical >= 0 && siguienteYVertical >= 0 && siguienteXVertical < 500 && siguienteYVertical < 500)) {
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

        if (distanciaHorizontal < distanciaVertical) {
            this.wallHitx = this.wallHitxHorizontal;
            this.wallHity = this.wallHityHorizontal;
        } else {
            this.wallHitx = this.wallHitxVertical;
            this.wallHity = this.wallHityVertical;
        }
    }

    dibuja() {
        this.cast();
        var xDestino = this.wallHitx;
        var yDestion = this.wallHity;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(xDestino, yDestion);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
    }


}