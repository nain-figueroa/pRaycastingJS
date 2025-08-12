import { normalizaAngulo, distanciaEntrePuntos } from "./functions.js";
import { canvasAlto, canvasAncho, FOV, tamTile, zBuffer, tiles } from "../globalsVar.js";
import { Level } from "./level.js";

export class Ray {
    public ctx: CanvasRenderingContext2D;
    public escenario: Level;

    public x: number;
    public y: number;

    public incrementoAngulo: number;
    public anguloJugador: number;
    public angulo: number;

    public columna: number;

    public wallHitX: number = 0;
    public wallHitY: number = 0;

    public wallHitXHorizontal: number = 0;
    public wallHitYHorizontal: number = 0;

    public wallHitXVertical: number = 0;
    public wallHitYVertical: number = 0;

    public distancia: number = 0;

    public pixelTextura: number = 0;
    public idTextura: number = 0;

    public distanciaPlanoProyeccion: number;

    public xIntercept: number = 0;
    public yIntercept: number = 0;
    public xStep: number = 0;
    public yStep: number = 0;

    public abajo: boolean = false;
    public izquierda: boolean = false;

    public hCamara: number = 0;

    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number, anguloJugador: number, incrementoAngulo: number, columna: number) {
        this.ctx = ctx;
        this.escenario = escenario;

        this.x = x;
        this.y = y;

        this.incrementoAngulo = incrementoAngulo;
        this.anguloJugador = anguloJugador;
        this.angulo = anguloJugador + incrementoAngulo;

        this.columna = columna;

        this.distanciaPlanoProyeccion = (canvasAncho / 2) / Math.tan(FOV / 2);
    }

    setAngulo(angulo: number): void {
        this.anguloJugador = angulo;
        this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
    }

    cast(): void {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.xStep = 0;
        this.yStep = 0;

        this.abajo = false;
        this.izquierda = false;

        if (this.angulo < Math.PI) {
            this.abajo = true;
        }

        if (this.angulo > Math.PI / 2 && this.angulo < 3 * Math.PI / 2) {
            this.izquierda = true;
        }

        // HORIZONTAL
        let choqueHorizontal = false;

        this.yIntercept = Math.floor(this.y / tamTile) * tamTile;
        if (this.abajo) {
            this.yIntercept += tamTile;
        }

        let adyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);
        this.xIntercept = this.x + adyacente;

        this.yStep = tamTile;
        this.xStep = this.yStep / Math.tan(this.angulo);

        if (!this.abajo) {
            this.yStep *= -1;
        }

        if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) {
            this.xStep *= -1;
        }

        let siguienteXHorizontal = this.xIntercept;
        let siguienteYHorizontal = this.yIntercept;

        if (!this.abajo) {
            siguienteYHorizontal--;
        }

        while (!choqueHorizontal) {
            let casillaX = Math.trunc(siguienteXHorizontal / tamTile);
            let casillaY = Math.trunc(siguienteYHorizontal / tamTile);

            if (this.escenario.colision(casillaX, casillaY)) {
                choqueHorizontal = true;
                this.wallHitXHorizontal = siguienteXHorizontal;
                this.wallHitYHorizontal = siguienteYHorizontal;
            } else {
                siguienteXHorizontal += this.xStep;
                siguienteYHorizontal += this.yStep;
            }
        }

        // VERTICAL
        let choqueVertical = false;

        this.xIntercept = Math.floor(this.x / tamTile) * tamTile;
        if (!this.izquierda) {
            this.xIntercept += tamTile;
        }

        let opuesto = (this.xIntercept - this.x) * Math.tan(this.angulo);
        this.yIntercept = this.y + opuesto;

        this.xStep = tamTile;
        if (this.izquierda) {
            this.xStep *= -1;
        }

        this.yStep = tamTile * Math.tan(this.angulo);

        if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) {
            this.yStep *= -1;
        }

        let siguienteXVertical = this.xIntercept;
        let siguienteYVertical = this.yIntercept;

        if (this.izquierda) {
            siguienteXVertical--;
        }

        while (!choqueVertical && (siguienteXVertical >= 0 && siguienteYVertical >= 0 && siguienteXVertical < canvasAncho && siguienteYVertical < canvasAlto)) {
            let casillaX = Math.trunc(siguienteXVertical / tamTile);
            let casillaY = Math.trunc(siguienteYVertical / tamTile);

            if (this.escenario.colision(casillaX, casillaY)) {
                choqueVertical = true;
                this.wallHitXVertical = siguienteXVertical;
                this.wallHitYVertical = siguienteYVertical;
            } else {
                siguienteXVertical += this.xStep;
                siguienteYVertical += this.yStep;
            }
        }

        // Distancias
        let distanciaHorizontal = 9999;
        let distanciaVertical = 9999;

        if (choqueHorizontal) {
            distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
        }

        if (choqueVertical) {
            distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
        }

        if (distanciaHorizontal < distanciaVertical) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
            this.distancia = distanciaHorizontal;

            let casilla = Math.trunc(this.wallHitX / tamTile);
            this.pixelTextura = this.wallHitX - (casilla * tamTile);

            this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);

        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distancia = distanciaVertical;

            let casilla = Math.trunc(this.wallHitY / tamTile) * tamTile;
            this.pixelTextura = this.wallHitY - casilla;

            this.idTextura = this.escenario.tile(this.wallHitX, this.wallHitY);
        }

        // Corrección ojo de pez
        this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));

        // Guardamos en zBuffer
        zBuffer[this.columna] = this.distancia;
    }

    color(): string {
        let paso = 526344;
        let bloque = Math.trunc(canvasAlto / 36);
        let matiz = Math.trunc(this.distancia / bloque);
        let gris = matiz * paso;
        let colorHex = "#" + gris.toString(16);
        return colorHex;
    }

    renderPared(): void {
        let altoTile = 500;
        let alturaMuro = (altoTile / this.distancia) * this.distanciaPlanoProyeccion;

        let y0 = Math.trunc(canvasAncho / 2) - Math.trunc(alturaMuro / 2);
        let y1 = y0 + alturaMuro;
        let x = this.columna;

        let altura = 0;

        let altoTextura = 64;
        let alturaTextura = y0 - y1;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(tiles, this.pixelTextura, ((this.idTextura - 1) * altoTextura), this.pixelTextura, 63, x, y1 + altura, 1, alturaTextura);
    }

    dibuja(): void {
        this.cast();
        this.renderPared();
    }
}