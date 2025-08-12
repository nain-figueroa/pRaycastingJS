import { Level } from "./level.js";
import { Ray } from "./ray.js";
export declare class Player {
    ctx: CanvasRenderingContext2D;
    escenario: Level;
    x: number;
    y: number;
    avanza: number;
    gira: number;
    anguloRotacion: number;
    velGiro: number;
    velMovimiento: number;
    numRayos: number;
    rayos: Ray[];
    constructor(ctx: CanvasRenderingContext2D, escenario: Level, x: number, y: number);
    arriba(): void;
    abajo(): void;
    derecha(): void;
    izquierda(): void;
    avanzaSuelta(): void;
    giraSuelta(): void;
    colision(x: number, y: number): boolean;
    actualiza(): void;
    dibuja(): void;
}
//# sourceMappingURL=player.d.ts.map