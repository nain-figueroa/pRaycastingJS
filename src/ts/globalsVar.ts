export let tamTile: number = 50;
export const FOV: number = 60;

//DIMENSIONES EN PIXELS DEL CANVAS
export let canvasAncho: number = 500;
export let canvasAlto: number = 500;

export let zBuffer: number[] = [];	//array con la distancia a cada pared (con cada rayo)

export let modo: number = 0;	//Raycasting = 0     Mapa = 1

export let tiles: HTMLImageElement = new Image();

export let sprites: any[] = [];	//array con los sprites

export type Coordinate = {x: number, y: number}