//La usaremos para evitar que el ángulo crezca sin control
//una vez pasado de 2Pi, que vuelva a empezar
//usamos la función módulo

export function normalizaAngulo(angulo) {
  angulo = angulo % (2 * Math.PI);

  if (angulo < 0) {
    angulo = (2 * Math.PI) + angulo;	//si es negativo damos toda la vuelta en el otro sentido
  }

  return angulo;
}

export function convierteRadianes(angulo) {
  angulo = angulo * (Math.PI / 180);
  return angulo;
}

export function distanciaEntrePuntos(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

//MODIFICAMOS EL ESTILO CSS (por eso usamos canvas.style.width y no canvas.width)
export function reescalaCanvas() {
  canvas.style.width = "800px";
  canvas.style.height = "800px";
}

export function renderSprites(sprites) {
  //NOTA: HACER EL ALGORITMO DE ORDENACIÓN MANUAL

  //ALGORITMO DE ORDENACIÓN SEGÚN DISTANCIA (ORDEN DESCENDENTE)
  //https://davidwalsh.name/array-sort

  sprites.sort(function (obj1, obj2) {
    // Ascending: obj1.distancia - obj2.distancia
    // Descending: obj2.distancia - obj1.distancia
    return obj2.distancia - obj1.distancia;
  });

  //DIBUJAMOS LOS SPRITES UNO POR UNO
  for (let a = 0; a < sprites.length; a++) {
    sprites[a].dibuja();
  }

}