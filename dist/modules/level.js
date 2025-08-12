import { tamTile } from "../globalsVar.js";
export class Level {
    canvas;
    ctx;
    matriz;
    altoM;
    anchoM;
    altoC;
    anchoC;
    altoT;
    anchoT;
    constructor(canvas, ctx, matriz) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.matriz = matriz;
        //DIMENSIONES MATRIZ
        this.altoM = this.matriz.length;
        this.anchoM = this.matriz[0].length;
        //DIMENSIONES REALES CANVAS
        this.altoC = this.canvas.height;
        this.anchoC = this.canvas.width;
        //TAMAÑO DE LOS TILES
        this.altoT = tamTile;
        this.anchoT = tamTile;
    }
    //LE PASAMOS UNA CASILLA Y NOS DICE SI HAY COLISIÓN
    colision(x, y) {
        let choca = false;
        if (this.matriz[y][x] != 0)
            choca = true;
        return choca;
    }
    tile(x, y) {
        let casillaX = Math.trunc(x / this.anchoT);
        let casillaY = Math.trunc(y / this.altoT);
        return this.matriz[casillaY][casillaX];
    }
}
//# sourceMappingURL=level.js.map