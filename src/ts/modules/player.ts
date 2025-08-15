import { convierteRadianes, normalizaAngulo } from "./functions.js";
import { FOV } from "../globalsVar.js";
import { Level } from "./level.js";
import { Ray } from "./ray.js";

export class Player {
    public ctx: CanvasRenderingContext2D;
    public escenario: Level;

    public x: number;
    public y: number;

    public avanza: number = 0;
    public gira: number = 0;
    public anguloRotacion: number = 0;

    public velGiro: number = convierteRadianes(3);
    public velMovimiento: number = 3;

    public numRayos: number;
    public rayos: Ray[] = [];

    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.x = x;
        this.y = y;

        this.numRayos = 500;
        let medioFOV = FOV / 2;
        let incrementoAngulo = convierteRadianes(FOV / this.numRayos);
        let anguloInicial = convierteRadianes(this.anguloRotacion - medioFOV);

        let anguloRayo = anguloInicial;

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i] = new Ray(this.ctx, this.escenario, this.x, this.y, this.anguloRotacion, anguloRayo, i);
            anguloRayo += incrementoAngulo;
        }
    }

    arriba(): void {
        this.avanza = 1;
    }

    abajo(): void {
        this.avanza = -1;
    }

    derecha(): void {
        this.gira = 1;
    }

    izquierda(): void {
        this.gira = -1;
    }

    avanzaSuelta(): void {
        this.avanza = 0;
    }

    giraSuelta(): void {
        this.gira = 0;
    }

    colision(x: number, y: number): boolean {
        let choca = false;
        let casillaX = Math.trunc(x / this.escenario.anchoT);
        let casillaY = Math.trunc(y / this.escenario.altoT);

        if (this.escenario.colision(casillaX, casillaY))
            choca = true;

        return choca;
    }

    actualiza(): void {
        let nuevaX = this.x + this.avanza * Math.cos(this.anguloRotacion) * this.velMovimiento;
        let nuevaY = this.y + this.avanza * Math.sin(this.anguloRotacion) * this.velMovimiento;

        if (!this.colision(nuevaX, nuevaY)) {
            this.x = nuevaX;
            this.y = nuevaY;
        }

        this.anguloRotacion += this.gira * this.velGiro;
        this.anguloRotacion = normalizaAngulo(this.anguloRotacion);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i]!.position.x = this.x;
            this.rayos[i]!.position.y = this.y;
            this.rayos[i]!.setAngulo(this.anguloRotacion);
        }
    }

    dibuja(): void {
        this.actualiza();

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i]!.dibuja();
        }
    }
}