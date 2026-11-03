/*
  DATOS ORIGINALES DE LA PRÁCTICA
  Fuente: Servicio Meteorológico Nacional (2023). Estadísticas Climatológicas Normales:
  República Argentina – Período 1991–2020. Distancias calculadas a partir de las coordenadas.
  Valores transcriptos del PDF "Actividad práctica: la lluvia en la Argentina (Unidades 1, 2 y 3)".
  No modificar sin autorización de la docente.
*/

const DATOS = {
  // Estaciones ordenadas de oeste a este (como en el PDF)
  estaciones: [
    { sigla: 'MZ', nombre: 'Mendoza Aero',        provincia: 'Mendoza',   lluvia: 238 },
    { sigla: 'SJ', nombre: 'San Juan Aero',       provincia: 'San Juan',  lluvia: 91 },
    { sigla: 'SL', nombre: 'San Luis Aero',       provincia: 'San Luis',  lluvia: 667 },
    { sigla: 'VR', nombre: 'Villa Reynolds Aero', provincia: 'San Luis',  lluvia: 725 },
    { sigla: 'RC', nombre: 'Río Cuarto Aero',     provincia: 'Córdoba',   lluvia: 839 },
    { sigla: 'MJ', nombre: 'Marcos Juárez Aero',  provincia: 'Córdoba',   lluvia: 943 },
    { sigla: 'RO', nombre: 'Rosario Aero',        provincia: 'Santa Fe',  lluvia: 1053 },
    { sigla: 'GU', nombre: 'Gualeguaychú Aero',   provincia: 'Entre Ríos', lluvia: 1218 }
  ],

  // Matriz de distancias en km (simétrica). Orden de filas y columnas: MZ, SJ, SL, VR, RC, MJ, RO, GU
  ordenSiglas: ['MZ', 'SJ', 'SL', 'VR', 'RC', 'MJ', 'RO', 'GU'],
  distancias: [
    //  MZ    SJ    SL    VR    RC    MJ    RO    GU
    [null, 146,  234,  334,  424,  624,  751,  953],   // MZ
    [146,  null, 272,  373,  426,  605,  736,  938],   // SJ
    [234,  272,  null, 103,  195,  398,  522,  723],   // SL
    [334,  373,  103,  null, 123,  322,  437,  634],   // VR
    [424,  426,  195,  123,  null, 204,  327,  530],   // RC
    [624,  605,  398,  322,  204,  null, 131,  334],   // MJ
    [751,  736,  522,  437,  327,  131,  null, 204],   // RO
    [953,  938,  723,  634,  530,  334,  204,  null]   // GU
  ]
};
