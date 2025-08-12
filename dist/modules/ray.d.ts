import { Level } from "./level.js";
export declare class Ray {
    ctx: CanvasRenderingContext2D;
    escenario: Level;
    x: number;
    y: number;
    incrementoAngulo: number;
    anguloJugador: number;
    angulo: number;
    columna: number;
    wallHitX: number;
    wallHitY: number;
    wallHitXHorizontal: number;
    wallHitYHorizontal: number;
    wallHitXVertical: number;
    wallHitYVertical: number;
    distancia: number;
    pixelTextura: number;
    idTextura: number;
    distanciaPlanoProyeccion: number;
    xIntercept: number;
    yIntercept: number;
    xStep: number;
    yStep: number;
    abajo: boolean;
    izquierda: boolean;
    hCamara: number;
    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number, anguloJugador: number, incrementoAngulo: number, columna: number);
    setAngulo(angulo: number): void;
    cast(): void;
    color(): string;
    renderPared(): void;
    dibuja(): void;
}
//# sourceMappingURL=ray.d.ts.map