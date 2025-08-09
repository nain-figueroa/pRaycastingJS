import { tamTile } from "./globals.js";

export class Level {

  constructor(can, con, arr) {
    this.canvas = can;
    this.ctx = con;
    this.matriz = arr;

    //DIMENSIONES MATRIZ
    this.altoM = this.matriz.length;
    this.anchoM = this.matriz[0].length;

    //DIMENSIONES REALES CANVAS
    this.altoC = this.canvas.height;
    this.anchoC = this.canvas.width;

    //TAMAÑO DE LOS TILES
    //this.altoT = parseInt(this.altoC / this.altoM);
    //this.anchoT = parseInt(this.anchoC / this.anchoM);
    this.altoT = tamTile;
    this.anchoT = tamTile;

  }
  //LE PASAMOS UNA CASILLA Y NOS DICE SI HAY COLISIÓN
  colision(x, y) {
    var choca = false;
    if (this.matriz[y][x] != 0)
      choca = true;
    return choca;
  }

  tile(x, y) {
    var casillaX = parseInt(x / this.anchoT);
    var casillaY = parseInt(y / this.altoT);
    return (this.matriz[casillaY][casillaX]);
  }
}