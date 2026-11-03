/*
  RESPUESTAS CORRECTAS, TOLERANCIAS, PISTAS Y PROCEDIMIENTOS
  Separadas del contenido visual (actividades.js) y de los datos (datos.js).

  Cada campo numérico tiene:
    valor      -> resultado correcto (verificado a mano con los datos del PDF)
    tol        -> tolerancia absoluta admitida (por redondeo)
    pista      -> texto que aparece al pedir "Ver pista"
*/

const RESPUESTAS = {

  // ---------------------------------------------------------------
  // CAMPOS NUMÉRICOS
  // ---------------------------------------------------------------
  campos: {
    // Actividad 1 · 1.1 Media aritmética
    'a1-suma':  { valor: 5774,   tol: 0,
                  pista: 'Sumá los 8 valores uno por uno. El punto separa miles: 1.053 es mil cincuenta y tres y 1.218 es mil doscientos dieciocho.' },
    'a1-media': { valor: 721.75, tol: 0.05,
                  pista: 'La media es la suma dividida por la cantidad de estaciones (8). Si la suma te dio 5.774, dividila por 8.' },

    // Actividad 1 · 1.2 Mediana: orden de menor a mayor
    'a1-ord-1': { valor: 91,   tol: 0, pista: 'El valor más chico de la tabla es 91 mm (San Juan).' },
    'a1-ord-2': { valor: 238,  tol: 0, pista: 'El segundo valor más chico es Mendoza (238 mm).' },
    'a1-ord-3': { valor: 667,  tol: 0, pista: 'Seguí de menor a mayor: el siguiente es San Luis (667 mm).' },
    'a1-ord-4': { valor: 725,  tol: 0, pista: 'Ordená: el cuarto valor más chico es Villa Reynolds (725 mm).' },
    'a1-ord-5': { valor: 839,  tol: 0, pista: 'El quinto valor es Río Cuarto (839 mm).' },
    'a1-ord-6': { valor: 943,  tol: 0, pista: 'El sexto valor es Marcos Juárez (943 mm).' },
    'a1-ord-7': { valor: 1053, tol: 0, pista: 'El séptimo valor es Rosario (1.053 mm).' },
    'a1-ord-8': { valor: 1218, tol: 0, pista: 'El más grande es Gualeguaychú (1.218 mm).' },
    'a1-mediana': { valor: 782, tol: 0.01,
                  pista: 'Sumá el 4.º y el 5.º valor de la tabla ordenada (725 y 839) y dividí por 2.' }
  },

  // ---------------------------------------------------------------
  // BLOQUES: qué campos verifica cada botón "Comprobar" y qué muestra
  // ---------------------------------------------------------------
  bloques: {
    'a1-1.1': {
      campos: ['a1-suma', 'a1-media'],
      pista: 'Empezá por la suma de las 8 estaciones y después dividí por 8.',
      confirmacion: 'Correcto. La media de la franja es 721,75 mm: es el promedio de las 8 estaciones.',
      procedimiento: 'Suma: 238 + 91 + 667 + 725 + 839 + 943 + 1.053 + 1.218 = <strong>5.774</strong>.<br>Media: 5.774 ÷ 8 = <strong>721,75 mm</strong>.'
    },
    'a1-1.2': {
      campos: ['a1-ord-1', 'a1-ord-2', 'a1-ord-3', 'a1-ord-4', 'a1-ord-5', 'a1-ord-6', 'a1-ord-7', 'a1-ord-8', 'a1-mediana'],
      pista: 'Ordená los 8 valores de menor a mayor. Después la mediana es el promedio del 4.º y el 5.º.',
      confirmacion: 'Correcto. Ordenados: 91, 238, 667, 725, 839, 943, 1.053, 1.218. La mediana es 782 mm.',
      procedimiento: 'Ordenados de menor a mayor: 91 · 238 · 667 · <strong>725</strong> · <strong>839</strong> · 943 · 1.053 · 1.218.<br>Como n = 8, los valores del medio son el 4.º y el 5.º: (725 + 839) ÷ 2 = <strong>782 mm</strong>.'
    }
  },

  // ---------------------------------------------------------------
  // CRITERIOS ORIENTATIVOS PARA PREGUNTAS ABIERTAS
  // (no son la única respuesta válida: sirven para revisar)
  // ---------------------------------------------------------------
  criterios: {
    'a1-p1': 'La media (721,75) es menor que la mediana (782). Las estaciones más secas, San Juan (91) y Mendoza (238), están muy lejos del resto y arrastran el promedio hacia abajo. Gualeguaychú (1.218) y Rosario (1.053) la tiran hacia arriba, pero su efecto es menor. Un buen argumento incluye la idea de que el promedio es sensible a los valores extremos.',
    'a1-p2': 'No hay una única respuesta. La mediana (782) describe mejor la lluvia típica porque no cambia aunque una estación extrema se vuelva más seca o más húmeda. La media usa todos los datos, pero se mueve con los extremos. Se valora que el estudiante justifique con algún argumento.',
    'a1-p3': 'No cambiarían. Media y mediana dependen de los valores de lluvia, no de dónde están las estaciones en el mapa. Lo que sí depende de la ubicación es el patrón espacial, que se ve en la Actividad 4.'
  }
};
