import { Sprite } from "./sprite.js";
// Normaliza el ángulo para que esté en el rango [0, 2PI)
export function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) {
        angulo = (2 * Math.PI) + angulo;
    }
    return angulo;
}
// Convierte grados a radianes
export function convierteRadianes(angulo) {
    return angulo * (Math.PI / 180);
}
// Calcula la distancia entre dos puntos
export function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
// Renderiza los sprites ordenados por distancia descendente
export function renderSprites(sprites) {
    sprites.sort((obj1, obj2) => obj2.distance - obj1.distance);
    for (let a = 0; a < sprites.length; a++) {
        sprites[a].draw();
    }
}
//# sourceMappingURL=functions.js.map