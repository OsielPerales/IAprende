import type { Curso, Bloque } from '../types'

export const cursoIA: Curso = {
    id: 'c-ia-estrategica',
    titulo: 'IA Estratégica y Diseño de Instrucciones Proactivas',
    descripcion: 'Curso-taller de 135 minutos. Diseña y aplica prompts estratégicos con la Estructura Maestra (ROL·CONTEXTO·INSTRUCCIÓN·RESTRICCIONES·FORMATO) para automatizar procesos y amplificar tu productividad. Estándar EC0301.',
    maestro_id: 'demo-maestro-001',
    publicado: true,
    created_at: '2025-03-01',
}

export const bloquesIA: Bloque[] = [

    // ══ PREÁMBULO ══════════════════════════════════════════════════════════════
    {
        id: 'bia-p1',
        curso_id: 'c-ia-estrategica',
        orden: 1,
        tipo: 'portada',
        inicio_pagina: true,
        contenido: {
            modulo_numero: 0,
            modulo_label: 'Bienvenida',
            titulo: 'IA Estratégica y Diseño de Instrucciones Proactivas',
            subtitulo: 'Curso-Taller · 135 min · Estándar EC0301 · Facilitador: Osiel Alejandro Perales Jiménez',
            gradient_from: '#2A4B7C',
            gradient_to: '#1a3456',
            icon_color: '#E07A5F',
        },
        created_at: '2025-03-01',
    },

    // ── P.1 Infografía 3 Pilares
    {
        id: 'bia-p2',
        curso_id: 'c-ia-estrategica',
        orden: 2,
        tipo: 'infografia',
        contenido: {
            titulo: 'La Nueva Economía Cognitiva',
            intro: 'Tres fuerzas están redefiniendo el valor del trabajo humano. Haz clic en cada pilar para explorar.',
            pilares: [
                {
                    titulo: 'Democratización del Conocimiento',
                    icono: '🌐',
                    color: 'mint',
                    descripcion: 'El conocimiento especializado que antes costaba decenas de miles de pesos ahora está al alcance de cualquier persona con acceso a internet y un buen prompt. La IA nivela el campo de juego entre grandes corporaciones y emprendedores individuales.',
                },
                {
                    titulo: 'Automatización de Flujos',
                    icono: '⚙️',
                    color: 'lavender',
                    badge: '→ ESTÁS AQUÍ',
                    descripcion: 'Las tareas repetitivas, los análisis de datos rutinarios y la generación de documentos estándar pueden automatizarse hoy mismo. Este curso te entrega las herramientas para identificar y automatizar tus propios flujos de trabajo.',
                },
                {
                    titulo: 'Amplificación Humana',
                    icono: '🚀',
                    color: 'orange',
                    descripcion: 'La IA no reemplaza al ser humano; multiplica su capacidad. Con los prompts correctos, una persona puede hacer el trabajo de cinco en el mismo tiempo, mientras libera su mente para decisiones estratégicas y creatividad de alto nivel.',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ══ ENCUADRE ═══════════════════════════════════════════════════════════════
    {
        id: 'bia-e1',
        curso_id: 'c-ia-estrategica',
        orden: 3,
        tipo: 'texto',
        inicio_pagina: true,
        contenido: {
            html: `
<div style="text-align:center;padding:12px 0 20px">
  <h1 style="font-size:24px;color:#2A4B7C">Bienvenida al Curso</h1>
  <p style="color:#666;margin-top:6px">El siguiente taller te entregará la habilidad más valiosa de esta década:</p>
  <p style="font-size:18px;font-weight:600;color:#E07A5F;margin-top:8px">Hablarle correctamente a la Inteligencia Artificial.</p>
</div>

<h2>Lo que te llevas hoy</h2>
<ul>
  <li>Entiendes cómo funciona realmente la IA (arquitectura MoE + tokens)</li>
  <li>Construyes tu Prompt Maestro personalizado para un proceso propio</li>
  <li>Identificas sesgos y alucinaciones para usar la IA con responsabilidad</li>
  <li>Sales con un activo: un prompt listo para usar mañana en tu trabajo</li>
</ul>

<h2>Estructura del taller — 135 minutos</h2>
<table style="width:100%;border-collapse:collapse;margin:12px 0">
  <tr style="background:#2A4B7C;color:white">
    <th style="padding:8px 12px;text-align:left;border-radius:4px 0 0 0">Segmento</th>
    <th style="padding:8px 12px;text-align:center">Tiempo</th>
  </tr>
  <tr style="background:#f9f9f7"><td style="padding:8px 12px;border:1px solid #eee">Preámbulo + Encuadre</td><td style="padding:8px;border:1px solid #eee;text-align:center">15 min</td></tr>
  <tr><td style="padding:8px 12px;border:1px solid #eee">Módulo I — Fundamentos</td><td style="padding:8px;border:1px solid #eee;text-align:center">30 min</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:8px 12px;border:1px solid #eee">Módulo II — Estructura Maestra</td><td style="padding:8px;border:1px solid #eee;text-align:center">50 min</td></tr>
  <tr><td style="padding:8px 12px;border:1px solid #eee">Módulo III — Ética y Sesgos</td><td style="padding:8px;border:1px solid #eee;text-align:center">20 min</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:8px 12px;border:1px solid #eee">Evaluación + Cierre</td><td style="padding:8px;border:1px solid #eee;text-align:center">20 min</td></tr>
</table>

<h2>Evaluación</h2>
<table style="width:100%;border-collapse:collapse;margin:12px 0">
  <tr style="background:#2A4B7C;color:white">
    <th style="padding:8px 12px;text-align:left">Aspecto</th>
    <th style="padding:8px 12px;text-align:center">Valor</th>
    <th style="padding:8px 12px;text-align:left">Instrumento</th>
  </tr>
  <tr><td style="padding:8px 12px;border:1px solid #eee">Diagnóstica</td><td style="padding:8px;border:1px solid #eee;text-align:center;color:#888">Referente</td><td style="padding:8px 12px;border:1px solid #eee">Cuestionario inicial (5 preguntas)</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:8px 12px;border:1px solid #eee">Formativa</td><td style="padding:8px;border:1px solid #eee;text-align:center;font-weight:600;color:#E07A5F">50%</td><td style="padding:8px 12px;border:1px solid #eee">Checklist Prompt Maestro (Módulo II)</td></tr>
  <tr><td style="padding:8px 12px;border:1px solid #eee">Sumativa</td><td style="padding:8px;border:1px solid #eee;text-align:center;font-weight:600;color:#E07A5F">50%</td><td style="padding:8px 12px;border:1px solid #eee">Proyecto + Cuestionario (Cierre)</td></tr>
</table>
<p style="font-size:12px;color:#888;margin-top:6px">Mínimo para acreditación: <strong>80%</strong> de la calificación total.</p>
`,
        },
        created_at: '2025-03-01',
    },

    // ── E.2 Objetivo General con verbos taxonómicos
    {
        id: 'bia-e2obj',
        curso_id: 'c-ia-estrategica',
        orden: 4,
        tipo: 'texto',
        contenido: {
            html: `
<h2>E.2 Objetivo General del Curso</h2>
<div style="background:linear-gradient(135deg,#EBF3FB,#F0FFF4);border-radius:14px;padding:20px;margin:16px 0;border-left:5px solid #2A4B7C">
  <p style="font-size:15px;color:#1a3456;line-height:1.8">
    El participante
    <span style="background:#2A4B7C;color:white;padding:2px 10px;border-radius:20px;font-weight:700;font-size:13px;margin:0 3px">DISEÑARÁ</span>
    y
    <span style="background:#15803d;color:white;padding:2px 10px;border-radius:20px;font-weight:700;font-size:13px;margin:0 3px">APLICARÁ</span>
    prompts estratégicos utilizando la <em>Estructura Maestra</em> (ROL·CONTEXTO·INSTRUCCIÓN·RESTRICCIONES·FORMATO) para
    <span style="background:#E07A5F;color:white;padding:2px 10px;border-radius:20px;font-weight:700;font-size:13px;margin:0 3px">AUTOMATIZAR</span>
    procesos personales y empresariales, obteniendo resultados precisos y reutilizables.
  </p>
</div>

<h3>¿Qué significan los verbos del objetivo?</h3>
<div style="display:grid;gap:10px;margin:14px 0">
  <div style="display:flex;align-items:flex-start;gap:12px;background:#EBF3FB;border-radius:10px;padding:12px">
    <span style="background:#2A4B7C;color:white;padding:3px 10px;border-radius:20px;font-weight:700;font-size:12px;white-space:nowrap">DISEÑARÁ</span>
    <p style="font-size:13px;color:#333;margin:0">Nivel de creación (Bloom). No solo copiarás prompts: los construirás desde cero adaptados a tu contexto específico con estructura propia.</p>
  </div>
  <div style="display:flex;align-items:flex-start;gap:12px;background:#F0FFF4;border-radius:10px;padding:12px">
    <span style="background:#15803d;color:white;padding:3px 10px;border-radius:20px;font-weight:700;font-size:12px;white-space:nowrap">APLICARÁ</span>
    <p style="font-size:13px;color:#333;margin:0">Nivel de aplicación. El conocimiento se mide en la práctica: al finalizar el taller, tendrás un prompt real funcionando en tu herramienta de IA favorita.</p>
  </div>
  <div style="display:flex;align-items:flex-start;gap:12px;background:#FFF5F0;border-radius:10px;padding:12px">
    <span style="background:#E07A5F;color:white;padding:3px 10px;border-radius:20px;font-weight:700;font-size:12px;white-space:nowrap">AUTOMATIZARÁ</span>
    <p style="font-size:13px;color:#333;margin:0">El objetivo final. Tu prompt Maestro te permitirá delegar tareas repetitivas a la IA en segundos, liberando tiempo para trabajo estratégico.</p>
  </div>
</div>

<div style="background:#f9f9f7;border:1px solid #eee;border-radius:10px;padding:14px;margin-top:8px">
  <p style="font-size:13px;color:#666;margin:0">
    <strong>Nota pedagógica (EC0301):</strong> Este curso cumple el estándar de competencia laboral en diseño instruccional. Los verbos del objetivo reflejan el Nivel 3-4 de la Taxonomía de Bloom: <em>aplicar, analizar y crear</em>.
  </p>
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── E.3 Mapa del Curso — timeline infografía
    {
        id: 'bia-e3map',
        curso_id: 'c-ia-estrategica',
        orden: 5,
        tipo: 'infografia',
        contenido: {
            titulo: 'Mapa del Curso — Tu Ruta de 135 Minutos',
            intro: 'El taller está dividido en tres fases. Haz clic en cada fase para ver qué construirás en ella.',
            pilares: [
                {
                    titulo: '⏱ Fase 1 — Encuadre y Fundamentos (0–45 min)',
                    icono: '🔭',
                    color: 'mint',
                    descripcion: 'Acuerdos de trabajo · Diagnóstico de tu punto de partida · Cómo funciona la IA realmente (tokens, MoE) · Comparador buscadores vs. motores de razonamiento · Identificas tus procesos automatizables en la Bitácora.',
                },
                {
                    titulo: '⏱ Fase 2 — Estructura Maestra (45–95 min)',
                    icono: '🏗️',
                    color: 'orange',
                    badge: '★ NÚCLEO',
                    descripcion: 'La Estructura RO·CO·IN·RE·FO completa · Construyes tu ROL · Construyes tu CONTEXTO · Aprendes INSTRUCCIÓN, RESTRICCIONES y FORMATO · Ensamblas tu Prompt Maestro en el Simulador · Autoevaluación formativa.',
                },
                {
                    titulo: '⏱ Fase 3 — Ética y Evaluación (95–135 min)',
                    icono: '🎯',
                    color: 'lavender',
                    descripcion: 'Alucinaciones y cómo detectarlas · Mapa del ecosistema IA · Sesgos cognitivos · El Filtro Humano (tus 3 principios éticos) · Caso ético grupal · Evaluación sumativa · Resumen personal y compromisos 72h.',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── E.4 Compromisos de encuadre
    {
        id: 'bia-e2',
        curso_id: 'c-ia-estrategica',
        orden: 6,
        tipo: 'checklist',
        contenido: {
            titulo: 'Nuestros Acuerdos de Trabajo',
            descripcion: 'Para que este taller sea de máximo valor para todos, acordamos los siguientes compromisos. Marca cada uno para continuar.',
            items: [
                'Silencio y sin distractores durante los bloques de práctica',
                'Comparto mis experiencias reales: mis procesos, mis retos, mis ejemplos',
                'Cuando no entiendo algo, lo pregunto en el momento',
                'Al terminar el taller, aplico al menos un prompt en las próximas 72 horas',
            ],
            progreso_field: 'compromisos_encuadre',
        },
        created_at: '2025-03-01',
    },

    // ── E.5 Evaluación Diagnóstica
    {
        id: 'bia-02',
        curso_id: 'c-ia-estrategica',
        orden: 7,
        tipo: 'cuestionario',
        contenido: {
            titulo: 'Evaluación Diagnóstica — Punto de Partida',
            subtitulo: 'No hay respuestas correctas o incorrectas. Esta evaluación es solo para conocer tu punto de partida.',
            preguntas: [
                { id: 'diag-1', texto: '¿Qué es la Inteligencia Artificial para ti en este momento?', tipo: 'abierta', puntos: 0 },
                { id: 'diag-2', texto: '¿Has usado herramientas de IA (ChatGPT, Gemini, Copilot, etc.)? ¿Con qué frecuencia?', tipo: 'abierta', puntos: 0 },
                { id: 'diag-3', texto: '¿Qué diferencia encuentras entre buscar en Google y preguntar a ChatGPT?', tipo: 'abierta', puntos: 0 },
                { id: 'diag-4', texto: '¿Qué es un "prompt" para ti?', tipo: 'abierta', puntos: 0 },
                { id: 'diag-5', texto: 'Nombra al menos un proceso de tu trabajo que crees podría automatizarse con IA.', tipo: 'abierta', puntos: 0 },
            ],
        },
        created_at: '2025-03-01',
    },

    // ══ MÓDULO I ════════════════════════════════════════════════════════════════
    {
        id: 'bia-m1',
        curso_id: 'c-ia-estrategica',
        orden: 8,
        tipo: 'portada',
        inicio_pagina: true,
        contenido: {
            modulo_numero: 1,
            modulo_label: 'Módulo I',
            titulo: 'Fundamentos de la IA',
            subtitulo: 'De buscadores a motores de razonamiento · Tokens · Arquitectura MoE · Tus procesos',
            gradient_from: '#D4E5DF',
            gradient_to: '#7fb5a3',
            icon_color: '#2A4B7C',
        },
        created_at: '2025-03-01',
    },

    // ── M1.1 De Buscadores a Motores de Razonamiento
    {
        id: 'bia-03',
        curso_id: 'c-ia-estrategica',
        orden: 9,
        tipo: 'texto',
        contenido: {
            html: `
<h2>Lección 1.1: De Buscadores a Motores de Razonamiento</h2>
<p>Hasta hace pocos años, cuando necesitabas información, abrías Google y recibías una lista de sitios web donde <em>posiblemente</em> estaba la respuesta. Tú seguías siendo el analista: leías, filtrabas, comparabas y sintetizabas.</p>
<p>Los motores de razonamiento como ChatGPT, Gemini o Claude transforman esta dinámica por completo: ahora la IA procesa la información, redacta la respuesta, la adapta a tu contexto y te entrega un producto listo para usar.</p>

<h3>La diferencia fundamental</h3>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr style="background:#2A4B7C;color:white">
    <th style="padding:10px 14px;text-align:left">Buscador (Google)</th>
    <th style="padding:10px 14px;text-align:left">Motor de Razonamiento (ChatGPT / Claude)</th>
  </tr>
  <tr><td style="padding:10px;border:1px solid #eee">Te da una lista de links</td><td style="padding:10px;border:1px solid #eee">Te da una respuesta elaborada y contextualizada</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:10px;border:1px solid #eee">Tú buscas y filtras</td><td style="padding:10px;border:1px solid #eee">La IA procesa, sintetiza y genera por ti</td></tr>
  <tr><td style="padding:10px;border:1px solid #eee">Solo recupera lo que existe</td><td style="padding:10px;border:1px solid #eee">Razona, redacta, analiza y crea contenido nuevo</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:10px;border:1px solid #eee">Sin memoria del contexto</td><td style="padding:10px;border:1px solid #eee">Mantiene el contexto de toda la conversación</td></tr>
  <tr><td style="padding:10px;border:1px solid #eee">No crea documentos ni textos</td><td style="padding:10px;border:1px solid #eee">Genera textos, reportes, código, análisis, imágenes</td></tr>
</table>

<h3>¿Cómo funciona realmente la IA? — Los Tokens</h3>
<p>Los modelos de lenguaje como GPT-4 o Claude funcionan mediante <strong>predicción probabilística de tokens</strong>. Un token es aproximadamente ¾ de una palabra en español. La IA no "piensa" como un humano: analiza patrones en billones de textos para predecir cuál es la siguiente palabra más probable dado el contexto que tú le das.</p>
<div style="background:#E6E1F0;border-left:4px solid #6B5EA8;padding:12px 16px;border-radius:0 8px 8px 0;margin:12px 0">
  <strong>Implicación práctica:</strong> Cuanto más rico y específico sea tu prompt, más probable es que la IA active los patrones correctos y genere exactamente lo que necesitas. Un prompt pobre produce una respuesta promedio.
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M1.2 Comparador Buscador vs Motor IA
    {
        id: 'bia-comp',
        curso_id: 'c-ia-estrategica',
        orden: 10,
        tipo: 'comparador',
        contenido: {
            titulo: 'Actividad: Clasifica las Características',
            descripcion: 'Arrastra cada característica a la columna correcta: ¿pertenece a un Buscador tradicional o a un Motor de Razonamiento IA?',
            col_a_titulo: '🔍 Buscador Tradicional',
            col_b_titulo: '🤖 Motor de Razonamiento IA',
            caracteristicas: [
                'Indexa páginas web existentes',
                'Genera texto original',
                'Requiere verificar fuentes tú mismo',
                'Mantiene contexto de conversación',
                'Resultados ordenados por relevancia',
                'Puede equivocarse ("alucinaciones")',
                'Actualizado en tiempo real',
                'Aprende de los datos de entrenamiento',
            ],
            correctas_a: [0, 2, 4, 6],
            correctas_b: [1, 3, 5, 7],
        },
        created_at: '2025-03-01',
    },

    // ── M1.3 Simulador de Tokens ⭐ NUEVO
    {
        id: 'bia-m12',
        curso_id: 'c-ia-estrategica',
        orden: 11,
        tipo: 'simulador',
        contenido: {
            titulo: 'Simulador de Tokens',
            instrucciones: 'Escribe cualquier texto y observa cómo la IA lo divide en tokens. Los tokens son las unidades básicas que procesa el modelo.',
            altura_px: 310,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#F9F9F7;padding:16px}
h3{color:#2A4B7C;font-size:15px;margin-bottom:4px}
.sub{color:#888;font-size:12px;margin-bottom:10px}
textarea{width:100%;padding:10px;border:2px solid #ddd;border-radius:10px;font-size:13px;resize:none;transition:border-color .3s}
textarea:focus{outline:none;border-color:#2A4B7C}
.tokens{margin-top:10px;display:flex;flex-wrap:wrap;gap:4px;min-height:36px}
.tok{padding:3px 8px;border-radius:6px;font-size:13px;font-family:monospace}
.stats{margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}
.stat{background:white;border:1px solid #eee;border-radius:8px;padding:6px 12px;font-size:12px}
.stat strong{color:#2A4B7C}
.note{margin-top:8px;font-size:11px;color:#aaa}
</style></head><body>
<h3>Simulador de Tokens</h3>
<p class="sub">Escribe texto y observa como la IA lo divide en tokens para procesarlo</p>
<textarea id="inp" rows="3" placeholder="Escribe aqui tu texto en espanol..." oninput="tokenize(this.value)"></textarea>
<div class="tokens" id="tb"></div>
<div class="stats" id="st"></div>
<p class="note" id="nt"></p>
<script>
var COLS=['#FDEBD0','#D4E5DF','#E6E1F0','#FFF0D0','#D0E8FF','#FFD0D0','#D0FFD8'];
function tokenize(v){
  var tb=document.getElementById('tb'),st=document.getElementById('st'),nt=document.getElementById('nt');
  if(!v.trim()){tb.innerHTML='';st.innerHTML='';nt.textContent='';return;}
  var toks=[],i=0;
  while(i<v.length){
    if(v[i]===' '||v[i]==='\n'){toks.push({t:v[i],sp:true,g:-1});i++;}
    else{
      var end=i;
      while(end<v.length&&v[end]!==' '&&v[end]!=='\n')end++;
      var word=v.slice(i,end),n=Math.max(1,Math.ceil(word.length/4));
      for(var t=0;t<n;t++){
        var s=i+t*4,f=Math.min(i+(t+1)*4,end);
        toks.push({t:v.slice(s,f),sp:false,g:i});
      }
      i=end;
    }
  }
  var real=toks.filter(function(t){return!t.sp;});
  var groups=[...new Set(real.map(function(t){return t.g;}))];
  tb.innerHTML=toks.map(function(t){
    if(t.sp)return '<span style="width:5px;display:inline-block"></span>';
    var ci=groups.indexOf(t.g)%COLS.length;
    return '<span class="tok" style="background:'+COLS[ci]+'">'+t.t.replace(/</g,'&lt;')+'</span>';
  }).join('');
  var tc=real.length,cc=v.length,cost=(tc/1000000*3).toFixed(6);
  st.innerHTML='<div class="stat"><strong>'+tc+'</strong> tokens</div><div class="stat"><strong>'+cc+'</strong> caracteres</div><div class="stat">~<strong>$'+cost+'</strong> USD</div>';
  nt.textContent='En espanol, 1 token = 3-4 caracteres aprox. Costo estimado (gpt-4o: $3/M tokens de entrada).';
}
</script></body></html>`,
        },
        created_at: '2025-03-01',
    },

    // ── M1.4 Arquitectura MoE
    {
        id: 'bia-04',
        curso_id: 'c-ia-estrategica',
        orden: 12,
        tipo: 'texto',
        contenido: {
            html: `
<h2>Lección 1.2: La Arquitectura MoE — Por qué el ROL importa</h2>
<p>Los modelos modernos de IA utilizan una arquitectura llamada <strong>Mixture of Experts</strong> (MoE — Mezcla de Expertos). En lugar de usar todos sus parámetros para cada consulta, el modelo activa solo los "expertos" más relevantes para la tarea específica.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0">
  <div style="background:#f0f7ff;border:1px solid #2A4B7C20;border-radius:8px;padding:14px">
    <p style="font-weight:600;color:#2A4B7C;margin-bottom:6px">Sin ROL definido</p>
    <p style="font-size:13px;color:#555">Prompt genérico → activa nodos generales → respuesta promedio</p>
  </div>
  <div style="background:#f0fff4;border:1px solid #22c55e20;border-radius:8px;padding:14px">
    <p style="font-weight:600;color:#166534;margin-bottom:6px">Con ROL específico</p>
    <p style="font-size:13px;color:#555">Rol profesional → activa nodos especializados → respuesta de experto</p>
  </div>
</div>

<p>Cuando le asignas un ROL específico ("Actúa como un contador público con 15 años de experiencia en PYMES"), activas los nodos especializados del modelo entrenados con ese tipo de contenido. No es solo retórica: mejora directamente la calidad y precisión.</p>

<div style="background:#FFF3E0;border-left:4px solid #E07A5F;padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0">
  <strong>Dato clave:</strong> GPT-4 activa aproximadamente 8 expertos de 16 disponibles en cada respuesta. Asignar un rol bien definido es como contratar al especialista correcto en lugar de preguntarle a un generalista.
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M1.5 Simulador MoE Radial ⭐ NUEVO
    {
        id: 'bia-m13',
        curso_id: 'c-ia-estrategica',
        orden: 13,
        tipo: 'simulador',
        contenido: {
            titulo: 'Simulador MoE — ¿Qué experto activa tu ROL?',
            instrucciones: 'Escribe un ROL en el campo y observa qué experto se activa en el diagrama. La arquitectura MoE elige al especialista más adecuado para tu tarea.',
            altura_px: 420,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#F9F9F7;padding:16px}
h3{color:#2A4B7C;font-size:14px;text-align:center;margin-bottom:3px}
.sub{color:#888;font-size:12px;text-align:center;margin-bottom:12px}
.dg{position:relative;width:280px;height:280px;margin:0 auto 14px}
.center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:68px;border-radius:50%;background:#2A4B7C;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;z-index:5;text-align:center;line-height:1.3;box-shadow:0 4px 12px rgba(42,75,124,.35)}
.node{position:absolute;width:60px;height:60px;border-radius:50%;background:#e8e8e8;border:2px solid transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#888;transition:all .4s}
.node .ico{font-size:16px;margin-bottom:1px}
.node.active{background:white;transform:scale(1.18);box-shadow:0 6px 16px rgba(0,0,0,.15)}
.line{position:absolute;height:2px;background:#ddd;transform-origin:left center;top:50%;left:50%;transition:background .4s}
.line.active{background:#2A4B7C}
input{width:100%;padding:9px 13px;border:2px solid #ddd;border-radius:10px;font-size:13px;transition:border-color .3s}
input:focus{outline:none;border-color:#2A4B7C}
.msg{margin-top:9px;padding:9px 13px;border-radius:10px;font-size:12px;min-height:34px;background:#EBF3FB;color:#2A4B7C;display:none}
.msg.show{display:block}
</style></head><body>
<h3>Simulador: Arquitectura Mezcla de Expertos (MoE)</h3>
<p class="sub">Escribe un ROL y observa cual experto se activa</p>
<div class="dg" id="dg"><div class="center">TU<br>PROMPT</div></div>
<input id="inp" placeholder="Ej: Actua como un contador publico..." oninput="check(this.value)">
<div class="msg" id="msg"></div>
<script>
var experts=[
  {id:'legal',label:'Legal',ico:'&#127963;',color:'#6B5EA8',keys:['abogad','legal','jurid','derecho','fiscal','notari','compliance','contrat'],msg:'Activando expertos de Derecho y Cumplimiento Legal',angle:90},
  {id:'fin',label:'Finanzas',ico:'&#128176;',color:'#15803d',keys:['contad','financ','contabl','presupuest','inver','tesor','activo','pasivo'],msg:'Activando expertos de Finanzas y Contabilidad',angle:162},
  {id:'mkt',label:'Marketing',ico:'&#128226;',color:'#E07A5F',keys:['marketin','venta','publicid','brandin','digital','copywrit','comunic'],msg:'Activando expertos de Marketing y Comunicacion',angle:234},
  {id:'tech',label:'Tecnico',ico:'&#9881;',color:'#0891B2',keys:['programad','tecnic','ingenier','sistem','softwar','developer','codigo','datos'],msg:'Activando expertos de Tecnologia e Ingenieria',angle:306},
  {id:'rrhh',label:'RRHH',ico:'&#128101;',color:'#D97706',keys:['psicolog','rrhh','recursos human','talent','reclut','personal','coach','capacit'],msg:'Activando expertos de Recursos Humanos',angle:18}
];
var R=100,cx=140,cy=140,dg=document.getElementById('dg');
experts.forEach(function(e){
  var rad=e.angle*Math.PI/180;
  var x=cx+R*Math.cos(rad)-30,y=cy+R*Math.sin(rad)-30;
  var dx=R*Math.cos(rad),dy=R*Math.sin(rad);
  var len=Math.sqrt(dx*dx+dy*dy)-34;
  var line=document.createElement('div');
  line.className='line';line.id='l_'+e.id;
  line.style.cssText='width:'+len+'px;left:'+cx+'px;top:'+cy+'px;transform:rotate('+e.angle+'deg)';
  dg.appendChild(line);
  var node=document.createElement('div');
  node.className='node';node.id='n_'+e.id;
  node.style.left=x+'px';node.style.top=y+'px';
  node.innerHTML='<span class="ico">'+e.ico+'</span>'+e.label;
  dg.appendChild(node);
});
function check(val){
  var v=val.toLowerCase(),found=null;
  experts.forEach(function(e){
    var hit=e.keys.some(function(k){return v.includes(k);});
    document.getElementById('n_'+e.id).classList.toggle('active',hit);
    document.getElementById('n_'+e.id).style.color=hit?e.color:'#888';
    document.getElementById('l_'+e.id).classList.toggle('active',hit);
    if(hit)found=e;
  });
  var msg=document.getElementById('msg');
  if(found){msg.textContent='✓ '+found.msg;msg.className='msg show';}
  else if(v.length>5){msg.textContent='Escribe un rol mas especifico con profesion o especialidad';msg.className='msg show';}
  else{msg.className='msg';}
}
</script></body></html>`,
        },
        created_at: '2025-03-01',
    },

    // ── M1.6 Tarjetas Flip: Los 3 Modos de Uso
    {
        id: 'bia-flip1',
        curso_id: 'c-ia-estrategica',
        orden: 14,
        tipo: 'tarjetas_flip',
        contenido: {
            titulo: 'Los 3 Modos de Uso de la IA',
            instrucciones: 'Haz clic en cada tarjeta para descubrir cómo usarla en la práctica.',
            tarjetas: [
                {
                    frente: '💬\nModo 1\nConsulta',
                    reverso: 'Haces preguntas y recibes respuestas. Es el uso más común pero el menos poderoso. Equivale a tener un asistente que responde preguntas.',
                    color: '#D4E5DF',
                },
                {
                    frente: '🔧\nModo 2\nHerramienta',
                    reverso: 'Le das una tarea específica con datos concretos. Redacta este correo, analiza esta tabla, resume este documento. Aquí empieza la productividad real.',
                    color: '#E6E1F0',
                },
                {
                    frente: '🤝\nModo 3\nColaboración',
                    reverso: 'Trabajas con la IA como co-creador. Le asignas un ROL, estableces un contexto persistente y construyen juntos soluciones complejas. El nivel de este curso.',
                    color: '#FDEBD0',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── M1.7 Checklist Criterios de Automatización ⭐ NUEVO
    {
        id: 'bia-m15',
        curso_id: 'c-ia-estrategica',
        orden: 15,
        tipo: 'checklist',
        contenido: {
            titulo: 'M1.5 ¿Es automatizable con IA?',
            descripcion: 'Antes de agregar un proceso a tu Bitácora, verifica que cumple con estos 4 criterios. Marca los que aplican a tu proceso candidato.',
            items: [
                'El proceso se repite al menos 2 veces por semana (frecuencia suficiente para justificar el esfuerzo del prompt)',
                'El proceso produce un output textual: correo, reporte, análisis, cotización, resumen, transcripción...',
                'El proceso consume más de 30 minutos en total por semana (impacto medible en productividad)',
                'Tengo acceso a los datos que necesita la IA: información del cliente, plantillas, bases de conocimiento',
            ],
            progreso_field: 'auditoria_etica',
        },
        created_at: '2025-03-01',
    },

    // ── M1.8 Bitácora de Procesos
    {
        id: 'bia-08',
        curso_id: 'c-ia-estrategica',
        orden: 16,
        tipo: 'tabla_editable',
        contenido: {
            titulo: 'Bitácora de Procesos — Mis Puntos de Dolor',
            descripcion: 'Identifica los procesos de tu trabajo que consumen más tiempo y podrían beneficiarse de la IA. Sé específico: este análisis alimentará tu Prompt Maestro.',
            columnas: ['Proceso / Tarea', 'Tiempo por semana', '¿Se repite?', 'Candidato IA'],
            filas_default: [
                { proceso: '', tiempo_semana: '', se_repite: true, candidato_ia: 'Alto' },
                { proceso: '', tiempo_semana: '', se_repite: true, candidato_ia: 'Medio' },
                { proceso: '', tiempo_semana: '', se_repite: false, candidato_ia: 'Bajo' },
            ],
            progreso_field: 'bitacora',
            ayuda: 'Ejemplos: "Redactar reportes semanales", "Responder correos de cotización", "Analizar datos de ventas"',
        },
        created_at: '2025-03-01',
    },

    // ══ MÓDULO II ═══════════════════════════════════════════════════════════════
    {
        id: 'bia-m2',
        curso_id: 'c-ia-estrategica',
        orden: 17,
        tipo: 'portada',
        inicio_pagina: true,
        contenido: {
            modulo_numero: 2,
            modulo_label: 'Módulo II',
            titulo: 'La Estructura Maestra del Prompt',
            subtitulo: 'RO · CO · IN · RE · FO — Cinco componentes para prompts que funcionan',
            gradient_from: '#E07A5F',
            gradient_to: '#c4604a',
            icon_color: '#F9F9F7',
        },
        created_at: '2025-03-01',
    },

    // ── M2.1 Infografía 5 Componentes
    {
        id: 'bia-inf2',
        curso_id: 'c-ia-estrategica',
        orden: 18,
        tipo: 'infografia',
        contenido: {
            titulo: 'La Estructura Maestra: RO·CO·IN·RE·FO',
            intro: 'Cinco componentes que transforman un prompt genérico en una instrucción precisa y reutilizable.',
            pilares: [
                {
                    titulo: 'RO — ROL · CO — CONTEXTO',
                    icono: '🎭',
                    color: 'cobalt',
                    descripcion: 'ROL: Define la identidad y experticia de la IA. Incluye: profesión + especialidad + años de experiencia. Activa la arquitectura MoE correcta.\n\nCONTEXTO: Tu mesa de trabajo. Toda la información relevante que la IA necesita. Empresa, industria, audiencia, datos clave. NUNCA incluyas datos personales reales.',
                },
                {
                    titulo: 'IN — INSTRUCCIÓN',
                    icono: '⚡',
                    color: 'orange',
                    badge: '★ NÚCLEO',
                    descripcion: 'El mandato central. Comienza SIEMPRE con un verbo de acción fuerte: Genera, Redacta, Analiza, Sintetiza, Diseña, Crea, Compara. Evita verbos pasivos o de ruego como "¿Podrías...?" o "Me gustaría que..."',
                },
                {
                    titulo: 'RE — RESTRICCIONES · FO — FORMATO',
                    icono: '📐',
                    color: 'lavender',
                    descripcion: 'RESTRICCIONES: Límites que definen lo que la IA NO debe hacer: longitud máxima, tono, idioma, información que no debe mencionar.\n\nFORMATO: Estructura de la salida: tabla, lista numerada, correo, JSON, Markdown. Un formato correcto hace que la respuesta sea usable directamente.',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── M2.2 Lección ROL
    {
        id: 'bia-06',
        curso_id: 'c-ia-estrategica',
        orden: 19,
        tipo: 'texto',
        contenido: {
            html: `
<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
  <span style="background:#2A4B7C;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">RO — ROL</span>
  <h2 style="margin:0;font-size:20px">El Poder del ROL en la Arquitectura MoE</h2>
</div>

<p>Recuerda: la IA activa <em>expertos especializados</em> dentro de su red neuronal. El ROL es la instrucción que le dice cuál experto encender.</p>

<h3>Anatomía de un ROL efectivo</h3>
<ul>
  <li><strong>Título profesional específico:</strong> No "experto en marketing" sino "Director de Marketing Digital"</li>
  <li><strong>Especialización:</strong> "especializado en PyMEs del sector retail en México"</li>
  <li><strong>Años de experiencia:</strong> "con 12 años de experiencia"</li>
  <li><strong>Contexto organizacional:</strong> "que trabaja con equipos de 3 a 10 personas"</li>
</ul>

<h3>Ejemplos</h3>
<div style="margin:12px 0;padding:12px;background:#f0f7ff;border-radius:8px;font-size:13px">
  <p style="color:#888;margin-bottom:4px">❌ ROL débil:</p>
  <p style="font-family:monospace">"Actúa como un asistente útil."</p>
</div>
<div style="margin:12px 0;padding:12px;background:#f0fff4;border-radius:8px;font-size:13px">
  <p style="color:#166534;margin-bottom:4px">✅ ROL fuerte:</p>
  <p style="font-family:monospace">"Actúa como un contador público certificado con 10 años de experiencia en asesoría fiscal para microempresas mexicanas, especializado en régimen simplificado de confianza (RESICO)."</p>
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.3 Campo libre: construir ROL
    {
        id: 'bia-17',
        curso_id: 'c-ia-estrategica',
        orden: 20,
        tipo: 'campo_libre',
        contenido: {
            titulo: 'Construye tu ROL',
            badge: 'RO',
            badge_color: 'cobalt',
            descripcion: 'Escribe el ROL que le asignarás a la IA para automatizar el proceso que identificaste en tu Bitácora. Incluye: profesión + especialidad + experiencia + contexto.',
            placeholder: 'Actúa como un [título profesional] con [N] años de experiencia en [especialidad], especializado en [sector/contexto]...',
            template: 'Actúa como un ',
            progreso_field: 'rol_construido',
            ayuda: 'Tip: Sé específico. "Director de Ventas con 8 años en distribuidoras de alimentos del norte de México" activa mejores respuestas que "vendedor".',
        },
        created_at: '2025-03-01',
    },

    // ── M2.4 Lección CONTEXTO
    {
        id: 'bia-07',
        curso_id: 'c-ia-estrategica',
        orden: 21,
        tipo: 'texto',
        contenido: {
            html: `
<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
  <span style="background:#15803d;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">CO — CONTEXTO</span>
  <h2 style="margin:0;font-size:20px">La Ventana de Contexto: Tu Mesa de Trabajo</h2>
</div>

<p>Imagina que contratas a un consultor de alto nivel. Si llegas sin información, sin datos, sin detalles de tu empresa, solo puede darte respuestas genéricas. El CONTEXTO es todo lo que pones sobre la mesa antes de pedir la solución.</p>

<h3>¿Qué incluir en el CONTEXTO?</h3>
<ul>
  <li>Nombre y giro de tu empresa o proyecto</li>
  <li>Tamaño del equipo / tipo de clientes / mercado</li>
  <li>El problema específico que quieres resolver</li>
  <li>Datos relevantes que necesita para operar (sin PII)</li>
  <li>Limitaciones o condiciones especiales</li>
</ul>

<div style="margin:16px 0;padding:14px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:0 8px 8px 0">
  <p style="margin:0;font-weight:600">⚠️ Advertencia de Seguridad — CRÍTICA</p>
  <p style="margin:6px 0 0">NUNCA incluyas en el contexto: nombres reales de clientes, correos, teléfonos, RFC, CURP, números de cuentas bancarias o cualquier dato personal identificable. Usa datos ficticios o anonimizados.</p>
</div>

<h3>El efecto de la ventana de contexto</h3>
<p>Los modelos modernos tienen ventanas enormes (128,000 a 2,000,000 tokens). Esto significa que puedes compartir documentos completos, historiales de ventas o bases de conocimiento como contexto, y la IA los procesa íntegramente.</p>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.5 Campo libre: construir CONTEXTO
    {
        id: 'bia-18',
        curso_id: 'c-ia-estrategica',
        orden: 22,
        tipo: 'campo_libre',
        contenido: {
            titulo: 'Construye tu CONTEXTO',
            badge: 'CO',
            badge_color: 'green',
            descripcion: 'Escribe el CONTEXTO de tu proceso. Describe tu empresa, el tipo de clientes, el problema específico. Usa datos ficticios si es necesario.',
            placeholder: 'Mi empresa se llama [nombre ficticio], somos una [tipo de negocio] con [N] empleados. Nuestros clientes son [descripción]. El proceso que queremos mejorar es [descripción del proceso]...',
            template: '',
            progreso_field: 'contexto_construido',
            ayuda: 'Recuerda: más contexto = mejores respuestas. No seas tímido en los detalles. Solo anonimiza datos personales.',
        },
        created_at: '2025-03-01',
    },

    // ── M2.6 Lección INSTRUCCIÓN + FORMATO + RESTRICCIONES
    {
        id: 'bia-08r',
        curso_id: 'c-ia-estrategica',
        orden: 23,
        tipo: 'texto',
        contenido: {
            html: `
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
  <span style="background:#E07A5F;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">IN — INSTRUCCIÓN</span>
  <span style="background:#dc2626;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">RE — RESTRICCIONES</span>
  <span style="background:#6B5EA8;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">FO — FORMATO</span>
</div>

<h2>La Instrucción: el Corazón del Prompt</h2>
<p>La INSTRUCCIÓN es el mandato central. El error más común es usar lenguaje pasivo o de ruego.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0">
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px">
    <p style="color:#dc2626;font-weight:600;font-size:13px;margin-bottom:6px">❌ Instrucción débil</p>
    <p style="font-size:13px;font-family:monospace">¿Podrías ayudarme a hacer un reporte?<br/>Me gustaría que redactaras...</p>
  </div>
  <div style="background:#f0fff4;border:1px solid #bbf7d0;border-radius:8px;padding:12px">
    <p style="color:#166534;font-weight:600;font-size:13px;margin-bottom:6px">✅ Instrucción fuerte</p>
    <p style="font-size:13px;font-family:monospace">Genera un reporte ejecutivo...<br/>Redacta una respuesta profesional...<br/>Analiza los datos y sintetiza...</p>
  </div>
</div>

<h2>Restricciones: Límites que Mejoran la Calidad</h2>
<ul>
  <li><strong>Longitud:</strong> "No excedas 150 palabras" / "Responde en máximo 3 párrafos"</li>
  <li><strong>Tono:</strong> "Usa un tono formal y objetivo" / "Lenguaje accesible para no expertos"</li>
  <li><strong>Exclusiones:</strong> "No menciones precios" / "Evita tecnicismos"</li>
  <li><strong>Idioma:</strong> "Responde en español formal de México"</li>
</ul>

<h2>Formato: Define la Estructura de Salida</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0">
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">📋<br/><strong>Lista</strong><br/>numerada o bullets</div>
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">📊<br/><strong>Tabla</strong><br/>comparativa</div>
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">📝<br/><strong>Markdown</strong><br/>encabezados y negrita</div>
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">💌<br/><strong>Correo</strong><br/>con asunto y firma</div>
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">{ }<br/><strong>JSON</strong><br/>para sistemas</div>
  <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:10px;text-align:center;font-size:13px">📄<br/><strong>Texto libre</strong><br/>párrafos narrativos</div>
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.7 Simulador Validador de Instrucción ⭐ NUEVO
    {
        id: 'bia-m24',
        curso_id: 'c-ia-estrategica',
        orden: 24,
        tipo: 'simulador',
        contenido: {
            titulo: 'Validador de Instrucción Proactiva',
            instrucciones: 'Escribe tu INSTRUCCIÓN y el validador detectará si comienza con un verbo de acción fuerte o si usa lenguaje débil.',
            altura_px: 380,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#F9F9F7;padding:16px}
h3{color:#E07A5F;font-size:15px;margin-bottom:4px}
.sub{color:#888;font-size:12px;margin-bottom:12px}
textarea{width:100%;padding:10px;border:2px solid #ddd;border-radius:10px;font-size:14px;resize:none;transition:border-color .3s}
textarea:focus{outline:none;border-color:#E07A5F}
.result{margin-top:12px;padding:12px 14px;border-radius:12px;font-size:13px;display:none}
.result.ok{background:#f0fff4;border:1px solid #86efac;color:#166534;display:block}
.result.bad{background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;display:block}
.result.warn{background:#fffbeb;border:1px solid #fde68a;color:#92400e;display:block}
.verbos{margin-top:14px}
.verbos p{font-size:12px;color:#888;margin-bottom:6px}
.chips{display:flex;flex-wrap:wrap;gap:5px}
.chip{padding:3px 10px;background:#E07A5F;color:white;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;transition:opacity .2s}
.chip:hover{opacity:.8}
</style></head><body>
<h3>Validador de Instruccion Proactiva</h3>
<p class="sub">Escribe tu INSTRUCCION y verifica si comienza con un verbo de accion fuerte</p>
<textarea id="inp" rows="3" placeholder="Redacta un correo profesional para..." oninput="validate(this.value)"></textarea>
<div class="result" id="res"></div>
<div class="verbos">
  <p>Haz clic en un verbo para insertarlo:</p>
  <div class="chips" id="chips"></div>
</div>
<script>
var strong=['Redacta','Analiza','Genera','Diseña','Compara','Clasifica','Resume','Traduce','Crea','Desarrolla','Elabora','Sintetiza','Evalua','Identifica','Estructura','Optimiza','Investiga','Describe','Explica','Propone','Escribe','Construye','Organiza','Presenta','Calcula','Transforma'];
var weak=['puedes','podrias','me gustaria','quiero que','quisiera','ayudame','necesito','dime','dame'];
var inp=document.getElementById('inp'),chips=document.getElementById('chips');
chips.innerHTML=strong.map(function(v){return '<span class="chip" onclick="insert(\''+v+'\')">' +v+'</span>';}).join('');
function insert(v){inp.value=v+' ';inp.focus();validate(inp.value);}
function validate(val){
  var res=document.getElementById('res');
  if(!val.trim()){res.className='result';return;}
  var low=val.toLowerCase().trim();
  var isStrong=strong.some(function(v){return low.startsWith(v.toLowerCase());});
  var isWeak=weak.some(function(w){return low.startsWith(w)||low.includes(w.toLowerCase()+'?');});
  if(isStrong){
    var matched=strong.find(function(v){return low.startsWith(v.toLowerCase());});
    res.className='result ok';
    res.innerHTML='Instruccion proactiva confirmada. Comienzas con el verbo <strong>"'+matched+'"</strong>. La IA entendera exactamente que hacer y generara mejores resultados.';
  }else if(isWeak){
    res.className='result bad';
    res.innerHTML='Instruccion pasiva detectada. Evita frases de ruego. Cambia por: <em>"Redacta..." / "Genera..." / "Analiza..."</em> para obtener resultados mas precisos.';
  }else if(val.length>8){
    res.className='result warn';
    res.innerHTML='La instruccion no inicia con un verbo reconocido. Prueba comenzar con uno de los verbos de arriba para mayor claridad y precision.';
  }else{res.className='result';}
}
</script></body></html>`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.8 Demo Prompt Color-Coded ⭐ NUEVO
    {
        id: 'bia-m27',
        curso_id: 'c-ia-estrategica',
        orden: 25,
        tipo: 'simulador',
        contenido: {
            titulo: 'Demo: Prompt Maestro Completo en Acción',
            instrucciones: 'Observa cómo los 5 componentes RO·CO·IN·RE·FO se combinan en un prompt real. Haz clic en "Ver resultado" para ver la respuesta generada.',
            altura_px: 510,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#F9F9F7;padding:14px;font-size:13px}
h3{color:#333;font-size:14px;margin-bottom:10px}
.sec{border-radius:10px;overflow:hidden;margin-bottom:7px}
.sh{padding:5px 12px;display:flex;align-items:center;gap:7px}
.badge{color:white;font-weight:700;font-size:11px;padding:2px 9px;border-radius:20px;background:rgba(255,255,255,.2)}
.stitle{font-size:11px;opacity:.8}
.sc{padding:8px 12px;font-size:12px;line-height:1.55;font-family:monospace}
.btn{margin-top:9px;width:100%;padding:10px;background:#2A4B7C;color:white;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s}
.btn:hover{background:#1a3456}
.resp{margin-top:11px;border:1px solid #ddd;border-radius:10px;padding:12px;background:white;display:none}
.resp.show{display:block}
.rt{font-size:11px;color:#888;margin-bottom:7px;text-transform:uppercase;letter-spacing:.05em}
.rb{font-size:12px;line-height:1.65;color:#333}
table{width:100%;border-collapse:collapse;font-size:11px;margin:7px 0}
td,th{padding:4px 7px;border:1px solid #eee}
th{background:#2A4B7C;color:white}
</style></head><body>
<h3>Caso: Cotizacion de Servicio CNC — Prompt Maestro Completo</h3>
<div class="sec">
  <div class="sh" style="background:#2A4B7C"><span class="badge">RO</span><span class="stitle" style="color:white">ROL — Identidad del experto</span></div>
  <div class="sc" style="background:#EBF3FB;color:#1a3456">Actua como Directora Comercial con 12 anos en manufactura industrial mexicana, especializada en cotizaciones de servicios de maquinado CNC para el sector automotriz.</div>
</div>
<div class="sec">
  <div class="sh" style="background:#15803d"><span class="badge">CO</span><span class="stitle" style="color:white">CONTEXTO — Situacion y datos</span></div>
  <div class="sc" style="background:#f0fff4;color:#166534">Cliente: Proveedor Tier-2, Parque Ind. Silao Gto. Solicita 500 piezas Al6061, tolerancias +-0.01mm, plazo 3 semanas. Empresa: Taller Maquinados Precision SA.</div>
</div>
<div class="sec">
  <div class="sh" style="background:#E07A5F"><span class="badge">IN</span><span class="stitle" style="color:white">INSTRUCCION</span></div>
  <div class="sc" style="background:#FFF5F0;color:#7a3020">Redacta un correo de cotizacion con desglose de costos (materia prima, tiempo maquina, mano de obra, utilidad 22%) y propuesta de valor diferenciadora.</div>
</div>
<div class="sec">
  <div class="sh" style="background:#dc2626"><span class="badge">RE</span><span class="stitle" style="color:white">RESTRICCIONES</span></div>
  <div class="sc" style="background:#fef2f2;color:#991b1b">Max. 200 palabras. Tono profesional pero cercano. Sin mencionar precios de competidores. Espanol formal de negocios.</div>
</div>
<div class="sec">
  <div class="sh" style="background:#6B5EA8"><span class="badge">FO</span><span class="stitle" style="color:white">FORMATO</span></div>
  <div class="sc" style="background:#F5F0FF;color:#3d2d8a">Correo con: Asunto, Saludo, 3 parrafos, tabla de desglose de costos, firma profesional.</div>
</div>
<button class="btn" id="btn" onclick="reveal()">Ver resultado de la IA</button>
<div class="resp" id="resp">
  <div class="rt">Respuesta generada por la IA</div>
  <div class="rb">
    <strong>Asunto:</strong> Cotizacion Maquinado CNC — 500 pzas Al6061 / Maq. Precision SA<br><br>
    Estimado equipo de compras, agradecemos su solicitud y confirmamos disponibilidad para atender su requerimiento en los tiempos indicados.<br><br>
    <table><tr><th>Concepto</th><th>Importe MXN</th></tr><tr><td>Materia prima Al6061 (520 pzas)</td><td>$18,200</td></tr><tr><td>Tiempo maquina (45 hrs)</td><td>$22,500</td></tr><tr><td>Mano de obra especializada</td><td>$9,000</td></tr><tr><td>Utilidad (22%)</td><td>$10,934</td></tr><tr><td><strong>TOTAL</strong></td><td><strong>$60,634</strong></td></tr></table>
    Nuestros diferenciales: certificacion ISO 9001, inspeccion CMM en cada lote, 0% retrabajo en el ultimo trimestre.<br><br>
    <strong>Lic. Ana Torres</strong> · Dir. Comercial · Maq. Precision SA · (477) 123-4567
  </div>
</div>
<script>function reveal(){document.getElementById('resp').classList.add('show');document.getElementById('btn').style.display='none';}</script>
</body></html>`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.9 Tarjetas Flip: Los 5 Componentes
    {
        id: 'bia-19',
        curso_id: 'c-ia-estrategica',
        orden: 26,
        tipo: 'tarjetas_flip',
        contenido: {
            titulo: 'Memoriza la Estructura RO·CO·IN·RE·FO',
            instrucciones: 'Haz clic en cada componente para ver la guía de construcción.',
            tarjetas: [
                {
                    frente: '🎭\nRO\nROL',
                    reverso: 'Profesión + Especialidad + Años + Contexto\n\nEj: "Actúa como diseñadora gráfica con 8 años en branding para empresas de alimentos"',
                    color: '#EBF3FB',
                },
                {
                    frente: '📋\nCO\nCONTEXTO',
                    reverso: 'Empresa + Clientes + Problema + Datos\n\n⚠️ Sin datos personales reales. Usa información anonimizada.',
                    color: '#F0FFF4',
                },
                {
                    frente: '⚡\nIN\nINSTRUCCIÓN',
                    reverso: 'Verbo fuerte + Objeto específico + Audiencia\n\nEj: "Redacta 3 opciones de copy para Instagram dirigido a mujeres 25-40 años"',
                    color: '#FFF5F0',
                },
                {
                    frente: '🚧\nRE\nRESTRICCIONES',
                    reverso: 'Máx. palabras / Tono / Exclusiones / Idioma\n\nEj: "No excedas 80 palabras. Tono cercano. Sin emojis. Español de México."',
                    color: '#FFF0F0',
                },
                {
                    frente: '📐\nFO\nFORMATO',
                    reverso: 'Lista / Tabla / Correo / Markdown / JSON\n\nEj: "Presenta como tabla de 3 columnas: Opción | Tono | Longitud"',
                    color: '#F5F0FF',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── M2.10 Simulador Prompt Maestro ⭐⭐
    {
        id: 'bia-20',
        curso_id: 'c-ia-estrategica',
        orden: 27,
        tipo: 'simulador_prompt',
        contenido: {
            titulo: 'Construye tu Prompt Maestro',
            instrucciones: 'Tu ROL y CONTEXTO ya han sido pre-cargados desde los bloques anteriores. Completa la INSTRUCCIÓN, RESTRICCIONES y FORMATO para ensamblar tu Prompt Maestro completo.',
            rubrica_sistema: `Eres un evaluador pedagógico del curso iAprende Nivel 1 "IA Estratégica y Diseño de Instrucciones".

Analiza el prompt del participante y evalúa si contiene los 5 componentes de la Estructura Maestra:
1. ROL: ¿Define claramente la identidad y especialidad de la IA? (título + especialidad + experiencia)
2. CONTEXTO: ¿Proporciona información relevante del negocio/situación? (sin datos personales)
3. INSTRUCCIÓN: ¿Comienza con un verbo de acción fuerte y específico?
4. RESTRICCIONES: ¿Define límites claros (longitud, tono, exclusiones)?
5. FORMATO: ¿Especifica la estructura de salida deseada?

Calificación: 1 punto por cada componente COMPLETO y ESPECÍFICO (0 = ausente o muy genérico, 1 = presente y específico).
Puntaje total: 0 a 5.

Retroalimentación: constructiva, en español, máximo 80 palabras. Menciona qué componente necesita más desarrollo.

Responde ÚNICAMENTE en JSON válido: {"score": number, "feedback": "string", "componentes": {"rol": bool, "contexto": bool, "instruccion": bool, "restricciones": bool, "formato": bool}}`,
        },
        created_at: '2025-03-01',
    },

    // ── M2.11 Evaluación Formativa (checklist)
    {
        id: 'bia-11',
        curso_id: 'c-ia-estrategica',
        orden: 28,
        tipo: 'checklist',
        contenido: {
            titulo: 'Autoevaluación Formativa — Mi Prompt Maestro',
            descripcion: 'Revisa tu Prompt Maestro y confirma que cumple con cada criterio. Esta lista vale el 50% de tu calificación.',
            items: [
                'Mi ROL incluye título profesional, especialidad y contexto específico',
                'Mi CONTEXTO describe el negocio/situación sin incluir datos personales reales',
                'Mi INSTRUCCIÓN comienza con un verbo de acción fuerte (Genera/Redacta/Analiza...)',
                'Mis RESTRICCIONES definen al menos límite de longitud y tono',
                'Mi FORMATO especifica cómo quiero recibir la respuesta',
                'El prompt completo es coherente y resolvería mi proceso de la Bitácora',
            ],
            progreso_field: 'auditoria_etica',
        },
        created_at: '2025-03-01',
    },

    // ══ MÓDULO III ══════════════════════════════════════════════════════════════
    {
        id: 'bia-m3',
        curso_id: 'c-ia-estrategica',
        orden: 29,
        tipo: 'portada',
        inicio_pagina: true,
        contenido: {
            modulo_numero: 3,
            modulo_label: 'Módulo III',
            titulo: 'Sesgos, Alucinaciones y Ética',
            subtitulo: 'Usa la IA con criterio, responsabilidad y filtro humano',
            gradient_from: '#E6E1F0',
            gradient_to: '#a89fc5',
            icon_color: '#2A4B7C',
        },
        created_at: '2025-03-01',
    },

    // ── M3.1 Alucinaciones
    {
        id: 'bia-12',
        curso_id: 'c-ia-estrategica',
        orden: 30,
        tipo: 'texto',
        contenido: {
            html: `
<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
  <span style="font-size:24px">🌀</span>
  <h2 style="margin:0">Lección 3.1: ¿Qué es una Alucinación en IA?</h2>
</div>

<p>Una "alucinación" ocurre cuando la IA genera información que parece completamente plausible y bien redactada, pero que es <strong>factualmente incorrecta o simplemente inventada</strong>. Sucede porque el modelo predice la siguiente palabra más <em>probable</em>, no la más <em>verdadera</em>.</p>

<h3>¿Por qué ocurre?</h3>
<ul>
  <li>El modelo no "sabe" la verdad: interpola patrones de su entrenamiento</li>
  <li>Cuando no tiene datos suficientes, "rellena" con lo que suena plausible</li>
  <li>Los datos numéricos, fechas, citas y estadísticas son los más propensos a alucinación</li>
</ul>

<div style="margin:16px 0;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px">
  <p style="font-weight:600;color:#dc2626;margin-bottom:8px">Ejemplo real de alucinación:</p>
  <p style="font-family:monospace;font-size:13px">Pregunta: "¿Cuánto cuesta un kilo de nopal en el mercado mayorista de México en abril 2025?"</p>
  <p style="font-family:monospace;font-size:13px;color:#dc2626">Respuesta IA: "El precio promedio es de $8.50 por kilo."</p>
  <p style="font-size:13px;color:#666;margin-top:8px">⚠️ Este dato es completamente inventado. El modelo no tiene acceso a precios en tiempo real.</p>
</div>

<h3>La solución: GROUNDING</h3>
<p>En lugar de pedirle a la IA que <em>invente</em> datos, proporciónale los datos tú mismo en el CONTEXTO y pídele que <em>analice</em> lo que le diste. Así conviertes una herramienta que "alucina" en una que "razona sobre tus datos reales".</p>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M3.2 Simulador Detective de Alucinaciones ⭐ NUEVO
    {
        id: 'bia-m31',
        curso_id: 'c-ia-estrategica',
        orden: 31,
        tipo: 'simulador',
        contenido: {
            titulo: 'Detective de Alucinaciones',
            instrucciones: 'En cada caso, identifica cuál de las tres afirmaciones es una alucinación generada por la IA. El resto son afirmaciones verificables.',
            altura_px: 560,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#F9F9F7;padding:14px}
h3{color:#333;font-size:14px;margin-bottom:3px}
.sub{color:#888;font-size:12px;margin-bottom:12px}
.score{background:#2A4B7C;color:white;display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;margin-bottom:11px}
.case{background:white;border:1px solid #ddd;border-radius:12px;padding:13px;margin-bottom:9px}
.ct{font-size:12px;font-weight:600;color:#2A4B7C;margin-bottom:7px}
.prompt{background:#F0F7FF;border-radius:8px;padding:7px 10px;font-size:11px;color:#1a3456;margin-bottom:7px;font-family:monospace}
.opts{display:flex;flex-direction:column;gap:5px}
.opt{padding:7px 12px;border:2px solid #ddd;border-radius:8px;font-size:12px;cursor:pointer;transition:all .2s;text-align:left;background:white}
.opt:hover{border-color:#2A4B7C;background:#EBF3FB}
.opt:disabled{cursor:default}
.opt.correct{border-color:#22c55e;background:#f0fff4;color:#166534}
.opt.wrong{border-color:#ef4444;background:#fef2f2;color:#991b1b}
.fb{margin-top:7px;font-size:12px;padding:7px;border-radius:8px;display:none}
.fb.show{display:block}
.win{text-align:center;padding:18px;background:linear-gradient(135deg,#2A4B7C,#1a3456);color:white;border-radius:14px;margin-top:9px;display:none}
.win.show{display:block}
.win h2{font-size:20px;margin-bottom:5px}
</style></head><body>
<h3>Detective de Alucinaciones</h3>
<p class="sub">Identifica cual afirmacion fue inventada por la IA en cada caso</p>
<div class="score">Puntaje: <span id="pts">0</span> / 3</div>
<div class="case" id="c0">
  <div class="ct">Caso 1: Estadisticas de adopcion de IA en Mexico</div>
  <div class="prompt">Pregunta: "Dame estadisticas sobre uso de IA en PyMEs mexicanas"</div>
  <div class="opts">
    <button class="opt" data-hall="false" onclick="answer(0,0)">A) ChatGPT fue lanzado al publico en noviembre de 2022.</button>
    <button class="opt" data-hall="true" onclick="answer(0,1)">B) El 67.3% de las PyMEs mexicanas ya utilizan IA generativa en sus operaciones diarias (2024).</button>
    <button class="opt" data-hall="false" onclick="answer(0,2)">C) La IA puede procesar texto en mas de 100 idiomas.</button>
  </div>
  <div class="fb" id="f0"></div>
</div>
<div class="case" id="c1">
  <div class="ct">Caso 2: Cita de autoridad</div>
  <div class="prompt">Pregunta: "Dame una cita de Einstein sobre inteligencia artificial"</div>
  <div class="opts">
    <button class="opt" data-hall="false" onclick="answer(1,0)">A) Einstein murio en 1955, antes de que existiera la IA moderna como la conocemos.</button>
    <button class="opt" data-hall="false" onclick="answer(1,1)">B) Un modelo bien entrenado puede advertirte que no tiene citas verificadas de Einstein sobre IA.</button>
    <button class="opt" data-hall="true" onclick="answer(1,2)">C) "La inteligencia artificial superara la creatividad humana para el 2030." — Albert Einstein, 1948.</button>
  </div>
  <div class="fb" id="f1"></div>
</div>
<div class="case" id="c2">
  <div class="ct">Caso 3: Datos legales y fiscales</div>
  <div class="prompt">Pregunta: "Cuanto cuesta tramitar el RFC en Mexico?"</div>
  <div class="opts">
    <button class="opt" data-hall="false" onclick="answer(2,0)">A) El RFC se tramita gratuitamente en el portal del SAT (sat.gob.mx).</button>
    <button class="opt" data-hall="true" onclick="answer(2,1)">B) Desde la reforma fiscal de 2025, el SAT cobra $245 pesos por la emision del RFC.</button>
    <button class="opt" data-hall="false" onclick="answer(2,2)">C) El RFC puede obtenerse en linea con tu CURP, sin costo adicional.</button>
  </div>
  <div class="fb" id="f2"></div>
</div>
<div class="win" id="win"><h2>Excelente Detective!</h2><p>Identificaste las 3 alucinaciones. Nunca confies en estadisticas, citas o datos legales generados por IA sin verificar en fuentes primarias.</p></div>
<script>
var done=0;
var fbs=['La IA invento ese porcentaje preciso. No existe medicion con ese nivel de detalle para PyMEs mexicanas.','Einstein murio en 1955. La IA genero una cita plausible pero completamente falsa con una fecha inventada.','El RFC es gratuito. La IA invento un costo y una reforma fiscal que no existen.'];
function answer(ci,oi){
  var c=document.getElementById('c'+ci);
  if(c.classList.contains('done'))return;
  c.classList.add('done');
  var btns=c.querySelectorAll('.opt');
  btns.forEach(function(b){b.disabled=true;});
  var correctBtn=c.querySelector('[data-hall="true"]');
  var correctIdx=Array.prototype.indexOf.call(btns,correctBtn);
  btns[correctIdx].classList.add('correct');
  if(oi!==correctIdx)btns[oi].classList.add('wrong');
  var f=document.getElementById('f'+ci);
  if(oi===correctIdx){
    f.innerHTML='Correcto. '+fbs[ci];
    f.style.background='#f0fff4';f.style.color='#166534';
    done++;document.getElementById('pts').textContent=done;
    if(done===3)setTimeout(function(){document.getElementById('win').classList.add('show');},400);
  }else{
    f.innerHTML='Esa afirmacion es real o razonable. Busca cual tiene datos inventados o citas imposibles.';
    f.style.background='#fef2f2';f.style.color='#991b1b';
  }
  f.classList.add('show');
}
</script></body></html>`,
        },
        created_at: '2025-03-01',
    },

    // ── M3.3 Mapa Ecosistema IA
    {
        id: 'bia-22',
        curso_id: 'c-ia-estrategica',
        orden: 32,
        tipo: 'mapa_ecosistema',
        contenido: {
            titulo: 'El Ecosistema de Herramientas IA',
            descripcion: 'Las herramientas de IA se agrupan por capacidad. Conocer el ecosistema te ayuda a elegir la herramienta correcta para cada tarea.',
            categorias: [
                {
                    nombre: 'Conversación y Texto',
                    color: '#2A4B7C',
                    herramientas: ['ChatGPT (OpenAI)', 'Claude (Anthropic)', 'Gemini (Google)', 'Llama (Meta)', 'Mistral'],
                },
                {
                    nombre: 'Imágenes y Diseño',
                    color: '#E07A5F',
                    herramientas: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Adobe Firefly', 'Canva AI'],
                },
                {
                    nombre: 'Productividad',
                    color: '#15803d',
                    herramientas: ['Microsoft Copilot', 'Google Workspace AI', 'Notion AI', 'Zapier AI', 'Make AI'],
                },
                {
                    nombre: 'Audio y Video',
                    color: '#7C3AED',
                    herramientas: ['ElevenLabs', 'Sora (OpenAI)', 'Runway', 'Descript', 'HeyGen'],
                },
                {
                    nombre: 'Código y Datos',
                    color: '#0891B2',
                    herramientas: ['GitHub Copilot', 'Cursor', 'Replit AI', 'Julius AI', 'ChatGPT Code'],
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── M3.4 Tipos de Sesgos
    {
        id: 'bia-13',
        curso_id: 'c-ia-estrategica',
        orden: 33,
        tipo: 'texto',
        contenido: {
            html: `
<h2>Lección 3.2: Tipos de Sesgos en los Modelos de IA</h2>
<p>Los sesgos son distorsiones sistemáticas en las respuestas de la IA que provienen de los datos de entrenamiento o de cómo formulamos nuestras instrucciones. Reconocerlos es el primer paso para mitigarlos.</p>

<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr style="background:#2A4B7C;color:white">
    <th style="padding:10px 14px;text-align:left">Tipo</th>
    <th style="padding:10px 14px;text-align:left">Descripción</th>
    <th style="padding:10px 14px;text-align:left">Cómo mitigarlo</th>
  </tr>
  <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Sesgo de Confirmación</td><td style="padding:10px;border:1px solid #eee">La IA te da la respuesta que "esperas" escuchar, validando tu postura en lugar de desafiarla</td><td style="padding:10px;border:1px solid #eee">Formula: "Dame argumentos A FAVOR y EN CONTRA de..."</td></tr>
  <tr style="background:#f9f9f7"><td style="padding:10px;border:1px solid #eee;font-weight:600">Alucinación Factual</td><td style="padding:10px;border:1px solid #eee">Inventa datos, citas, estadísticas o referencias bibliográficas que suenan reales</td><td style="padding:10px;border:1px solid #eee">Restringe: "Solo usa los datos que te proporciono en el contexto"</td></tr>
  <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Sesgo Implícito</td><td style="padding:10px;border:1px solid #eee">Reproduce estereotipos de género, cultura o nivel socioeconómico presentes en sus datos de entrenamiento</td><td style="padding:10px;border:1px solid #eee">Instrucción: "Evita generalizaciones culturales y estereotipos"</td></tr>
</table>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M3.5 Flip Sesgos
    {
        id: 'bia-flip3',
        curso_id: 'c-ia-estrategica',
        orden: 34,
        tipo: 'tarjetas_flip',
        contenido: {
            titulo: 'Identifica los Sesgos en la Práctica',
            instrucciones: 'Haz clic en cada sesgo para ver un ejemplo real y cómo corregirlo en tu prompt.',
            tarjetas: [
                {
                    frente: '✅\nSesgo de\nConfirmación',
                    reverso: 'Prompt: "¿Por qué mi producto es mejor que el de la competencia?"\n\nSolución: "Analiza objetivamente las fortalezas Y debilidades de mi producto comparado con [competidor], sin parcialidad."',
                    color: '#FFF5F0',
                },
                {
                    frente: '🌀\nAlucinación\nFactual',
                    reverso: 'La IA dice: "Según el informe INEGI 2024, el 67% de las PyMEs..."\n\nSolución: "Solo usa los datos del informe que te adjunto. No cites fuentes que no te proporcioné."',
                    color: '#F0F7FF',
                },
                {
                    frente: '👤\nSesgo\nImplícito',
                    reverso: 'La IA asume que el gerente es hombre, que el cliente es adulto urbano.\n\nSolución: "Escribe de forma inclusiva y neutra. No asumas género, edad ni nivel educativo."',
                    color: '#F5F0FF',
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── M3.6 El Filtro Humano
    {
        id: 'bia-14',
        curso_id: 'c-ia-estrategica',
        orden: 35,
        tipo: 'texto',
        contenido: {
            html: `
<h2>Lección 3.3: El Filtro Humano — Tu Responsabilidad Ética</h2>
<p>La IA es una herramienta de alto rendimiento, pero tú eres el <strong>responsable final</strong> de todo lo que produces con ella. Esto incluye verificar información, evitar daños y proteger la confidencialidad.</p>

<h3>Los 3 Principios del Uso Ético</h3>
<div style="display:grid;gap:12px;margin:16px 0">
  <div style="background:#f0fff4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start">
    <span style="font-size:24px">🔍</span>
    <div>
      <p style="font-weight:700;color:#166534;margin-bottom:4px">VERIFICAR</p>
      <p style="font-size:14px">Nunca publiques datos, estadísticas o citas generadas por IA sin verificarlos en fuentes primarias. La plausibilidad no es veracidad.</p>
    </div>
  </div>
  <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start">
    <span style="font-size:24px">🛡️</span>
    <div>
      <p style="font-weight:700;color:#92400e;margin-bottom:4px">PROTEGER</p>
      <p style="font-size:14px">Nunca incluyas datos personales reales de clientes o empleados (nombre, correo, teléfono, RFC, CURP) en un prompt enviado a servidores externos.</p>
    </div>
  </div>
  <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;display:flex;gap:12px;align-items:flex-start">
    <span style="font-size:24px">📢</span>
    <div>
      <p style="font-weight:700;color:#1e40af;margin-bottom:4px">TRANSPARAR</p>
      <p style="font-size:14px">En contextos académicos, profesionales o periodísticos: informa cuando el contenido fue generado o asistido por IA. La confianza se construye con honestidad.</p>
    </div>
  </div>
</div>
`,
        },
        created_at: '2025-03-01',
    },

    // ── M3.7 Checklist Filtro Humano — Compromisos Éticos ⭐ NUEVO
    {
        id: 'bia-m33',
        curso_id: 'c-ia-estrategica',
        orden: 36,
        tipo: 'checklist',
        contenido: {
            titulo: 'Mi Filtro Humano — 4 Compromisos Éticos',
            descripcion: 'Antes de continuar, confirma tu compromiso personal con el uso responsable de la IA. Estos 4 principios son tu filtro de calidad.',
            items: [
                '🔍 VERIFICAR: Comprobaré cualquier dato estadístico, cita o fecha generada por IA antes de presentarla como información real',
                '🛡️ PROTEGER: Nunca incluiré datos personales identificables de clientes o empleados en prompts enviados a servicios externos',
                '📢 TRANSPARAR: Indicaré activamente cuando un contenido fue generado o asistido por IA en contextos profesionales o académicos',
                '🧠 DECIDIR: Usaré la IA como amplificador de mi criterio, no como sustituto. La decisión final siempre recae en mí',
            ],
            progreso_field: 'compromisos_encuadre',
        },
        created_at: '2025-03-01',
    },

    // ── M3.8 Caso Ético Grupal
    {
        id: 'bia-24',
        curso_id: 'c-ia-estrategica',
        orden: 37,
        tipo: 'caso_etico',
        contenido: {
            titulo: 'Caso Ético: El Reporte que Nunca Existió',
            situacion: `Una directora de RRHH de una empresa mediana usa ChatGPT para elaborar el informe de desempeño semestral. Le pide a la IA que "cree datos estadísticos creíbles sobre rotación, productividad y satisfacción del equipo" porque "no tiene tiempo de recopilar la información real".

El informe resultante, lleno de gráficas y cifras coherentes, se presenta ante el Consejo de Administración y se usa para tomar decisiones sobre bonos y reestructuración del equipo.

Tres meses después, cuando un auditor externo pide las fuentes originales de los datos, la situación se revela.`,
            preguntas: [
                '¿Qué principios éticos se violaron en este caso? ¿Quién tiene responsabilidad y en qué medida?',
                '¿Cómo debería haber usado la IA esta directora para ahorrar tiempo SIN comprometer la veracidad del informe?',
                '¿Tu organización tiene (o debería tener) una política de uso ético de IA? ¿Qué incluirías en ella?',
            ],
        },
        created_at: '2025-03-01',
    },

    // ══ EVALUACIÓN SUMATIVA ═════════════════════════════════════════════════════
    {
        id: 'bia-s0',
        curso_id: 'c-ia-estrategica',
        orden: 38,
        tipo: 'portada',
        inicio_pagina: true,
        contenido: {
            modulo_numero: 4,
            modulo_label: 'Evaluación Final',
            titulo: 'Demuestra lo que Aprendiste',
            subtitulo: 'El Desafío del Asistente · Validación de Conceptos · Auto-Auditoría Ética',
            gradient_from: '#333333',
            gradient_to: '#555555',
            icon_color: '#E07A5F',
        },
        created_at: '2025-03-01',
    },

    // ── S.1 Desafío del Asistente ⭐ NUEVO
    {
        id: 'bia-s1',
        curso_id: 'c-ia-estrategica',
        orden: 39,
        tipo: 'simulador_prompt',
        contenido: {
            titulo: 'S.1 Desafío del Asistente — Evaluación Final',
            instrucciones: 'Diseña un prompt estratégico DESDE CERO para el siguiente desafío profesional. No pre-cargues tus datos anteriores — este es un reto nuevo. Aplica todo lo aprendido: RO·CO·IN·RE·FO.',
            rubrica_sistema: `Eres un evaluador del examen final del curso iAprende Nivel 1.

DESAFÍO para el participante: Diseñar un prompt para un asistente de seguimiento post-venta que automatice los correos de satisfacción para una empresa de servicios profesionales.

Evalúa el prompt del participante con criterio de examen final. Los 5 componentes deben ser:
1. ROL: ¿Perfil profesional específico para seguimiento de clientes? (ej: gerente de CX, consultor de retención)
2. CONTEXTO: ¿Describe tipo de empresa, clientes, producto/servicio? (sin datos reales)
3. INSTRUCCIÓN: ¿Verbo fuerte + tarea clara de seguimiento post-venta?
4. RESTRICCIONES: ¿Define al menos tono, longitud y exclusiones pertinentes?
5. FORMATO: ¿Especifica estructura del correo o tipo de output?

Puntaje: 1 punto por cada componente completo. Total: 0-5.
Calificación final: 5=Excelente (100%), 4=Muy bien (80%), 3=Suficiente (60%), 2-0=Necesita refuerzo.

Retroalimentación: máximo 100 palabras, menciona el componente más fuerte y el que más necesita mejorar.

Responde ÚNICAMENTE en JSON: {"score": number, "feedback": "string", "componentes": {"rol": bool, "contexto": bool, "instruccion": bool, "restricciones": bool, "formato": bool}}`,
        },
        created_at: '2025-03-01',
    },

    // ── S.2 Evaluación Final (cuestionario)
    {
        id: 'bia-15',
        curso_id: 'c-ia-estrategica',
        orden: 40,
        tipo: 'cuestionario',
        contenido: {
            titulo: 'Validación de Conceptos',
            subtitulo: 'Elige la respuesta correcta en cada pregunta.',
            preguntas: [
                {
                    id: 'final-2',
                    texto: '¿Por qué es importante asignar un ROL específico a la IA en tu prompt?',
                    tipo: 'opcion_multiple',
                    opciones: [
                        'Para que la IA sea más educada en sus respuestas.',
                        'Porque activa la arquitectura Mezcla de Expertos (MoE), mejorando la especialización de la respuesta.',
                        'No tiene ningún efecto real, es solo formalidad.',
                        'Para aumentar la longitud de la respuesta.',
                    ],
                    correcta: 1,
                    puntos: 25,
                },
                {
                    id: 'final-3',
                    texto: 'Tu IA generó un dato estadístico preciso que no puedes verificar en ninguna fuente. Esto se llama:',
                    tipo: 'opcion_multiple',
                    opciones: [
                        'Creatividad computacional.',
                        'Una "Alucinación": información plausible pero potencialmente falsa.',
                        'Un error de conexión a internet.',
                        'Una actualización del modelo.',
                    ],
                    correcta: 1,
                    puntos: 25,
                },
                {
                    id: 'final-4',
                    texto: '¿Cuál de las siguientes afirmaciones sobre el CONTEXTO en un prompt es CORRECTA?',
                    tipo: 'opcion_multiple',
                    opciones: [
                        'Incluir el nombre y RFC del cliente mejora la precisión de la respuesta.',
                        'El contexto debe ser lo más breve posible para ahorrar tokens.',
                        'Puedes incluir datos reales de tu empresa siempre que uses anonimización para datos personales de terceros.',
                        'El contexto no es necesario si el ROL es muy específico.',
                    ],
                    correcta: 2,
                    puntos: 25,
                },
                {
                    id: 'final-5',
                    texto: '¿Quién es el responsable final de la veracidad y consecuencias del contenido generado con IA?',
                    tipo: 'opcion_multiple',
                    opciones: [
                        'La empresa creadora del modelo de IA (OpenAI, Google, Anthropic).',
                        'La computadora o dispositivo donde se ejecuta la IA.',
                        'El usuario que actúa como "filtro humano" — tú.',
                        'El gobierno, a través de las regulaciones de IA.',
                    ],
                    correcta: 2,
                    puntos: 25,
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── S.3 Auto-Auditoría Ética
    {
        id: 'bia-26',
        curso_id: 'c-ia-estrategica',
        orden: 41,
        tipo: 'checklist',
        contenido: {
            titulo: 'Auto-Auditoría Ética — Mi Compromiso',
            descripcion: 'Antes de cerrar el taller, confirma tu compromiso personal con el uso responsable de la IA.',
            items: [
                'Verificaré los datos estadísticos generados por IA antes de publicarlos o presentarlos',
                'No incluiré datos personales reales de clientes o empleados en mis prompts',
                'Informaré cuando el contenido de una presentación o documento haya sido asistido por IA',
                'Usaré la IA como amplificador de mi criterio, no como sustituto de mi responsabilidad',
                'Compartiré este conocimiento con al menos una persona de mi equipo esta semana',
            ],
            progreso_field: 'compromisos_72h',
        },
        created_at: '2025-03-01',
    },

    // ═══ CIERRE ═════════════════════════════════════════════════════════════════

    // ── C.1 Resumen Personal
    {
        id: 'bia-30',
        curso_id: 'c-ia-estrategica',
        orden: 42,
        tipo: 'resumen_personal',
        contenido: {
            titulo: 'Lo Que Te Llevas Hoy',
            descripcion: 'Un resumen de tu trabajo en este taller. Este es tu activo de aprendizaje.',
        },
        created_at: '2025-03-01',
    },

    // ── C.2 Mapa Ecosistema iAprende (cierre)
    {
        id: 'bia-mapa2',
        curso_id: 'c-ia-estrategica',
        orden: 43,
        tipo: 'mapa_ecosistema',
        contenido: {
            titulo: 'Tu Ruta de Continuidad en iAprende',
            descripcion: 'El aprendizaje no termina aquí. Estos son los próximos pasos del ecosistema iAprende.',
            categorias: [
                {
                    nombre: 'Nivel 1 — Este Curso ✓',
                    color: '#22c55e',
                    herramientas: ['IA Estratégica y Diseño de Instrucciones', 'Estructura Maestra RO·CO·IN·RE·FO', 'Ética y filtro humano'],
                },
                {
                    nombre: 'Nivel 2 — Próximamente',
                    color: '#2A4B7C',
                    herramientas: ['Automatización de Flujos con IA', 'Agentes y herramientas conectadas', 'RAG: IA sobre tus documentos'],
                },
                {
                    nombre: 'Comunidad iAprende',
                    color: '#E07A5F',
                    herramientas: ['Grupo WhatsApp de práctica', 'Biblioteca de prompts', 'Sesiones de seguimiento'],
                },
            ],
        },
        created_at: '2025-03-01',
    },

    // ── C.3 Compromisos 72h
    {
        id: 'bia-35',
        curso_id: 'c-ia-estrategica',
        orden: 44,
        tipo: 'checklist',
        contenido: {
            titulo: 'Mis Compromisos de las Próximas 72 Horas',
            descripcion: 'El aprendizaje se consolida en la acción. Compromete las siguientes acciones para las próximas 72 horas.',
            items: [
                'Aplicar mi Prompt Maestro en al menos un proceso real de trabajo',
                'Mejorar el prompt basándome en los resultados que obtenga',
                'Compartir el aprendizaje con un colega o familiar',
            ],
            progreso_field: 'compromisos_72h',
        },
        created_at: '2025-03-01',
    },

    // ── C.4 Cierre
    {
        id: 'bia-16',
        curso_id: 'c-ia-estrategica',
        orden: 45,
        tipo: 'texto',
        contenido: {
            html: `
<div style="text-align:center;padding:20px 0">
  <div style="font-size:48px;margin-bottom:12px">🎓</div>
  <h1 style="font-size:26px;color:#2A4B7C">¡Felicidades!</h1>
  <p style="color:#666;margin-top:8px;font-size:16px">Has completado el curso <strong>IA Estratégica y Diseño de Instrucciones Proactivas</strong></p>
</div>

<div style="margin:20px 0;padding:20px;background:linear-gradient(135deg,#2A4B7C,#1a3456);color:white;border-radius:16px;text-align:center">
  <p style="font-size:18px;font-weight:600;margin-bottom:8px">Tu logro de hoy</p>
  <p>Construiste un <strong>Prompt Maestro personalizado</strong> para automatizar un proceso propio.<br/>Este es un activo de productividad que puedes usar mañana mismo.</p>
</div>

<h2>Lo que aprendiste hoy</h2>
<ul>
  <li>✅ Cómo funciona la IA: tokens, predicción probabilística y arquitectura MoE</li>
  <li>✅ La diferencia entre un buscador y un motor de razonamiento</li>
  <li>✅ La Estructura Maestra: ROL · CONTEXTO · INSTRUCCIÓN · RESTRICCIONES · FORMATO</li>
  <li>✅ Cómo identificar sesgos y alucinaciones para usarla con responsabilidad</li>
  <li>✅ Tu Prompt Maestro personal listo para aplicar</li>
</ul>

<h2>Sugerencias de continuidad</h2>
<ol>
  <li>Aplica tu Prompt Maestro esta semana y registra los resultados</li>
  <li>Itera: cada uso te enseñará cómo mejorarlo</li>
  <li>Comparte el conocimiento con tu equipo</li>
  <li>Únete a la comunidad iAprende para seguir aprendiendo</li>
</ol>

<div style="text-align:center;margin-top:24px;padding:16px;background:#f9f9f7;border-radius:12px">
  <p style="font-size:14px;color:#888">Facilitado por <strong>Osiel Alejandro Perales Jiménez</strong></p>
  <p style="font-size:13px;color:#aaa;margin-top:4px">Plataforma <strong>iAprende</strong> · Estándar EC0301</p>
</div>
`,
        },
        created_at: '2025-03-01',
    },
]
