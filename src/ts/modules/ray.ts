import { normalizaAngulo, distanciaEntrePuntos } from "./functions.js";
import { canvasAlto, canvasAncho, FOV, tamTile, zBuffer, tiles} from "../globalsVar.js";
import type { Coordinate } from "../globalsVar.js";
import { Level } from "./level.js";

export class Ray {
    public ctx: CanvasRenderingContext2D;
    public escenario: Level;

    public position: Coordinate;

    public incrementoAngulo: number;
    public anguloJugador: number;
    public angulo: number;

    public columna: number;

    public wallHit: Coordinate = { x: 0, y: 0};
    public wallHitHorizontal: Coordinate = {x: 0, y: 0};
    public wallHitVertical: Coordinate = {x: 0, y: 0};

    public distancia: number = 0;

    public pixelTextura: number = 0;
    public idTextura: number = 0;

    public distanciaPlanoProyeccion: number;

    public intercept: Coordinate = {x: 0, y: 0};
    public steps: Coordinate = {x: 0, y: 0};
    public directions: {down: boolean, left: boolean} = {down: false, left: false};

    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number, anguloJugador: number, incrementoAngulo: number, columna: number) {
        this.ctx = ctx;
        this.escenario = escenario;

        this.position = {x: x, y: y};

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
        let angleTangent: number = Math.tan(this.angulo);
        let crash: {horizontal: boolean, vertical: boolean} = {horizontal: false, vertical: false};

        this.intercept = {x: 0, y: 0};
        this.steps = { x: 0, y: 0};
        this.directions = {down: false, left: false};

        if (this.angulo < Math.PI) {
            this.directions.down = true;
        }

        if (this.angulo > Math.PI / 2 && this.angulo < 3 * Math.PI / 2) {
            this.directions.left = true;
        }

        ({ collision: crash.horizontal, wallHit: this.wallHitHorizontal } = this.collision("H", angleTangent, tamTile));
        ({ collision: crash.vertical, wallHit: this.wallHitVertical } = this.collision("V", angleTangent, tamTile));

        // Distancias
        let distance: {horizontal: number, vertical: number} = {horizontal: 9999, vertical: 9999};

        if (crash.horizontal) {
            distance.horizontal = distanciaEntrePuntos(this.position.x, this.position.y, this.wallHitHorizontal.x, this.wallHitHorizontal.y);
        }

        if (crash.vertical) {
            distance.vertical = distanciaEntrePuntos(this.position.x, this.position.y, this.wallHitVertical.x, this.wallHitVertical.y);
        }

        if (distance.horizontal < distance.vertical) {
            this.wallHit = { ...this.wallHitHorizontal}
            this.distancia = distance.horizontal;

            let casilla = Math.trunc(this.wallHit.x / tamTile);
            this.pixelTextura = this.wallHit.x - (casilla * tamTile);

            this.idTextura = this.escenario.tile(this.wallHit.x, this.wallHit.y);

        } else {
            this.wallHit = { ...this.wallHitVertical }
            this.distancia = distance.vertical;

            let casilla = Math.trunc(this.wallHit.y / tamTile) * tamTile;
            this.pixelTextura = this.wallHit.y - casilla;

            this.idTextura = this.escenario.tile(this.wallHit.x, this.wallHit.y);
        }

        // Corrección ojo de pez
        this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));

        // Guardamos en zBuffer
        zBuffer[this.columna] = this.distancia;
    }

    // color(): string {
    //     let paso = 526344;
    //     let bloque = Math.trunc(canvasAlto / 36);
    //     let matiz = Math.trunc(this.distancia / bloque);
    //     let gris = matiz * paso;
    //     let colorHex = "#" + gris.toString(16);
    //     return colorHex;
    // }

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

    collision(direction: "H" | "V", angleTangent: number, tamTile: number): { collision: boolean, wallHit: Coordinate } {
        let crash = false;
        let wallHit: Coordinate = { x: 0, y: 0 };
        let nextBox: Coordinate = { x: 0, y: 0 };
        let stepX = 0;
        let stepY = 0;

        if (direction === "H") {
            nextBox.y = Math.floor(this.position.y / tamTile) * tamTile;
            if (this.directions.down) nextBox.y += tamTile;

            nextBox.x = this.position.x + (nextBox.y - this.position.y) / angleTangent;

            stepY = this.directions.down ? tamTile : -tamTile;
            stepX = stepY / angleTangent;

            if (!this.directions.down) nextBox.y--;
        } else {
            nextBox.x = Math.floor(this.position.x / tamTile) * tamTile;
            if (!this.directions.left) nextBox.x += tamTile;

            nextBox.y = this.position.y + (nextBox.x - this.position.x) * angleTangent;

            stepX = this.directions.left ? -tamTile : tamTile;
            stepY = stepX * angleTangent;

            if (this.directions.left) nextBox.x--;
        }

        while (!crash && nextBox.x >= 0 && nextBox.y >= 0 && nextBox.x < canvasAncho && nextBox.y < canvasAlto) {
            const boxX = Math.trunc(nextBox.x / tamTile);
            const boxY = Math.trunc(nextBox.y / tamTile);

            if (this.escenario.colision(boxX, boxY)) {
                crash = true;
                wallHit = { ...nextBox };
            } else {
                nextBox.x += stepX;
                nextBox.y += stepY;
            }
        }

        return { collision: crash, wallHit };
    }

}