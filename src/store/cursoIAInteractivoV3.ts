/**
 * iAprende · IA Estratégica v3 · PILOTO DESPUBLICADO.
 * Datos de autoría revisables: no se inyecta en Firestore ni reemplaza el curso v2.
 * Ver docs/cursos/ia-estrategica-v3/README.md antes de usar.
 */
import type { Curso, Bloque } from '../types'

export const cursoIAInteractivoV3: Curso = {
  "id": "c-ia-estrategica-v3-piloto",
  "titulo": "IA Estratégica y Diseño de Instrucciones Proactivas · v3.0",
  "descripcion": "Taller interactivo de 135 min: identifica una tarea real, diseña instrucciones claras, prueba resultados, verifica evidencia y entrega un procedimiento reutilizable. Borrador para piloto; no es una certificación CONOCER.",
  "maestro_id": "demo-maestro-001",
  "publicado": false,
  "created_at": "2026-10-30"
}

export const bloquesIAInteractivoV3: Bloque[] = [
  {
    "id": "bia3-01",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 1,
    "tipo": "portada",
    "inicio_pagina": true,
    "contenido": {
      "modulo_numero": 0,
      "modulo_label": "Inicio",
      "titulo": "IA Estratégica v3",
      "subtitulo": "135 minutos · Taller práctico · Construye y verifica una solución reutilizable",
      "gradient_from": "#2A4B7C",
      "gradient_to": "#142b4b",
      "icon_color": "#E07A5F"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-02",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 2,
    "tipo": "infografia",
    "contenido": {
      "titulo": "Tres pilares para aprender con IA",
      "intro": "No aprenderás a repetir definiciones: construirás una solución útil con criterio humano.",
      "pilares": [
        {
          "titulo": "Democratización del conocimiento",
          "icono": "🌐",
          "color": "mint",
          "descripcion": "Accede a explicaciones y ejemplos adaptados a tu oficio, experiencia y contexto. Comprueba siempre las fuentes."
        },
        {
          "titulo": "Automatización de tareas",
          "icono": "⚙️",
          "color": "lavender",
          "descripcion": "Diseña una instrucción reutilizable y un procedimiento de revisión para una tarea repetitiva. El objetivo es mejorar el trabajo, no delegar decisiones críticas sin control."
        },
        {
          "titulo": "Desarrollo colaborativo",
          "icono": "🤝",
          "color": "orange",
          "descripcion": "Comparte versiones, analiza errores con otras personas y mejora tu herramienta usando retroalimentación."
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-03",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 3,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>Tu reto de hoy</h2><p>Al finalizar, el participante <strong>diseñará y probará</strong> una instrucción reutilizable para una tarea de su trabajo, usando un caso sin datos personales reales, realizando al menos <strong>tres pruebas</strong> y documentando sus correcciones con una rúbrica de seguridad, utilidad y verificabilidad.</p>\n<p><strong>Producto:</strong> problema elegido, rol y contexto, prompt funcional, tres entradas de prueba, análisis de errores y versión revisada.</p>\n<p>Trabajaremos con un mismo caso transversal: <strong>una microempresa de fabricación personalizada</strong> que necesita responder cotizaciones ficticias con rapidez y consistencia. Puedes sustituirlo por una actividad equivalente de tu contexto.</p>\n<p><strong>Evaluación del taller (política interna, no mandato del estándar):</strong> diagnóstico sin ponderación; prácticas formativas 50%; proyecto integrador 50%; meta de dominio 80/100. Las evidencias y los puntajes deberán ser validados por el instructor.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-04",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 4,
    "tipo": "cuestionario",
    "contenido": {
      "titulo": "¿Desde dónde partimos?",
      "subtitulo": "Autoexploración sin ponderación en la nota final. La plataforma puede mostrar una recomendación automática, pero no debe considerarse calificación oficial.",
      "preguntas": [
        {
          "id": "d1",
          "texto": "¿Qué debe hacerse con un dato importante generado por IA?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Copiarlo sin revisar",
            "Verificarlo con una fuente fiable",
            "Confiar si suena convincente"
          ],
          "correcta": 1,
          "puntos": 0
        },
        {
          "id": "d2",
          "texto": "¿Cuál es un objetivo útil para diseñar instrucciones?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Especificar la tarea y cómo verificar el resultado",
            "Pedir siempre respuestas más largas",
            "No aportar contexto"
          ],
          "correcta": 0,
          "puntos": 0
        },
        {
          "id": "d3",
          "texto": "¿Qué información conviene evitar en una práctica pública?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Datos ficticios",
            "Nombres, teléfonos y cuentas de clientes reales",
            "Suposiciones etiquetadas"
          ],
          "correcta": 1,
          "puntos": 0
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-05",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 5,
    "tipo": "tarjetas_flip",
    "contenido": {
      "titulo": "¿Qué tipo de interacción necesitas?",
      "instrucciones": "Toca cada tarjeta, compara el ejemplo con tu experiencia y explica qué cambiarías.",
      "tarjetas": [
        {
          "frente": "Consulta",
          "reverso": "Resuelve una duda puntual; verifica información cambiante.",
          "color": "#D4E5DF"
        },
        {
          "frente": "Herramienta reutilizable",
          "reverso": "Una instrucción, un conjunto de entradas y pruebas repetibles; es el foco de este taller.",
          "color": "#FDEBD0"
        },
        {
          "frente": "Colaboración",
          "reverso": "Una persona y la IA diseñan, revisan y perfeccionan juntos una solución compleja.",
          "color": "#E6E1F0"
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-06",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 6,
    "tipo": "portada",
    "inicio_pagina": true,
    "contenido": {
      "modulo_numero": 1,
      "modulo_label": "Módulo 1",
      "titulo": "Encuentra una tarea valiosa",
      "subtitulo": "25 min · Comprender capacidades y elegir un problema",
      "gradient_from": "#2A4B7C",
      "gradient_to": "#142b4b",
      "icon_color": "#E07A5F"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-07",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 7,
    "tipo": "comparador",
    "contenido": {
      "titulo": "Clasifica: ¿búsqueda o asistencia generativa?",
      "descripcion": "La clasificación contrasta usos habituales; existen buscadores con funciones generativas y asistentes que usan búsqueda web.",
      "col_a_titulo": "Búsqueda de fuentes",
      "col_b_titulo": "Generación y transformación",
      "caracteristicas": [
        "Necesito un documento oficial actualizado",
        "Quiero reformular una propuesta comercial ficticia",
        "Debo encontrar el texto vigente de una norma",
        "Busco tres alternativas de redacción",
        "Quiero consultar el precio actual de un insumo",
        "Deseo convertir notas en una tabla"
      ],
      "correctas_a": [
        0,
        2,
        4
      ],
      "correctas_b": [
        1,
        3,
        5
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-08",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 8,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>Modelos, tokens y evidencia</h2><p>Un modelo de lenguaje procesa <strong>tokens</strong> (fragmentos de texto y otras representaciones según el sistema). Su salida puede ser convincente sin ser correcta. El uso de herramientas, búsqueda y verificación modifica lo que puede hacer.</p>\n<p>No todos los modelos funcionan igual. Algunos emplean <em>mezcla de expertos</em>, otros no; pedir «actúa como contador» <strong>no garantiza que se active un experto interno</strong>. El rol sirve para expresar perspectiva y expectativas, no para certificar conocimiento.</p>\n<p>En información de precios, normativas, salud o seguridad, pide fecha y fuentes; <strong>confirma en documentos primarios</strong>. Identifica qué supuestos hizo el modelo.</p>\n<p>Ejemplo: una cotización ficticia debe separar datos del cliente, precios conocidos, cálculos comprobables y condiciones por confirmar.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-09",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 9,
    "tipo": "simulador",
    "contenido": {
      "titulo": "Decisiones bajo incertidumbre",
      "instrucciones": "Lee el caso y elige la primera acción. Práctica local: el resultado no se guarda ni forma parte de la calificación.",
      "altura_px": 380,
      "html": "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>body{font-family:system-ui,sans-serif;background:#faf8f4;color:#183251;padding:15px;margin:0}h2{font-size:17px}button{display:block;width:100%;padding:11px;text-align:left;margin:8px 0;border-radius:12px;border:1px solid #b7c8d6;background:white;color:#183251;cursor:pointer}button:focus-visible{outline:3px solid #d97b4d}#feed{padding:12px;border-radius:10px;min-height:40px;margin-top:12px;background:#e9f0ed}small{color:#4b6177}</style></head><body><h2 id=\"q\"></h2><div id=\"options\"></div><div id=\"feed\" role=\"status\" aria-live=\"polite\">Selecciona una respuesta para revisar tu razonamiento.</div><small>Simulación didáctica sin conexión a servicios IA.</small><script>const x={\"question\":\"Una IA redactó una cotización de 20 mamparas, pero inventó el precio del MDF. ¿Qué haces?\",\"opts\":[\"Envías la propuesta porque se ve profesional\",\"Solicitas precio verificado y recalculas la cotización\",\"Ocultas la estimación para no confundir al cliente\"],\"correct\":1,\"explain\":\"Una respuesta convincente no sustituye una fuente de precio validada ni el cálculo de materiales.\"};document.getElementById('q').textContent=x.question;const c=document.getElementById('options');x.opts.forEach((o,i)=>{const bt=document.createElement('button');bt.textContent=o;bt.onclick=()=>{document.getElementById('feed').textContent=(i===x.correct?'✓ Correcto. ':'Revisa tu elección. ')+x.explain;};c.appendChild(bt);});</script></body></html>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-10",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 10,
    "tipo": "tarjetas_flip",
    "contenido": {
      "titulo": "Diferencias que debes poder explicar",
      "instrucciones": "Toca cada tarjeta, compara el ejemplo con tu experiencia y explica qué cambiarías.",
      "tarjetas": [
        {
          "frente": "Tokens",
          "reverso": "Unidades de procesamiento del modelo; no siempre equivalen a palabras.",
          "color": "#D4E5DF"
        },
        {
          "frente": "Contexto",
          "reverso": "Datos y límites relevantes proporcionados para una tarea.",
          "color": "#FDEBD0"
        },
        {
          "frente": "Alucinación",
          "reverso": "Contenido sin sustento o incorrecto presentado como respuesta.",
          "color": "#E6E1F0"
        },
        {
          "frente": "Evaluación",
          "reverso": "Casos y criterios para comparar respuestas y descubrir errores.",
          "color": "#EBF3FB"
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-11",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 11,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>Elegir una tarea que sí vale la pena</h2><p>Prioriza tareas repetitivas, con entradas disponibles, formato de salida claro y revisión humana posible.</p>\n<p>No automatices al inicio decisiones que afecten derechos, seguridad o dinero sin controles apropiados.</p>\n<p>Usa el caso ficticio de <strong>cotización de letras decorativas</strong> o elige una actividad de tu empleo: responder correos, organizar requerimientos, comparar especificaciones o redactar instructivos.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-12",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 12,
    "tipo": "tabla_editable",
    "contenido": {
      "titulo": "Tu bitácora: tres actividades reales",
      "descripcion": "Registra al menos tres tareas. Estas filas alimentan el contexto y las siguientes decisiones. No escribas datos identificables de clientes.",
      "columnas": [
        "Proceso",
        "Tiempo/semana",
        "¿Se repite?",
        "Candidato IA"
      ],
      "filas_default": [
        {
          "proceso": "Redactar respuesta de cotización ficticia",
          "tiempo_semana": "2 h",
          "se_repite": true,
          "candidato_ia": "Alto"
        },
        {
          "proceso": "Ordenar pedidos por prioridad",
          "tiempo_semana": "1 h",
          "se_repite": true,
          "candidato_ia": "Medio"
        },
        {
          "proceso": "Responder dudas frecuentes de productos",
          "tiempo_semana": "3 h",
          "se_repite": true,
          "candidato_ia": "Alto"
        }
      ],
      "progreso_field": "bitacora",
      "ayuda": "Elige una tarea con una salida comprobable y escríbela en tu contexto de la siguiente sección."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-13",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 13,
    "tipo": "portada",
    "inicio_pagina": true,
    "contenido": {
      "modulo_numero": 2,
      "modulo_label": "Módulo 2",
      "titulo": "Diseña y prueba tu instrucción",
      "subtitulo": "55 min · Construir un prompt y evaluarlo con casos",
      "gradient_from": "#2A4B7C",
      "gradient_to": "#142b4b",
      "icon_color": "#E07A5F"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-14",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 14,
    "tipo": "infografia",
    "contenido": {
      "titulo": "Cinco piezas y una obligación adicional: verificar",
      "intro": "ROL · CONTEXTO · INSTRUCCIÓN · RESTRICCIONES · FORMATO no es una fórmula obligatoria ni universal: es una plantilla didáctica para empezar.",
      "pilares": [
        {
          "titulo": "Rol + contexto",
          "icono": "🧭",
          "color": "mint",
          "descripcion": "Qué perspectiva conviene adoptar, quién usará el resultado y qué datos son conocidos."
        },
        {
          "titulo": "Tarea + restricciones",
          "icono": "🛠️",
          "color": "lavender",
          "descripcion": "Qué producto se necesita, qué debe evitarse y cuándo corresponde pedir más información."
        },
        {
          "titulo": "Formato + verificación",
          "icono": "✅",
          "color": "orange",
          "descripcion": "Cómo entregar la respuesta y qué pruebas debe pasar antes de usarse."
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-15",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 15,
    "tipo": "campo_libre",
    "contenido": {
      "titulo": "Paso 1. Define una perspectiva útil",
      "descripcion": "Describe el tipo de asistencia que necesitas, no una credencial imaginaria del modelo.",
      "placeholder": "Ejemplo: Ayúdame como asistente de cotizaciones de un taller de fabricación personalizada; indica cuándo faltan datos para calcular.",
      "template": "",
      "progreso_field": "rol_construido",
      "ayuda": "Guarda esta versión. La recuperarás en el resumen final."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-16",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 16,
    "tipo": "campo_libre",
    "contenido": {
      "titulo": "Paso 2. Define tu contexto",
      "descripcion": "Utiliza datos sintéticos; especifica unidades, moneda, propósito, entradas disponibles y lo que falta.",
      "placeholder": "Ejemplo: Cotizaciones ficticias en MXN para productos de MDF. Recibirás medidas, cantidad y acabado; no inventes costos y pregunta antes de fijar precio.",
      "template": "",
      "progreso_field": "contexto_construido",
      "ayuda": "No incluyas nombres, contactos, teléfonos, órdenes reales ni datos bancarios."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-17",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 17,
    "tipo": "tarjetas_flip",
    "contenido": {
      "titulo": "De una petición difusa a un procedimiento repetible",
      "instrucciones": "Toca cada tarjeta, compara el ejemplo con tu experiencia y explica qué cambiarías.",
      "tarjetas": [
        {
          "frente": "Instrucción débil: «Cotízame»",
          "reverso": "Instrucción útil: «Extrae cantidades, medidas y acabados; enumera los datos faltantes y prepara un borrador de cotización».",
          "color": "#D4E5DF"
        },
        {
          "frente": "Restricción",
          "reverso": "«No inventes costos; marca cada supuesto como PENDIENTE; solicita datos antes de calcular importes».",
          "color": "#FDEBD0"
        },
        {
          "frente": "Formato",
          "reverso": "«Entrega tabla con producto, cantidad, medidas, costo unitario verificado, subtotal, impuestos y observaciones».",
          "color": "#E6E1F0"
        },
        {
          "frente": "Criterio de éxito",
          "reverso": "«Cada cálculo debe cuadrar, cada supuesto debe identificarse y las preguntas pendientes deben ser explícitas».",
          "color": "#EBF3FB"
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-18",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 18,
    "tipo": "simulador",
    "contenido": {
      "titulo": "Elige una especificación verificable",
      "instrucciones": "Lee las alternativas; el ejercicio no hace llamadas a IA. Práctica local: el resultado no se guarda ni forma parte de la calificación.",
      "altura_px": 380,
      "html": "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>body{font-family:system-ui,sans-serif;background:#faf8f4;color:#183251;padding:15px;margin:0}h2{font-size:17px}button{display:block;width:100%;padding:11px;text-align:left;margin:8px 0;border-radius:12px;border:1px solid #b7c8d6;background:white;color:#183251;cursor:pointer}button:focus-visible{outline:3px solid #d97b4d}#feed{padding:12px;border-radius:10px;min-height:40px;margin-top:12px;background:#e9f0ed}small{color:#4b6177}</style></head><body><h2 id=\"q\"></h2><div id=\"options\"></div><div id=\"feed\" role=\"status\" aria-live=\"polite\">Selecciona una respuesta para revisar tu razonamiento.</div><small>Simulación didáctica sin conexión a servicios IA.</small><script>const x={\"question\":\"Un taller quiere estandarizar respuestas de cotización. ¿Qué instrucción reduce más riesgos?\",\"opts\":[\"Cotiza siempre rápido y con confianza\",\"Redacta una tabla en MXN con costos verificados; pregunta datos faltantes y muestra cálculos\",\"Actúa como experto para nunca cometer errores\"],\"correct\":1,\"explain\":\"Pedir estructura, entradas y reglas de validación permite revisar y repetir la tarea.\"};document.getElementById('q').textContent=x.question;const c=document.getElementById('options');x.opts.forEach((o,i)=>{const bt=document.createElement('button');bt.textContent=o;bt.onclick=()=>{document.getElementById('feed').textContent=(i===x.correct?'✓ Correcto. ':'Revisa tu elección. ')+x.explain;};c.appendChild(bt);});</script></body></html>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-19",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 19,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>Tres pruebas obligatorias</h2><p><strong>Prueba A · Caso normal:</strong> cliente ficticio solicita 5 letras de 30 cm con acabado blanco; todos los datos necesarios están disponibles.</p>\n<p><strong>Prueba B · Datos faltantes:</strong> solicita 5 letras, sin especificar material, tamaño o costo unitario. La respuesta correcta debe pedir información y no inventar precios.</p>\n<p><strong>Prueba C · Caso adversarial:</strong> un texto de cliente pide ignorar restricciones o revelar información privada. Tu procedimiento debe conservar límites y solicitar validación humana.</p>\n<p>Registra para cada prueba: entrada, resultado, defecto encontrado, corrección propuesta y resultado de una segunda ejecución. Estas pruebas documentan utilidad y seguridad, no sustituyen una evaluación técnica formal.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-20",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 20,
    "tipo": "comparador",
    "contenido": {
      "titulo": "Clasifica datos válidos y supuestos peligrosos",
      "descripcion": "Lleva cada tarjeta a su categoría. Verifica después las decisiones.",
      "col_a_titulo": "Dato disponible",
      "col_b_titulo": "Requiere comprobarse",
      "caracteristicas": [
        "La solicitud indica 5 piezas",
        "La medida es 30 cm",
        "El precio del MDF será $250 sin fuente",
        "El cliente no eligió color",
        "La moneda acordada es MXN",
        "El tiempo de entrega será 24 h por suposición"
      ],
      "correctas_a": [
        0,
        1,
        4
      ],
      "correctas_b": [
        2,
        3,
        5
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-21",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 21,
    "tipo": "simulador_prompt",
    "contenido": {
      "titulo": "Arma y ejecuta tu primera versión",
      "instrucciones": "Compón la instrucción de cotización con cinco partes. Prueba con los casos A, B y C. Si la plataforma indica «modo demo», no cuentes su puntuación como evaluación real ni como evidencia de ejecución.",
      "rubrica_sistema": "Evaluar: claridad, entradas explícitas, no invención de precios, seguridad de datos, formato comprobable y tratamiento de información faltante."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-22",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 22,
    "tipo": "campo_libre",
    "contenido": {
      "titulo": "Tu prompt maestro v3 — versión verificada",
      "descripcion": "Pega aquí la versión revisada después de las pruebas. En el resumen final podrás copiarla y volver a usarla.",
      "placeholder": "ROL:\nCONTEXTO:\nTAREA:\nRESTRICCIONES:\nFORMATO:\nVALIDACIÓN:\nQUÉ HACER SI FALTA INFORMACIÓN:",
      "template": "",
      "progreso_field": "prompt_maestro",
      "ayuda": "No afirmes que pasó las pruebas si el simulador estuvo en demo."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-23",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 23,
    "tipo": "cuestionario",
    "contenido": {
      "titulo": "Comprueba si puedes diseñar una instrucción segura",
      "subtitulo": "Retroalimentación automática orientativa. La validación de evidencias del taller corresponde al instructor.",
      "preguntas": [
        {
          "id": "f1",
          "texto": "¿Qué regla evita inventar precios?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Responder sin preguntar",
            "Pedir la tarifa vigente y señalar datos faltantes",
            "Usar números plausibles"
          ],
          "correcta": 1,
          "puntos": 25
        },
        {
          "id": "f2",
          "texto": "¿Cuál es una prueba útil?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Solo el ejemplo perfecto",
            "Caso normal, caso incompleto y caso adversarial",
            "Cambiar el color del formulario"
          ],
          "correcta": 1,
          "puntos": 25
        },
        {
          "id": "f3",
          "texto": "¿Por qué definir un formato de salida?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Para que nunca falle",
            "Para comparar y validar resultados",
            "Para usar menos palabras siempre"
          ],
          "correcta": 1,
          "puntos": 25
        },
        {
          "id": "f4",
          "texto": "¿Qué debe hacerse con resultados generados?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Revisar cálculos y fuentes",
            "Confiar si el prompt es largo",
            "Publicar sin supervisión"
          ],
          "correcta": 0,
          "puntos": 25
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-24",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 24,
    "tipo": "portada",
    "inicio_pagina": true,
    "contenido": {
      "modulo_numero": 3,
      "modulo_label": "Módulo 3",
      "titulo": "Verificación y criterio humano",
      "subtitulo": "20 min · Evaluar resultados, seguridad y colaboración",
      "gradient_from": "#2A4B7C",
      "gradient_to": "#142b4b",
      "icon_color": "#E07A5F"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-25",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 25,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>De respuestas bonitas a respuestas confiables</h2><p>Separar hechos de inferencias: una tabla puede verse impecable y aun así contener cifras inventadas.</p>\n<p>Exigir fuentes cuando corresponda, recalcular importes, solicitar aclaraciones y contrastar contra ejemplos conocidos.</p>\n<p>Una puntuación de IA es <strong>orientativa</strong>; el instructor debe revisar el producto final con una rúbrica y conservar una evidencia concreta de las pruebas.</p>\n<p>En trabajo colaborativo, solicita a un compañero que identifique un error o una pregunta que el prompt no contempla.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-26",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 26,
    "tipo": "simulador",
    "contenido": {
      "titulo": "Desafío de verificación",
      "instrucciones": "Selecciona la decisión más responsable. Práctica local: el resultado no se guarda ni forma parte de la calificación.",
      "altura_px": 380,
      "html": "<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>body{font-family:system-ui,sans-serif;background:#faf8f4;color:#183251;padding:15px;margin:0}h2{font-size:17px}button{display:block;width:100%;padding:11px;text-align:left;margin:8px 0;border-radius:12px;border:1px solid #b7c8d6;background:white;color:#183251;cursor:pointer}button:focus-visible{outline:3px solid #d97b4d}#feed{padding:12px;border-radius:10px;min-height:40px;margin-top:12px;background:#e9f0ed}small{color:#4b6177}</style></head><body><h2 id=\"q\"></h2><div id=\"options\"></div><div id=\"feed\" role=\"status\" aria-live=\"polite\">Selecciona una respuesta para revisar tu razonamiento.</div><small>Simulación didáctica sin conexión a servicios IA.</small><script>const x={\"question\":\"El modelo devuelve «Total: $2,500» sin desglose ni costo unitario verificado. ¿Qué reportas?\",\"opts\":[\"Se aprobó porque el total es redondo\",\"No verificable: solicitar tarifa, desglose y revisar operaciones\",\"El cliente puede corregirlo después\"],\"correct\":1,\"explain\":\"El criterio principal es demostrar de dónde sale cada cifra y quién la aprobó.\"};document.getElementById('q').textContent=x.question;const c=document.getElementById('options');x.opts.forEach((o,i)=>{const bt=document.createElement('button');bt.textContent=o;bt.onclick=()=>{document.getElementById('feed').textContent=(i===x.correct?'✓ Correcto. ':'Revisa tu elección. ')+x.explain;};c.appendChild(bt);});</script></body></html>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-27",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 27,
    "tipo": "caso_etico",
    "contenido": {
      "titulo": "Un cliente exige una respuesta inmediata",
      "situacion": "Un asistente IA recibió información de tres pedidos ficticios. Un cliente pide el descuento de otra persona y quiere una cotización en un minuto, sin verificar precios. En equipos, decide cómo responder sin revelar información ni inventar datos.",
      "preguntas": [
        "¿Qué información no debe compartirse y por qué?",
        "¿Cómo responderías al cliente preservando utilidad y transparencia?",
        "¿Quién debe revisar y autorizar el resultado antes de enviarlo?"
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-28",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 28,
    "tipo": "checklist",
    "contenido": {
      "titulo": "Cuatro condiciones antes de usar tu resultado",
      "descripcion": "Marca solo criterios que hayas verificado con evidencia real. No equivale a acreditación.",
      "items": [
        "No utilicé datos personales de clientes ni información confidencial sin autorización",
        "Comprobé los datos y cálculos relevantes contra fuentes disponibles",
        "Probé un caso incompleto y documenté cómo el sistema pide aclaraciones",
        "Definí cuándo se requiere revisión y autorización humana"
      ],
      "progreso_field": "auditoria_etica"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-29",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 29,
    "tipo": "portada",
    "inicio_pagina": true,
    "contenido": {
      "modulo_numero": 4,
      "modulo_label": "Módulo 4",
      "titulo": "Entrega tu herramienta",
      "subtitulo": "20 min · Evidencias, rúbrica y transferencia al trabajo",
      "gradient_from": "#2A4B7C",
      "gradient_to": "#142b4b",
      "icon_color": "#E07A5F"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-30",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 30,
    "tipo": "texto",
    "contenido": {
      "html": "<section class=\"iaprende-v3\"><h2>Una herramienta útil, no una definición memorizada</h2><p><strong>Entrega mínima:</strong> tu proceso elegido, rol, contexto, prompt maestro v3 y registro de las pruebas A, B y C, incluyendo al menos una corrección concreta.</p>\n<p><strong>Rúbrica del proyecto (100 puntos):</strong> definición de problema 15, instrucciones y formato 20, pruebas y correcciones 30, verificación factual 20 y privacidad/uso responsable 15.</p>\n<p>El instructor revisa evidencias y asigna puntuación. El motor actual <strong>no calcula ni registra automáticamente</strong> esta rúbrica a partir del simulador.</p>\n<p>En la sesión presencial explica tu solución a un compañero y solicita una mejora antes de entregar.</p></section>"
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-31",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 31,
    "tipo": "cuestionario",
    "contenido": {
      "titulo": "Verifica lo que te llevas",
      "subtitulo": "Prueba objetiva de comprensión, complementaria al proyecto. La rúbrica del proyecto se evalúa por separado.",
      "preguntas": [
        {
          "id": "s1",
          "texto": "¿Qué significa una salida verificable?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Que es extensa",
            "Que sus datos, operaciones y supuestos pueden comprobarse",
            "Que contiene emojis"
          ],
          "correcta": 1,
          "puntos": 20
        },
        {
          "id": "s2",
          "texto": "Un rol en el prompt…",
          "tipo": "opcion_multiple",
          "opciones": [
            "Garantiza que se activa un experto interno del modelo",
            "Aclara perspectiva y expectativas, sin garantías de exactitud",
            "Sustituye las fuentes"
          ],
          "correcta": 1,
          "puntos": 20
        },
        {
          "id": "s3",
          "texto": "¿Cómo abordas un dato faltante?",
          "tipo": "opcion_multiple",
          "opciones": [
            "Lo inventas con aproximación oculta",
            "Lo pides o lo marcas pendiente",
            "Ignoras la necesidad de revisarlo"
          ],
          "correcta": 1,
          "puntos": 20
        },
        {
          "id": "s4",
          "texto": "Describe una corrección que hiciste tras una prueba y cómo comprobarías que funciona.",
          "tipo": "abierta",
          "puntos": 40
        }
      ]
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-32",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 32,
    "tipo": "resumen_personal",
    "contenido": {
      "titulo": "Tu herramienta lista para seguir mejorando",
      "descripcion": "Recupera el rol, el contexto y el prompt que guardaste. Copia el resultado y conserva aparte tu bitácora de tres pruebas y la rúbrica revisada."
    },
    "created_at": "2026-10-30"
  },
  {
    "id": "bia3-33",
    "curso_id": "c-ia-estrategica-v3-piloto",
    "orden": 33,
    "tipo": "mapa_ecosistema",
    "contenido": {
      "titulo": "Tres caminos para transferir lo aprendido",
      "descripcion": "En las próximas 72 horas, utiliza tu herramienta en un caso autorizado, mide el resultado y comparte una mejora.",
      "categorias": [
        {
          "nombre": "Conocimiento",
          "color": "#2A4B7C",
          "herramientas": [
            "Profundizar fuentes",
            "Documentar límites",
            "Aprender con contexto"
          ]
        },
        {
          "nombre": "Automatización",
          "color": "#397E72",
          "herramientas": [
            "Entradas repetibles",
            "Pruebas con casos",
            "Supervisión humana"
          ]
        },
        {
          "nombre": "Colaboración",
          "color": "#E07A5F",
          "herramientas": [
            "Revisión entre pares",
            "Versionado",
            "Mejora continua"
          ]
        }
      ]
    },
    "created_at": "2026-10-30"
  }
]

export const mapaDidacticoIAInteractivoV3 = [
  {
    "id": "bia3-01",
    "fase": "Encuadre",
    "duracion_min": 2,
    "titulo": "Bienvenida",
    "tipo": "portada"
  },
  {
    "id": "bia3-02",
    "fase": "Encuadre",
    "duracion_min": 3,
    "titulo": "Nuestra filosofía",
    "tipo": "infografia"
  },
  {
    "id": "bia3-03",
    "fase": "Encuadre",
    "duracion_min": 4,
    "titulo": "Contrato de aprendizaje",
    "tipo": "texto"
  },
  {
    "id": "bia3-04",
    "fase": "Encuadre",
    "duracion_min": 3,
    "titulo": "Diagnóstico de entrada",
    "tipo": "cuestionario"
  },
  {
    "id": "bia3-05",
    "fase": "Encuadre",
    "duracion_min": 3,
    "titulo": "Tres formas de utilizar IA",
    "tipo": "tarjetas_flip"
  },
  {
    "id": "bia3-06",
    "fase": "Explorar",
    "duracion_min": 1,
    "titulo": "Módulo I",
    "tipo": "portada"
  },
  {
    "id": "bia3-07",
    "fase": "Explorar",
    "duracion_min": 4,
    "titulo": "Búsqueda y generación",
    "tipo": "comparador"
  },
  {
    "id": "bia3-08",
    "fase": "Explorar",
    "duracion_min": 5,
    "titulo": "Qué hace y qué no hace la IA",
    "tipo": "texto"
  },
  {
    "id": "bia3-09",
    "fase": "Explorar",
    "duracion_min": 5,
    "titulo": "Detecta un dato que falta",
    "tipo": "simulador"
  },
  {
    "id": "bia3-10",
    "fase": "Explorar",
    "duracion_min": 3,
    "titulo": "Conceptos clave",
    "tipo": "tarjetas_flip"
  },
  {
    "id": "bia3-11",
    "fase": "Explorar",
    "duracion_min": 4,
    "titulo": "De la curiosidad a un flujo de trabajo",
    "tipo": "texto"
  },
  {
    "id": "bia3-12",
    "fase": "Explorar",
    "duracion_min": 3,
    "titulo": "Bitácora de oportunidades",
    "tipo": "tabla_editable"
  },
  {
    "id": "bia3-13",
    "fase": "Diseñar",
    "duracion_min": 1,
    "titulo": "Módulo II",
    "tipo": "portada"
  },
  {
    "id": "bia3-14",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Arquitectura de una instrucción",
    "tipo": "infografia"
  },
  {
    "id": "bia3-15",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Diseña el rol",
    "tipo": "campo_libre"
  },
  {
    "id": "bia3-16",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Contextualiza con cuidado",
    "tipo": "campo_libre"
  },
  {
    "id": "bia3-17",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Instrucciones, restricciones y formato",
    "tipo": "tarjetas_flip"
  },
  {
    "id": "bia3-18",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "¿Qué instrucción es mejor?",
    "tipo": "simulador"
  },
  {
    "id": "bia3-19",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Diseña tu conjunto de pruebas",
    "tipo": "texto"
  },
  {
    "id": "bia3-20",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Entradas verificables",
    "tipo": "comparador"
  },
  {
    "id": "bia3-21",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Taller de construcción de prompts",
    "tipo": "simulador_prompt"
  },
  {
    "id": "bia3-22",
    "fase": "Diseñar",
    "duracion_min": 5,
    "titulo": "Guarda la versión revisada",
    "tipo": "campo_libre"
  },
  {
    "id": "bia3-23",
    "fase": "Diseñar",
    "duracion_min": 9,
    "titulo": "Evaluación formativa",
    "tipo": "cuestionario"
  },
  {
    "id": "bia3-24",
    "fase": "Validar",
    "duracion_min": 1,
    "titulo": "Módulo III",
    "tipo": "portada"
  },
  {
    "id": "bia3-25",
    "fase": "Validar",
    "duracion_min": 4,
    "titulo": "Cómo verificar sin autoengañarse",
    "tipo": "texto"
  },
  {
    "id": "bia3-26",
    "fase": "Validar",
    "duracion_min": 5,
    "titulo": "Auditor de respuestas",
    "tipo": "simulador"
  },
  {
    "id": "bia3-27",
    "fase": "Validar",
    "duracion_min": 5,
    "titulo": "Dilema ético colaborativo",
    "tipo": "caso_etico"
  },
  {
    "id": "bia3-28",
    "fase": "Validar",
    "duracion_min": 5,
    "titulo": "Autoauditoría de responsabilidad",
    "tipo": "checklist"
  },
  {
    "id": "bia3-29",
    "fase": "Cierre",
    "duracion_min": 1,
    "titulo": "Proyecto final",
    "tipo": "portada"
  },
  {
    "id": "bia3-30",
    "fase": "Cierre",
    "duracion_min": 5,
    "titulo": "Proyecto integrador",
    "tipo": "texto"
  },
  {
    "id": "bia3-31",
    "fase": "Cierre",
    "duracion_min": 6,
    "titulo": "Evaluación final de conceptos",
    "tipo": "cuestionario"
  },
  {
    "id": "bia3-32",
    "fase": "Cierre",
    "duracion_min": 4,
    "titulo": "Tu activo reutilizable",
    "tipo": "resumen_personal"
  },
  {
    "id": "bia3-33",
    "fase": "Cierre",
    "duracion_min": 4,
    "titulo": "Después del taller",
    "tipo": "mapa_ecosistema"
  }
] as const
