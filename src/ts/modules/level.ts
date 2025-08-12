import { tamTile } from "../globalsVar.js";

export class Level {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public matriz: number[][];

    public altoM: number;
    public anchoM: number;

    public altoC: number;
    public anchoC: number;

    public altoT: number;
    public anchoT: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, matriz: number[][]) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.matriz = matriz;

        //DIMENSIONES MATRIZ
        this.altoM = this.matriz.length;
        this.anchoM = this.matriz[0]!.length;

        //DIMENSIONES REALES CANVAS
        this.altoC = this.canvas.height;
        this.anchoC = this.canvas.width;

        //TAMAÑO DE LOS TILES
        this.altoT = tamTile;
        this.anchoT = tamTile;
    }

    //LE PASAMOS UNA CASILLA Y NOS DICE SI HAY COLISIÓN
    colision(x: number, y: number): boolean {
        let choca = false;
        if (this.matriz[y]![x] != 0)
            choca = true;
        return choca;
    }

    tile(x: number, y: number): number {
        let casillaX = Math.trunc(x / this.anchoT);
        let casillaY = Math.trunc(y / this.altoT);
        return this.matriz[casillaY]![casillaX]!;
    }
}