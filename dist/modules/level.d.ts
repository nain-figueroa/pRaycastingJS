export declare class Level {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    matriz: number[][];
    altoM: number;
    anchoM: number;
    altoC: number;
    anchoC: number;
    altoT: number;
    anchoT: number;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, matriz: number[][]);
    colision(x: number, y: number): boolean;
    tile(x: number, y: number): number;
}
//# sourceMappingURL=level.d.ts.map