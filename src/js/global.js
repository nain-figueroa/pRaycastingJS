//Dimensiones canvas
export var canvasAncho = 500;
export var canvasAlto = 500;

//Nivel
export var nivel1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export var FOV = 60;

export var medioFOV = FOV / 2;

export function convertirRadianes(angulo) {
    return angulo * (Math.PI / 180);
}

export function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);

    if (angulo < 0) {
        angulo = angulo + (2 * Math.PI);
    }

    return angulo;
}

export function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1, 2), 2) + Math.pow((y2 - y1), 2));
}