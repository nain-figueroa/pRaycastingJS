import { convierteRadianes, normalizaAngulo } from "./functions.js";
import { FOV, type Coordinate } from "../globalsVar.js";
import { Level } from "./level.js";
import { Ray } from "./ray.js";

export class Player {
    public ctx: CanvasRenderingContext2D;
    public escenario: Level;

    public position: Coordinate;

    public avanza: any = 0;
    public gira: any = 0;
    public anguloRotacion: number = 0;

    public velGiro: number = convierteRadianes(3);
    public velMovimiento: number = 150;

    public numRayos: number;
    public rayos: Ray[] = [];

    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.position = { x: x, y: y }

        this.numRayos = 500;
        let medioFOV = FOV / 2;
        let incrementoAngulo = convierteRadianes(FOV / this.numRayos);
        let anguloInicial = convierteRadianes(this.anguloRotacion - medioFOV);

        let anguloRayo = anguloInicial;

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i] = new Ray(this.ctx, this.escenario, this.position.x, this.position.y, this.anguloRotacion, anguloRayo, i);
            anguloRayo += incrementoAngulo;
        }

        const inputsMov = new Map<string, number>([
            ["ArrowUp", 1], ["ArrowDown", -1]
        ]);
        const inputsSpin = new Map<string, number>([
            ["ArrowLeft", -1], ["ArrowRight", 1]
        ]);

        document.addEventListener('keydown', (tecla) => {
            if (inputsMov.has(tecla.key)) {
                this.avanza = inputsMov.get(tecla.key);
            }

            if (inputsSpin.has(tecla.key)) {
                this.gira = inputsSpin.get(tecla.key);
            }
        });
        document.addEventListener('keyup', (tecla) => {
            if (inputsMov.has(tecla.key)) {
                this.avanza = 0;
            }

            if (inputsSpin.has(tecla.key)) {
                this.gira = 0;
            }
        });
    }

    colision(x: number, y: number): boolean {
        let choca = false;
        let casillaX = Math.trunc(x / this.escenario.anchoT);
        let casillaY = Math.trunc(y / this.escenario.altoT);

        if (this.escenario.colision(casillaX, casillaY))
            choca = true;

        return choca;
    }

    actualiza(deltaTime: number): void {
        let nuevaX = this.position.x + this.avanza * Math.cos(this.anguloRotacion) * (this.velMovimiento * deltaTime);
        let nuevaY = this.position.y + this.avanza * Math.sin(this.anguloRotacion) * (this.velMovimiento * deltaTime);

        if (!this.colision(nuevaX, nuevaY)) {
            this.position.x = nuevaX;
            this.position.y = nuevaY;
        }

        this.anguloRotacion += this.gira * this.velGiro;
        this.anguloRotacion = normalizaAngulo(this.anguloRotacion);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i]!.position.x = this.position.x;
            this.rayos[i]!.position.y = this.position.y;
            this.rayos[i]!.setAngulo(this.anguloRotacion);
        }
    }

    dibuja(deltaTime: number): void {
        this.actualiza(deltaTime);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i]!.dibuja();
        }
    }
}