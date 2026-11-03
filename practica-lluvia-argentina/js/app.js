/*
  INTERFAZ Y LÓGICA
  Este archivo no contiene contenido académico: lee DATOS, RESPUESTAS y ACTIVIDADES.
*/

const CLAVE_PROGRESO = 'practica-lluvia-argentina-v1';
const CLAVE_TEMA = 'practica-lluvia-argentina-tema';

// ---------------------------------------------------------------
// ESTADO (se guarda en el navegador del estudiante)
// ---------------------------------------------------------------
let estado = cargarEstado();

function cargarEstado() {
  const vacio = { campos: {}, marcas: {}, textos: {} };
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PROGRESO));
    return guardado && typeof guardado === 'object' ? Object.assign(vacio, guardado) : vacio;
  } catch (e) {
    return vacio; // el almacenamiento puede estar bloqueado: la práctica sigue funcionando
  }
}

function guardarEstado() {
  try { localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ }
}

// ---------------------------------------------------------------
// HELPERS DE CONTENIDO (usados por actividades.js)
// ---------------------------------------------------------------
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return escHtml(s).replace(/"/g, '&quot;');
}

// Fórmula LaTeX: se dibuja con KaTeX después de insertar el HTML
function fx(tex, display) {
  return `<span class="kx${display ? ' kx-disp' : ''}" data-tex="${escAttr(tex)}"></span>`;
}

// Campo numérico editable con marca de verificación
function campo(id, o = {}) {
  const tam = o.ancho === 'sm' ? 'campo-sm' : 'campo-md';
  const unidad = o.unidad ? `<span class="unidad">${escHtml(o.unidad)}</span>` : '';
  return `<span class="campo-wrap">` +
    `<input type="text" class="campo ${tam}" id="c-${id}" data-campo="${id}" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="${escAttr(o.etiqueta || id)}" placeholder="?">` +
    unidad +
    `<span class="marca-campo" id="m-${id}" aria-hidden="true"></span>` +
    `</span>`;
}

// Respuesta abierta (no se verifica automáticamente)
function textoAbierto(id) {
  return `<textarea class="texto-abierto" id="ta-${id}" data-texto="${id}" rows="3" placeholder="Escribí tu respuesta con tus palabras…"></textarea>`;
}

// Botonera de un ejercicio con cálculos
function controles(bloque) {
  return `
    <div class="controles" role="group" aria-label="Acciones del ejercicio">
      <button type="button" class="btn btn-primario" data-accion="comprobar" data-bloque="${bloque}">Comprobar</button>
      <button type="button" class="btn" data-accion="pista" data-bloque="${bloque}">Ver pista</button>
      <button type="button" class="btn" data-accion="procedimiento" data-bloque="${bloque}">Ver procedimiento</button>
      <button type="button" class="btn btn-sec" data-accion="reintentar" data-bloque="${bloque}">Reintentar</button>
    </div>
    <div class="retro" id="r-${bloque}" aria-live="polite"></div>`;
}

// Botonera de preguntas abiertas
function controlesPreguntas(bloque, ids) {
  return `
    <div class="controles" role="group" aria-label="Acciones de las preguntas">
      <button type="button" class="btn" data-accion="criterios" data-bloque="${bloque}" data-ids="${ids.join(',')}">Ver criterios orientativos</button>
      <button type="button" class="btn btn-sec" data-accion="reintentar-texto" data-bloque="${bloque}" data-ids="${ids.join(',')}">Borrar respuestas</button>
    </div>
    <div class="retro" id="r-${bloque}" aria-live="polite"></div>`;
}

// ---------------------------------------------------------------
// NÚMEROS: el estudiante puede escribir 721,75 o 721.75 o 5.774
// ---------------------------------------------------------------
function parseNumero(texto) {
  let s = String(texto || '').trim().replace(/\s/g, '').replace(/−/g, '-');
  if (s === '') return null;
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');       // formato argentino: 721,75 o 5.774,5
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');                          // miles: 5.774 o 1.053
  }
  const n = Number(s);
  return Number.isNaN(n) ? NaN : n;
}

function evaluarCampo(id) {
  const el = document.getElementById('c-' + id);
  const v = parseNumero(el ? el.value : '');
  const r = RESPUESTAS.campos[id];
  if (v === null) return 'vacio';
  if (Number.isNaN(v)) return 'nolee';
  return Math.abs(v - r.valor) <= (r.tol || 0) + 1e-9 ? 'ok' : 'error';
}

// ---------------------------------------------------------------
// RENDER DE CAMPOS Y MARCAS
// ---------------------------------------------------------------
const TEXTO_MARCA = { ok: '✔', error: '✖', vacio: '·', nolee: '?' };

function pintarMarca(id, estadoMarca) {
  const input = document.getElementById('c-' + id);
  const marca = document.getElementById('m-' + id);
  if (!input || !marca) return;
  input.classList.remove('ok', 'error', 'vacio', 'nolee');
  marca.textContent = '';
  if (estadoMarca) {
    input.classList.add(estadoMarca);
    marca.textContent = TEXTO_MARCA[estadoMarca] || '';
    marca.title = { ok: 'Correcto', error: 'Revisá este valor', vacio: 'Completá este campo', nolee: 'Escribí solo números' }[estadoMarca];
  }
}

function restaurarCampos(raiz) {
  raiz.querySelectorAll('input.campo').forEach(input => {
    const id = input.dataset.campo;
    input.value = estado.campos[id] || '';
    pintarMarca(id, estado.marcas[id] || null);
  });
  raiz.querySelectorAll('textarea.texto-abierto').forEach(ta => {
    ta.value = estado.textos[ta.dataset.texto] || '';
  });
}

function renderFormulas(raiz) {
  if (typeof katex === 'undefined') return;
  raiz.querySelectorAll('.kx').forEach(el => {
    katex.render(el.dataset.tex, el, {
      displayMode: el.classList.contains('kx-disp'),
      throwOnError: false
    });
  });
}

// ---------------------------------------------------------------
// ACCIONES DE LOS BOTONES
// ---------------------------------------------------------------
function retro(bloque) {
  return document.getElementById('r-' + bloque);
}

function comprobarBloque(bloque) {
  const cfg = RESPUESTAS.bloques[bloque];
  let correctos = 0;
  cfg.campos.forEach(id => {
    const res = evaluarCampo(id);
    estado.marcas[id] = res;
    pintarMarca(id, res);
    if (res === 'ok') correctos++;
  });
  if (correctos === cfg.campos.length) {
    retro(bloque).innerHTML = `<p class="retro-ok">✔ ${escHtml(cfg.confirmacion)}</p>`;
  } else {
    const faltan = cfg.campos.length - correctos;
    retro(bloque).innerHTML = `<p class="retro-error">Todavía no: ${correctos} de ${cfg.campos.length} campos correctos. ` +
      `${faltan === 1 ? 'Falta revisar 1 campo' : 'Faltan revisar ' + faltan + ' campos'} (marcados en rojo o con «·»). Usá «Ver pista» si lo necesitás.</p>`;
  }
  guardarEstado();
  actualizarProgreso();
}

function mostrarPista(bloque) {
  const cfg = RESPUESTAS.bloques[bloque];
  const pendiente = cfg.campos.find(id => estado.marcas[id] !== 'ok');
  const texto = pendiente ? RESPUESTAS.campos[pendiente].pista : cfg.pista;
  retro(bloque).innerHTML = `<p class="retro-pista"><strong>Pista:</strong> ${escHtml(texto)}</p>`;
}

function mostrarProcedimiento(bloque) {
  const cfg = RESPUESTAS.bloques[bloque];
  retro(bloque).innerHTML = `<div class="retro-proc"><strong>Procedimiento:</strong><p>${cfg.procedimiento}</p></div>`;
}

function reintentarBloque(bloque) {
  const cfg = RESPUESTAS.bloques[bloque];
  cfg.campos.forEach(id => {
    delete estado.campos[id];
    delete estado.marcas[id];
    const input = document.getElementById('c-' + id);
    if (input) input.value = '';
    pintarMarca(id, null);
  });
  retro(bloque).innerHTML = '';
  guardarEstado();
  actualizarProgreso();
}

function mostrarCriterios(bloque, ids) {
  const partes = ids.map((id, i) =>
    `<li><strong>Pregunta ${i + 1}:</strong> ${escHtml(RESPUESTAS.criterios[id] || '')}</li>`).join('');
  retro(bloque).innerHTML = `<div class="retro-proc"><strong>Criterios orientativos</strong> ` +
    `<span class="nota-criterio">(no son la única respuesta válida: sirven para revisar la tuya)</span><ol class="criterios">${partes}</ol></div>`;
}

function reintentarTextos(bloque, ids) {
  ids.forEach(id => {
    delete estado.textos[id];
    const ta = document.getElementById('ta-' + id);
    if (ta) ta.value = '';
  });
  retro(bloque).innerHTML = '';
  guardarEstado();
  actualizarProgreso();
}

// ---------------------------------------------------------------
// PROGRESO
// ---------------------------------------------------------------
function progresoActividad(act) {
  const numericos = Object.keys(RESPUESTAS.campos).filter(id => id.startsWith(act.id + '-'));
  const abiertas = Object.keys(RESPUESTAS.criterios).filter(id => id.startsWith(act.id + '-'));
  const total = numericos.length + abiertas.length;
  const hechos = numericos.filter(id => estado.marcas[id] === 'ok').length +
    abiertas.filter(id => (estado.textos[id] || '').trim().length >= 10).length;
  return { hechos, total };
}

function actualizarProgreso() {
  const act = actividadActual();
  if (act && act.desarrollada) {
    const p = progresoActividad(act);
    const barra = document.getElementById('barra-progreso');
    if (barra) {
      barra.style.width = (p.total ? Math.round(100 * p.hechos / p.total) : 0) + '%';
      document.getElementById('texto-progreso').textContent =
        `Progreso de la actividad: ${p.hechos} de ${p.total} ${p.total === 1 ? 'ítem' : 'ítems'}`;
    }
  }
  construirNav();
}

// ---------------------------------------------------------------
// NAVEGACIÓN
// ---------------------------------------------------------------
function rutaActual() {
  return (location.hash || '#inicio').slice(1);
}

function actividadActual() {
  const r = rutaActual();
  return ACTIVIDADES.find(a => a.id === r) || null;
}

function construirNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const ruta = rutaActual();
  let html = `<a class="nav-inicio${ruta === 'inicio' ? ' activo' : ''}" href="#inicio">Inicio · Los datos</a>`;

  UNIDADES.forEach(u => {
    const acts = ACTIVIDADES.filter(a => a.unidad === u.id);
    html += `<div class="nav-grupo"><p class="nav-unidad">${escHtml(u.titulo)} <span>· ${escHtml(u.subtitulo)}</span></p><ul>`;
    acts.forEach(a => {
      const p = a.desarrollada ? progresoActividad(a) : null;
      const completa = p && p.total > 0 && p.hechos === p.total;
      const estadoTxt = a.desarrollada
        ? (completa ? '<span class="chip chip-ok">✔ completa</span>' : `<span class="chip">${p.hechos}/${p.total}</span>`)
        : '<span class="chip chip-pend">en preparación</span>';
      const activo = ruta === a.id ? ' activo' : '';
      html += `<li><a class="nav-act${activo}" href="#${a.id}"><span class="nav-num">${a.numero}</span><span class="nav-txt">${escHtml(a.titulo)}</span>${estadoTxt}</a></li>`;
    });
    html += `</ul></div>`;
  });

  nav.innerHTML = html;
}

function anterioresSiguientes(act) {
  const i = ACTIVIDADES.indexOf(act);
  return {
    prev: i > 0 ? ACTIVIDADES[i - 1] : null,
    next: i < ACTIVIDADES.length - 1 ? ACTIVIDADES[i + 1] : null
  };
}

// ---------------------------------------------------------------
// PÁGINAS
// ---------------------------------------------------------------
function paginaInicio() {
  const filas = DATOS.estaciones.map((e, i) =>
    `<tr><td>${i + 1}</td><td>${escHtml(e.nombre)}</td><td>${escHtml(e.provincia)}</td><td>${e.sigla}</td><td class="num">${e.lluvia.toLocaleString('es-AR')}</td></tr>`).join('');

  // Matriz de distancias
  const enc = DATOS.ordenSiglas.map(s => `<th scope="col">${s}</th>`).join('');
  const filasDist = DATOS.distancias.map((fila, i) =>
    `<tr><th scope="row">${DATOS.ordenSiglas[i]}</th>` +
    fila.map(d => `<td class="num">${d === null ? '—' : d.toLocaleString('es-AR')}</td>`).join('') + `</tr>`).join('');

  // Esquema de la franja (no está a escala)
  const n = DATOS.estaciones.length;
  const x0 = 60, x1 = 740, y = 60;
  const paso = (x1 - x0) / (n - 1);
  const puntos = DATOS.estaciones.map((e, i) => {
    const x = x0 + i * paso;
    return `<g><circle cx="${x}" cy="${y}" r="6" class="svg-pto"/>` +
      `<text x="${x}" y="${y - 22}" text-anchor="middle" class="svg-sig">${e.sigla}</text>` +
      `<text x="${x}" y="${y + 30}" text-anchor="middle" class="svg-lluvia">${e.lluvia.toLocaleString('es-AR')}</text></g>`;
  }).join('');
  const esquema = `<svg viewBox="0 0 800 110" role="img" aria-label="Esquema de las ocho estaciones de oeste a este, con su lluvia anual">` +
    `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="svg-linea"/>${puntos}` +
    `<text x="${x0}" y="104" class="svg-ref">Mendoza</text>` +
    `<text x="${x1}" y="104" text-anchor="end" class="svg-ref">Entre Ríos</text>` +
    `<text x="400" y="104" text-anchor="middle" class="svg-ref">OESTE → ESTE (esquema, no a escala)</text></svg>`;

  return `
    <header class="encabezado-pagina">
      <p class="migas">Universidad del Salvador · Licenciatura en Geomática</p>
      <h1>Actividad práctica: la lluvia en la Argentina</h1>
      <p class="subtitulo">Unidades 1, 2 y 3 · Análisis Geoestadístico Aplicado · 2026</p>
      <p class="docente">Docente: Lic. María de los Ángeles Jaimes</p>
    </header>

    <section class="panel">
      <h2>Presentación</h2>
      <p>Esta es una <strong>actividad orientativa y de práctica, no obligatoria</strong>. Se resuelve <strong>a mano</strong>, con calculadora, sin ningún programa. La idea es entender qué hace cada fórmula antes de que, más adelante, la calcule un SIG.</p>
      <p>Cada actividad indica a qué unidad y tema corresponde, la fórmula que se usa y una tabla para completar. Las actividades van en orden: cada una usa resultados de las anteriores.</p>
    </section>

    <section class="panel">
      <h2>Los datos</h2>
      <p>Vamos a trabajar con <strong>8 estaciones meteorológicas reales</strong> del Servicio Meteorológico Nacional, ubicadas en una franja de oeste a este, entre Mendoza y Entre Ríos (aproximadamente entre los 31° y los 34° de latitud sur). La variable es la <strong>precipitación media anual</strong> del período 1991–2020, redondeada al milímetro.</p>

      <div class="tabla-wrap">
        <table class="tabla">
          <caption>Estaciones y lluvia anual</caption>
          <thead><tr><th scope="col">N.º</th><th scope="col">Estación</th><th scope="col">Provincia</th><th scope="col">Sigla</th><th scope="col">Lluvia anual (mm)</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      <p>Las estaciones están ordenadas <strong>de oeste a este</strong>. Así quedan en el mapa:</p>
      <div class="esquema">${esquema}</div>

      <details class="desplegable">
        <summary>Distancias entre estaciones (km). Las vas a necesitar en la Actividad 9.</summary>
        <div class="tabla-wrap">
          <table class="tabla tabla-dist">
            <caption class="sr-only">Matriz de distancias entre estaciones, en km</caption>
            <thead><tr><th scope="col"><span class="sr-only">Estación</span></th>${enc}</tr></thead>
            <tbody>${filasDist}</tbody>
          </table>
        </div>
      </details>

      <p class="fuente">Fuente: Servicio Meteorológico Nacional (2023). <em>Estadísticas Climatológicas Normales: República Argentina – Período 1991–2020</em>. Repositorio institucional del SMN. Distancias calculadas a partir de las coordenadas de cada estación.</p>

      <div class="problema">
        <p><strong>El problema geográfico:</strong> ¿cómo cambia la lluvia de la cordillera al Litoral? ¿Las estaciones cercanas se parecen? ¿Hasta qué distancia?</p>
      </div>
    </section>

    <section class="panel">
      <h2>Cómo trabajar</h2>
      <ul class="lista-simple">
        <li>Escribí los resultados en los campos. Los números pueden escribirse como <code>721,75</code> o <code>721.75</code>.</li>
        <li><strong>Comprobar</strong> revisa cada campo: ✔ correcto, ✖ revisar.</li>
        <li><strong>Ver pista</strong> da una ayuda sin mostrar el resultado. <strong>Ver procedimiento</strong> muestra los pasos.</li>
        <li><strong>Reintentar</strong> borra los campos de ese ejercicio para volver a intentarlo.</li>
        <li>Las preguntas abiertas se escriben con tus palabras. Los criterios orientativos aparecen solo si los pedís.</li>
        <li>Tu progreso se guarda en este navegador. Si usás otra computadora, empezás de nuevo.</li>
      </ul>
      <p><a class="btn btn-primario" href="#a1">Empezar con la Actividad 1 →</a></p>
    </section>`;
}

function paginaActividad(act) {
  const u = UNIDADES.find(x => x.id === act.unidad);
  const cab = `
    <header class="encabezado-pagina">
      <p class="migas">${escHtml(u.titulo)} · ${escHtml(act.tema.charAt(0).toUpperCase() + act.tema.slice(1))}</p>
      <h1>${act.unidad === 'int'
        ? 'Actividad 11 — Integración de las Unidades 1, 2 y 3'
        : `Actividad ${act.numero} — ${escHtml(u.titulo)}: ${escHtml(act.tema)}`}</h1>
      <p class="pregunta"><strong>Pregunta:</strong> ${escHtml(act.pregunta)}</p>
    </header>`;

  const pie = anterioresSiguientes(act);
  const navPie = `
    <nav class="pie-actividad" aria-label="Navegación entre actividades">
      ${pie.prev ? `<a class="btn" href="#${pie.prev.id}">← Actividad ${pie.prev.numero}</a>` : '<span></span>'}
      ${pie.next ? `<a class="btn" href="#${pie.next.id}">Actividad ${pie.next.numero} →</a>` : '<span></span>'}
    </nav>`;

  if (!act.desarrollada) {
    const subs = act.subitems.length
      ? `<ul class="subitems">${act.subitems.map(([c, t]) => `<li><strong>${c}</strong> ${escHtml(t)}</li>`).join('')}</ul>`
      : '';
    return cab + `
      <section class="panel aviso-pendiente">
        <h2>En preparación</h2>
        <p>Esta actividad se desarrolla después de aprobar el prototipo de la Actividad 1. Su estructura ya está prevista:</p>
        ${subs}
      </section>` + navPie;
  }

  const p = progresoActividad(act);
  return cab + `
    <div class="progreso" aria-live="polite">
      <div class="barra"><div id="barra-progreso" class="barra-relleno" style="width:0%"></div></div>
      <p id="texto-progreso" class="texto-progreso">Progreso de la actividad: ${p.hechos} de ${p.total}</p>
    </div>
    <div class="actividad">${act.contenido()}</div>
    ${navPie}`;
}

// ---------------------------------------------------------------
// RENDER PRINCIPAL
// ---------------------------------------------------------------
function render() {
  const main = document.getElementById('principal');
  const ruta = rutaActual();
  const act = actividadActual();
  let html;
  if (act) html = paginaActividad(act);
  else html = paginaInicio();

  main.innerHTML = html;
  renderFormulas(main);
  restaurarCampos(main);
  construirNav();
  if (act && act.desarrollada) actualizarProgreso();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
  document.title = act
    ? `Actividad ${act.numero}: ${act.titulo} · Práctica lluvia en la Argentina`
    : 'Práctica: la lluvia en la Argentina';
  cerrarNavMovil();
}

// ---------------------------------------------------------------
// EVENTOS
// ---------------------------------------------------------------
function cerrarNavMovil() {
  document.getElementById('nav').classList.remove('abierta');
  document.getElementById('btn-nav').setAttribute('aria-expanded', 'false');
}

function configurarEventos() {
  const main = document.getElementById('principal');

  // Botones de acción
  main.addEventListener('click', ev => {
    const btn = ev.target.closest('[data-accion]');
    if (!btn) return;
    const b = btn.dataset.bloque;
    const ids = btn.dataset.ids ? btn.dataset.ids.split(',') : [];
    switch (btn.dataset.accion) {
      case 'comprobar': comprobarBloque(b); break;
      case 'pista': mostrarPista(b); break;
      case 'procedimiento': mostrarProcedimiento(b); break;
      case 'reintentar': reintentarBloque(b); break;
      case 'criterios': mostrarCriterios(b, ids); break;
      case 'reintentar-texto': reintentarTextos(b, ids); break;
    }
  });

  // Escritura en campos: se guarda y se borra la marca anterior
  main.addEventListener('input', ev => {
    const t = ev.target;
    if (t.matches('input.campo')) {
      const id = t.dataset.campo;
      estado.campos[id] = t.value;
      delete estado.marcas[id];
      pintarMarca(id, null);
      guardarEstado();
      actualizarProgreso();
    } else if (t.matches('textarea.texto-abierto')) {
      estado.textos[t.dataset.texto] = t.value;
      guardarEstado();
      actualizarProgreso();
    }
  });

  // Tecla Enter en un campo: comprueba el bloque
  main.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && ev.target.matches('input.campo')) {
      const bloque = ev.target.closest('.bloque');
      if (bloque) {
        const btn = bloque.querySelector('[data-accion="comprobar"]');
        if (btn) btn.click();
      }
    }
  });

  window.addEventListener('hashchange', render);

  // Cabecera: modo oscuro, imprimir, menú móvil, reiniciar
  document.getElementById('btn-tema').addEventListener('click', () => {
    const html = document.documentElement;
    const oscuro = html.dataset.tema !== 'claro';
    html.dataset.tema = oscuro ? 'claro' : 'oscuro';
    try { localStorage.setItem(CLAVE_TEMA, html.dataset.tema); } catch (e) {}
    document.getElementById('btn-tema').textContent = oscuro ? 'Modo oscuro' : 'Modo claro';
  });
  document.getElementById('btn-imprimir').addEventListener('click', () => window.print());
  document.getElementById('btn-nav').addEventListener('click', () => {
    const nav = document.getElementById('nav');
    const abierta = nav.classList.toggle('abierta');
    document.getElementById('btn-nav').setAttribute('aria-expanded', String(abierta));
  });
  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    if (confirm('¿Borrar todo tu progreso y las respuestas guardadas en este navegador?')) {
      estado = { campos: {}, marcas: {}, textos: {} };
      guardarEstado();
      render();
    }
  });
}

function aplicarTemaGuardado() {
  let tema = null;
  try { tema = localStorage.getItem(CLAVE_TEMA); } catch (e) {}
  if (tema === 'oscuro' || tema === 'claro') document.documentElement.dataset.tema = tema;
  const btn = document.getElementById('btn-tema');
  const oscuro = document.documentElement.dataset.tema === 'oscuro' ||
    (!document.documentElement.dataset.tema && window.matchMedia('(prefers-color-scheme: dark)').matches);
  btn.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarTemaGuardado();
  configurarEventos();
  render();
});
