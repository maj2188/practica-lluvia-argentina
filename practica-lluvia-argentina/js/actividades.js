/*
  CONTENIDO DE LAS ACTIVIDADES (consignas, fórmulas y estructura de campos)
  Texto transcripto del PDF "Actividad práctica: la lluvia en la Argentina (Unidades 1, 2 y 3)".
  Las respuestas correctas están en respuestas.js y los datos en datos.js.

  Estado de desarrollo:
    desarrollada: true   -> tiene contenido interactivo completo (render en contenido())
    desarrollada: false  -> solo se muestra la estructura; se completa tras aprobar el prototipo.
*/

const UNIDADES = [
  { id: 'u1', titulo: 'Unidad 1', subtitulo: 'Estadística descriptiva espacial' },
  { id: 'u2', titulo: 'Unidad 2', subtitulo: 'Autocorrelación espacial' },
  { id: 'u3', titulo: 'Unidad 3', subtitulo: 'Semivariograma' },
  { id: 'int', titulo: 'Integración', subtitulo: 'Unidades 1, 2 y 3' }
];

const ACTIVIDADES = [

  // =============================================================
  // ACTIVIDAD 1 — PROTOTIPO COMPLETO
  // =============================================================
  {
    id: 'a1', numero: 1, unidad: 'u1',
    tema: 'medidas de tendencia central',
    titulo: 'Medidas de tendencia central',
    pregunta: '¿cuánto llueve en una estación "típica" de esta franja?',
    desarrollada: true,
    subitems: [ ['1.1', 'Media aritmética'], ['1.2', 'Mediana'] ],
    contenido: () => `
      <p>Son dos cálculos <strong>independientes</strong>: la mediana no necesita la media, ni la media la mediana.</p>

      <section class="bloque" id="bl-a1-1.1" aria-labelledby="t-a1-1.1">
        <h3 id="t-a1-1.1">1.1 Media aritmética</h3>
        <p class="etiqueta">Fórmula: media aritmética</p>
        ${fx('\\bar{z} = \\frac{\\sum_{i=1}^{n} z_i}{n}', true)}
        <p class="etiqueta">Con los números reales:</p>
        ${fx('\\bar{z} = \\frac{238 + 91 + 667 + 725 + 839 + 943 + 1053 + 1218}{8} = \\frac{?}{8} = ?', true)}
        <ul class="simbolos">
          <li><strong>z̄</strong> (se lee <em>zeta barra</em>) = la media aritmética, o promedio.</li>
          <li><strong>zᵢ</strong> = la lluvia de cada estación. <strong>n</strong> = la cantidad de estaciones (8).</li>
          <li><strong>Σ</strong> = sumar todos los valores.</li>
        </ul>
        <h4>Cálculo</h4>
        <ol class="pasos">
          <li>Sumá la lluvia de las 8 estaciones: 238 + 91 + 667 + 725 + 839 + 943 + 1.053 + 1.218 = ${campo('a1-suma', { etiqueta: 'Suma de las 8 estaciones', unidad: 'mm' })}</li>
          <li>Dividí la suma por 8.</li>
        </ol>
        <p class="resultado">Resultado: media aritmética = ${campo('a1-media', { etiqueta: 'Media aritmética', unidad: 'mm' })}</p>
        ${controles('a1-1.1')}
      </section>

      <section class="bloque" id="bl-a1-1.2" aria-labelledby="t-a1-1.2">
        <h3 id="t-a1-1.2">1.2 Mediana</h3>
        <p class="etiqueta">Fórmula: mediana (con n par)</p>
        ${fx('\\text{Mediana} = \\frac{z_{(n/2)} + z_{(n/2+1)}}{2}', true)}
        <p class="etiqueta">Con los números reales (datos ordenados: 91, 238, 667, <strong>725</strong>, <strong>839</strong>, 943, 1053, 1218):</p>
        ${fx('\\text{Mediana} = \\frac{z_{(4)} + z_{(5)}}{2} = \\frac{725 + 839}{2} = ?', true)}
        <ul class="simbolos">
          <li><strong>z₍ₖ₎</strong> = el valor que ocupa el lugar k cuando los datos están <strong>ordenados de menor a mayor</strong>.</li>
          <li>Con n = 8, los dos valores del medio son el 4.º y el 5.º. Si n fuera impar, la mediana sería directamente el valor del medio.</li>
        </ul>
        <h4>Cálculo</h4>
        <ol class="pasos">
          <li>Ordená los 8 valores de menor a mayor. Escribí cada valor en su lugar:</li>
        </ol>
        <div class="tabla-wrap">
          <table class="tabla-editable">
            <caption class="sr-only">Valores de lluvia ordenados de menor a mayor</caption>
            <thead><tr><th scope="col">Lugar</th>${[1,2,3,4,5,6,7,8].map(k => `<th scope="col">${k}.º</th>`).join('')}</tr></thead>
            <tbody><tr><th scope="row">Lluvia (mm)</th>${[1,2,3,4,5,6,7,8].map(k => `<td>${campo('a1-ord-' + k, { etiqueta: 'Lugar ' + k + ' ordenado', unidad: '', ancho: 'sm' })}</td>`).join('')}</tr></tbody>
          </table>
        </div>
        <ol class="pasos" start="2">
          <li>Sumá el 4.º y el 5.º valor y dividí por 2.</li>
        </ol>
        <p class="resultado">Resultado: mediana = ${campo('a1-mediana', { etiqueta: 'Mediana', unidad: 'mm' })}</p>
        ${controles('a1-1.2')}
      </section>

      <section class="bloque bloque-preguntas" id="bl-a1-preg" aria-labelledby="t-a1-preg">
        <h3 id="t-a1-preg">Preguntas</h3>
        <ol class="preguntas">
          <li>
            <label for="ta-a1-p1">¿La media es mayor o menor que la mediana? ¿Qué estaciones "tiran" la media hacia ese lado?</label>
            ${textoAbierto('a1-p1')}
          </li>
          <li>
            <label for="ta-a1-p2">¿Cuál de las dos representa mejor la lluvia típica de la franja? ¿Por qué?</label>
            ${textoAbierto('a1-p2')}
          </li>
          <li>
            <label for="ta-a1-p3">Si cambiáramos de lugar las estaciones en el mapa, ¿la media y la mediana cambiarían?</label>
            ${textoAbierto('a1-p3')}
          </li>
        </ol>
        ${controlesPreguntas('a1-preg', ['a1-p1', 'a1-p2', 'a1-p3'])}
      </section>
    `
  },

  // =============================================================
  // ACTIVIDADES 2 A 11 — ESTRUCTURA (contenido pendiente de aprobación)
  // =============================================================
  {
    id: 'a2', numero: 2, unidad: 'u1', tema: 'medidas de dispersión', titulo: 'Medidas de dispersión',
    pregunta: '¿qué tan distintas son las estaciones entre sí?', desarrollada: false,
    subitems: [ ['2.1', 'Varianza muestral'], ['2.2', 'Desvío estándar'], ['2.3', 'Coeficiente de variación (CV)'] ]
  },
  {
    id: 'a3', numero: 3, unidad: 'u1', tema: 'cuartiles y diagrama de caja', titulo: 'Cuartiles y diagrama de caja',
    pregunta: '¿hay alguna estación con una lluvia "rara"?', desarrollada: false,
    subitems: [ ['3.1', 'Primer y tercer cuartil'], ['3.2', 'Rango intercuartílico (RIC)'], ['3.3', 'Límites para detectar valores atípicos'] ]
  },
  {
    id: 'a4', numero: 4, unidad: 'u1', tema: 'variación espacial y estacionariedad', titulo: 'Variación espacial y estacionariedad',
    pregunta: '¿la lluvia cambia con la ubicación?', desarrollada: false,
    subitems: [ ['4.1', 'Gráfico de lluvia según la distancia'], ['4.2', 'Media aritmética por zona'], ['4.3', 'Estacionariedad'] ]
  },
  {
    id: 'a5', numero: 5, unidad: 'u2', tema: 'vecinos, matriz de pesos y rezago espacial', titulo: 'Vecinos, matriz de pesos y rezago espacial',
    pregunta: '¿cuánto llueve alrededor de cada estación?', desarrollada: false,
    subitems: [ ['5.1', 'Matriz de pesos espaciales (W)'], ['5.2', 'Suma total de pesos (S₀)'], ['5.3', 'Rezago espacial'] ]
  },
  {
    id: 'a6', numero: 6, unidad: 'u2', tema: 'I de Moran', titulo: 'I de Moran',
    pregunta: '¿las estaciones vecinas tienden a estar del mismo lado de la media?', desarrollada: false,
    subitems: [ ['6.1', 'Productos de los desvíos de las vecinas'], ['6.2', 'Índice I de Moran'], ['6.3', 'Valor esperado de I sin autocorrelación'] ]
  },
  {
    id: 'a7', numero: 7, unidad: 'u2', tema: 'C de Geary', titulo: 'C de Geary',
    pregunta: '¿cuánto difieren las estaciones vecinas entre sí?', desarrollada: false,
    subitems: [ ['7.1', 'Diferencias al cuadrado entre vecinas'], ['7.2', 'Coeficiente C de Geary'] ]
  },
  {
    id: 'a8', numero: 8, unidad: 'u2', tema: 'LISA', titulo: 'LISA',
    pregunta: '¿dónde están los grupos de estaciones parecidas?', desarrollada: false,
    subitems: [ ['8.1', 'Desvío estándar poblacional'], ['8.2', 'Valor estandarizado de cada estación'], ['8.3', 'Promedio estandarizado de las vecinas'], ['8.4', 'Índice local de Moran (LISA)'] ]
  },
  {
    id: 'a9', numero: 9, unidad: 'u3', tema: 'semivariograma experimental', titulo: 'Semivariograma experimental',
    pregunta: '¿cómo crece la diferencia entre dos estaciones a medida que se alejan?', desarrollada: false,
    subitems: [ ['9.1', 'Semivarianza de la clase 1'], ['9.2', 'Semivarianza de la clase 4'], ['9.3', 'Gráfico del semivariograma'] ]
  },
  {
    id: 'a10', numero: 10, unidad: 'u3', tema: 'pepita, meseta, rango y modelo esférico', titulo: 'Pepita, meseta, rango y modelo esférico',
    pregunta: '¿hasta qué distancia se parecen las estaciones?', desarrollada: false,
    subitems: [ ['10.1', 'Meseta'], ['10.2', 'Razón pepita/meseta'], ['10.3', 'Valor del modelo esférico'] ]
  },
  {
    id: 'a11', numero: 11, unidad: 'int', tema: 'integración de las Unidades 1, 2 y 3', titulo: 'Integración de las Unidades 1, 2 y 3',
    pregunta: '¿qué aprendimos sobre la lluvia entre la cordillera y el Litoral?', desarrollada: false,
    subitems: []
  }
];
