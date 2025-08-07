const jugadorColor = '#FFFFFF';

function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);

    if (angulo < 0) {
        angulo = angulo + (2 * Math.PI);
    }

    return angulo;
}

export class Player {
    constructor(con, escenario, x, y) {
        this.ctx = con;
        this.escenario = escenario;

        this.x = x;
        this.y = y;

        this.avanza = 0; //-> 0 = parado, 1 = delante, -1 = atrás
        this.gira = 0;  //-> -1 = izquiera, 1 = derecha

        this.anguloRotacion = 0;

        this.velMovimiento = 3; //Pixels
        this.velGiro = 3 * (Math.PI / 180); //Grados
    }

    colision(x, y) {
        var choca = false;

        //Averiguar en casilla está el jugador
        var casillaX = parseInt(x / this.escenario.anchoT);
        var casillaY = parseInt(y / this.escenario.altoT);

        if (this.escenario.colision(casillaX, casillaY)) {
            choca = true;
        }

        return choca;
    }

    actualiza() {
        //avanzar
        var nuevaX = this.x + (this.avanza * Math.cos(this.anguloRotacion) * this.velMovimiento);
        var nuevaY = this.y + (this.avanza * Math.sin(this.anguloRotacion) * this.velMovimiento);

        if (!this.colision(nuevaX, nuevaY)) {
            this.x = nuevaX;
            this.y = nuevaY;
        }


        //girar
        this.anguloRotacion += this.gira * this.velGiro;
        this.anguloRotacion = normalizaAngulo(this.anguloRotacion);
    }

    dibuja() {
        this.actualiza();

        //Cuadrito
        this.ctx.fillStyle = jugadorColor;
        this.ctx.fillRect((this.x - 3), (this.y -3), 6, 6);

        var xDestino = this.x + Math.cos(this.anguloRotacion) * 40;
        var yDestino = this.y + Math.sin(this.anguloRotacion) * 40;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStryle = '#FFFFFF';
        this.ctx.stroke();
    }


    arriba() {
        this.avanza = 1;
    }

    abajo() {
        this.avanza = -1;
    }

    izquierda() {
        this.gira = -1;
    }

    derecha() {
        this.gira = 1;
    }

    avanzaSuelta() {
        this.avanza = 0;
    }

    giraSuelta() {
        this.gira = 0;
    }

}