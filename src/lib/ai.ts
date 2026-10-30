import { authenticatedFetch } from './http'
/**
 * iAprende — AI Service
 * 
 * ⚠️  SEGURIDAD: La clave de API de IA NUNCA se envía al navegador.
 * Todas las llamadas pasan por el proxy seguro en Firebase Functions (aiProxy).
 * 
 * Modos:
 *   - DEMO: Respuestas mock inteligentes (sin llamada al proxy)
 *   - LIVE: Llama al proxy cuando VITE_AI_PROXY_URL está configurado
 * 
 * Configura en .env: VITE_AI_PROXY_URL=https://REGION-PROJECT.cloudfunctions.net/aiProxy
 */

// URL del proxy backend (Firebase Function) — NUNCA una clave de API aquí
const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || ''
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini'

// URL de las nuevas Cloud Functions Claude (SP1-SP7)
export const AI_CLAUDE_URL = import.meta.env.VITE_AI_CLAUDE_URL || ''

export const isDemoAI = !AI_PROXY_URL || AI_PROXY_URL === 'demo'

// ── Tutor Virtual ──────────────────────────────────────────────

const TUTOR_MOCK_RESPONSES: Record<string, string[]> = {
    default: [
        'Excelente pregunta. Basándome en el contenido de este módulo, lo que debes recordar es que el concepto se aplica directamente en tu contexto de trabajo diario. Te recomiendo revisar los puntos clave nuevamente y relacionarlos con tu experiencia.',
        'Muy buena observación. El tema que mencionas está relacionado con los fundamentos del módulo. Para profundizar, piensa en cómo este concepto se conecta con los procesos que ya conoces en tu área.',
        'Perfecto que preguntes eso. Este es uno de los puntos más importantes del módulo. La clave está en entender el "por qué" detrás del proceso, no solo el "cómo". ¿Hay algún aspecto específico que quieras explorar más?',
    ],
    'qué': [
        'Según el contenido de este bloque, la definición que buscas tiene que ver con los conceptos fundamentales presentados. Te sugiero releer el párrafo principal con atención a las palabras en **negrita**, que son los términos clave.',
    ],
    'cómo': [
        'El proceso descrito en este módulo sigue estos pasos: primero identificar el estado actual, luego aplicar el criterio aprendido, y finalmente verificar el resultado. ¿Sobre cuál paso tienes la duda específica?',
    ],
    'por qué': [
        'Excelente pregunta de fondo. El "por qué" de este tema radica en el impacto directo que tiene en la eficiencia y la seguridad del proceso. La plataforma iAprende parte del principio de que entender el propósito mejora 3x la retención del conocimiento.',
    ],
}

function getMockTutorResponse(question: string): string {
    const lower = question.toLowerCase()
    for (const [key, responses] of Object.entries(TUTOR_MOCK_RESPONSES)) {
        if (key !== 'default' && lower.includes(key)) {
            return responses[Math.floor(Math.random() * responses.length)]
        }
    }
    const defaults = TUTOR_MOCK_RESPONSES.default
    return defaults[Math.floor(Math.random() * defaults.length)]
}

export async function askTutor(
    question: string,
    blockContent: string,
    courseTitle: string
): Promise<string> {
    if (isDemoAI) {
        await new Promise((r) => setTimeout(r, 1200)) // simulate latency
        return getMockTutorResponse(question)
    }

    const response = await authenticatedFetch(AI_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `Eres el tutor virtual del curso "${courseTitle}" en iAprende, una plataforma de capacitación industrial. Responde de forma clara, concisa y motivadora. Usa el contenido del bloque como referencia para tus respuestas. Responde siempre en español. Máximo 150 palabras.`,
                },
                {
                    role: 'user',
                    content: `Contenido del bloque:\n${blockContent.substring(0, 2000)}\n\nPregunta del alumno: ${question}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        }),
    })

    if (!response.ok) {
        throw new Error(`AI error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
}

// ── Generador de Quizzes ─────────────────────────────────────────

interface GeneratedQuestion {
    id: string
    texto: string
    tipo: 'opcion_multiple' | 'abierta'
    opciones?: string[]
    correcta?: number
    puntos: number
}

interface GeneratedQuiz {
    titulo: string
    preguntas: GeneratedQuestion[]
}

const MOCK_QUIZ: GeneratedQuiz = {
    titulo: 'Quiz generado por IA — Conceptos del módulo',
    preguntas: [
        {
            id: `q-ai-1`,
            texto: '¿Cuál es el principal beneficio de aplicar este concepto en la práctica industrial?',
            tipo: 'opcion_multiple',
            opciones: [
                'Reducción de costos operativos',
                'Mayor seguridad para el trabajador',
                'Mejor calidad del producto final',
                'Todas las anteriores',
            ],
            correcta: 3,
            puntos: 25,
        },
        {
            id: `q-ai-2`,
            texto: '¿Cuál de las siguientes afirmaciones describe correctamente el proceso descrito en el módulo?',
            tipo: 'opcion_multiple',
            opciones: [
                'El proceso comienza con la validación de resultados',
                'El proceso inicia identificando el estado actual del sistema',
                'Los pasos pueden realizarse en cualquier orden',
                'El proceso no requiere supervisión humana',
            ],
            correcta: 1,
            puntos: 25,
        },
        {
            id: `q-ai-3`,
            texto: '¿Qué señal de alerta indica que el proceso no está funcionando correctamente? Menciona al menos dos indicadores.',
            tipo: 'opcion_multiple',
            opciones: [
                'Aumento en tiempos de ciclo y errores frecuentes',
                'Eficiencia por encima del 95%',
                'Cero interrupciones en la línea',
                'Reducción en el desperdicio de material',
            ],
            correcta: 0,
            puntos: 25,
        },
        {
            id: `q-ai-4`,
            texto: 'Describe con tus propias palabras cómo aplicarías lo aprendido en este módulo en tu área de trabajo.',
            tipo: 'abierta',
            puntos: 25,
        },
    ],
}

export async function generateQuiz(
    blockContent: string,
    courseTitle: string,
    numQuestions = 4
): Promise<GeneratedQuiz> {
    if (isDemoAI) {
        await new Promise((r) => setTimeout(r, 2000))
        // Add timestamps to IDs for uniqueness
        return {
            ...MOCK_QUIZ,
            preguntas: MOCK_QUIZ.preguntas.slice(0, numQuestions).map((q, i) => ({
                ...q,
                id: `q-ai-${Date.now()}-${i}`,
            })),
        }
    }

    const response = await authenticatedFetch(AI_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `Eres un experto en diseño instruccional para capacitación industrial. Genera exactamente ${numQuestions} preguntas de evaluación en español basadas en el contenido proporcionado. 
          
Devuelve SOLO un JSON válido con esta estructura:
{
  "titulo": "Quiz: [tema del contenido]",
  "preguntas": [
    {
      "id": "q1",
      "texto": "pregunta...",
      "tipo": "opcion_multiple",
      "opciones": ["A", "B", "C", "D"],
      "correcta": 0,
      "puntos": 25
    }
  ]
}

Incluye 3 preguntas de opción múltiple con 4 opciones y 1 pregunta abierta de aplicación práctica. Los puntos deben sumar 100.`,
                },
                {
                    role: 'user',
                    content: `Curso: "${courseTitle}"\n\nContenido del módulo:\n${blockContent.substring(0, 3000)}`,
                },
            ],
            temperature: 0.5,
            max_tokens: 1000,
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) throw new Error(`AI error: ${response.statusText}`)
    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content) as GeneratedQuiz

    // Ensure IDs are unique
    return {
        ...parsed,
        preguntas: parsed.preguntas.map((q, i) => ({ ...q, id: `q-ai-${Date.now()}-${i}` })),
    }
}

// ── Resumen TL;DR ────────────────────────────────────────────────

const MOCK_TLDR = [
    '• La **alfabetización digital** es la capacidad de usar, entender y crear con tecnologías digitales de forma segura.',
    '• En el contexto industrial, implica interpretar datos de producción, operar interfaces digitales y comunicarse con herramientas digitales.',
    '• El **51% de las PyMEs mexicanas** señalan el desconocimiento del personal como la barrera #1 para adoptar tecnología.',
]

export async function generateTLDR(htmlContent: string): Promise<string[]> {
    if (isDemoAI) {
        await new Promise((r) => setTimeout(r, 1000))
        return MOCK_TLDR
    }

    // Strip HTML tags for the prompt
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

    const response = await authenticatedFetch(AI_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente de aprendizaje. Extrae exactamente 3 puntos clave del texto en español. Devuelve SOLO un JSON: {"puntos": ["• punto1", "• punto2", "• punto3"]}. Usa **negrita** para los datos más importantes.',
                },
                { role: 'user', content: text.substring(0, 2000) },
            ],
            temperature: 0.3,
            max_tokens: 200,
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) throw new Error(`AI error: ${response.statusText}`)
    const data = await response.json()
    return JSON.parse(data.choices[0].message.content).puntos
}

// ── Generador de Simuladores IA ───────────────────────────────────

export interface GeneratedSimulator {
    titulo: string
    instrucciones: string
    html: string
    altura_px: number
}

const MOCK_SIMULATOR: GeneratedSimulator = {
    titulo: 'Simulador Interactivo — Generado por IA',
    instrucciones: 'Interactúa con los elementos del simulador para practicar el concepto. Sigue las instrucciones en pantalla.',
    altura_px: 420,
    html: `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; box-sizing: border-box; font-family: system-ui, sans-serif; }
body { background: #f9f9f7; padding: 20px; color: #2d2d2d; }
h2 { font-size: 18px; margin-bottom: 4px; color: #1a1a2e; }
p.sub { font-size: 13px; color: #888; margin-bottom: 16px; }
.scenario { background: white; border-radius: 12px; padding: 16px; border: 1px solid #eee; margin-bottom: 16px; }
.scenario h3 { font-size: 14px; color: #555; margin-bottom: 10px; }
.options { display: grid; gap: 8px; }
.opt { padding: 10px 14px; border-radius: 8px; border: 2px solid #e0e0e0; cursor: pointer; font-size: 14px; text-align: left; background: white; transition: all .15s; }
.opt:hover { border-color: #E07A5F; background: #fff5f3; }
.opt.correct { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.opt.wrong { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
.feedback { padding: 12px; border-radius: 8px; font-size: 14px; display: none; margin-top: 12px; }
.feedback.show { display: block; }
.feedback.ok { background: #dcfce7; color: #166534; }
.feedback.no { background: #fef2f2; color: #991b1b; }
.score { text-align: center; font-size: 20px; font-weight: 700; color: #E07A5F; margin-top: 8px; display: none; }
button.reset { background: #E07A5F; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 12px; display: none; }
button.reset:hover { background: #d46a4d; }
</style>
</head>
<body>
<h2>🎯 Simulador de Toma de Decisiones</h2>
<p class="sub">Analiza el escenario y selecciona la mejor acción</p>
<div class="scenario">
  <h3>Escenario: Una máquina CNC muestra una alarma de temperatura elevada (TMP-03). ¿Cuál es el primer paso?</h3>
  <div class="options">
    <button class="opt" onclick="check(this, false)">Apagar inmediatamente sin registrar</button>
    <button class="opt" onclick="check(this, true)">Activar parada segura y notificar al supervisor</button>
    <button class="opt" onclick="check(this, false)">Ignorar la alarma y continuar producción</button>
    <button class="opt" onclick="check(this, false)">Reiniciar la máquina directamente</button>
  </div>
  <div id="fb" class="feedback"></div>
</div>
<div class="score" id="score">✅ ¡Correcto! +10 pts — Excelente criterio de seguridad.</div>
<button class="reset" id="reset" onclick="resetSim()">Siguiente escenario →</button>
<script>
let done = false;
function check(el, correct) {
  if (done) return;
  done = true;
  const fb = document.getElementById('fb');
  const score = document.getElementById('score');
  const reset = document.getElementById('reset');
  document.querySelectorAll('.opt').forEach(b => { b.style.pointerEvents='none'; });
  if (correct) {
    el.className = 'opt correct';
    fb.textContent = '✓ Correcto. La parada segura protege al operario y preserva el estado de la máquina para el diagnóstico.';
    fb.className = 'feedback show ok';
    score.style.display = 'block';
  } else {
    el.className = 'opt wrong';
    fb.textContent = '✗ Incorrecto. Ante una alarma de temperatura, siempre se activa la parada segura primero para evitar daños.';
    fb.className = 'feedback show no';
  }
  reset.style.display = 'block';
}
function resetSim() {
  done = false;
  document.querySelectorAll('.opt').forEach(b => { b.className='opt'; b.style.pointerEvents=''; });
  document.getElementById('fb').className = 'feedback';
  document.getElementById('score').style.display = 'none';
  document.getElementById('reset').style.display = 'none';
}
</script>
</body>
</html>`,
}

export async function generateSimulator(
    topic: string,
    context: string,
    courseTitle: string
): Promise<GeneratedSimulator> {
    if (isDemoAI) {
        await new Promise((r) => setTimeout(r, 3000))
        return {
            ...MOCK_SIMULATOR,
            titulo: `Simulador: ${topic}`,
        }
    }

    const response = await authenticatedFetch(AI_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `Eres un experto en diseño instruccional e-learning. Genera un simulador interactivo HTML completo y autónomo sobre el tema dado.

El simulador debe:
- Tener al menos un escenario interactivo con feedback inmediato
- Usar HTML, CSS y JavaScript vanilla (sin librerías externas)
- Ser visualmente atractivo con colores (#E07A5F para primary, #1a1a2e para texto oscuro)
- Tener instrucciones claras para el usuario
- Funcionar completamente dentro de un iframe sandbox="allow-scripts"
- Ser educativo y relevante para el contexto industrial/laboral

Devuelve SOLO un JSON válido:
{
  "titulo": "Nombre del simulador",
  "instrucciones": "Descripción de 1-2 oraciones para el alumno",
  "html": "<!DOCTYPE html>...código completo...",
  "altura_px": 420
}`,
                },
                {
                    role: 'user',
                    content: `Curso: "${courseTitle}"\nTema del simulador: "${topic}"\nContexto adicional: ${context.substring(0, 1500)}`,
                },
            ],
            temperature: 0.6,
            max_tokens: 3000,
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) throw new Error(`AI error: ${response.statusText}`)
    const data = await response.json()
    return JSON.parse(data.choices[0].message.content) as GeneratedSimulator
}

// ── Recomendaciones Adaptativas (SP5: Claude-powered when configured) ──────────

export interface AdaptiveRecommendation {
    nivel: 'excelente' | 'bueno' | 'reforzar' | 'repasar'
    mensaje: string
    accion: string
    siguienteTema?: string
}

export async function getAdaptiveRecommendation(
    score: number,
    courseTitle: string,
    quizTitle: string,
    wrongTopics: string[],
    alumnoId?: string,
    cursoId?: string
): Promise<AdaptiveRecommendation> {
    // SP5: Live mode — call Claude Cloud Function for personalized recommendation
    if (AI_CLAUDE_URL && alumnoId && cursoId) {
        try {
            const res = await authenticatedFetch(`${AI_CLAUDE_URL}/getPersonalizedLearningPathFn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alumnoId, cursoId, recentScore: score, courseTitle, quizTitle }),
            })
            if (res.ok) return await res.json() as AdaptiveRecommendation
        } catch {
            // Fall through to deterministic fallback
        }
    }

    // Deterministic fallback (demo mode or Cloud Function unavailable)
    await new Promise((r) => setTimeout(r, 400))

    if (score >= 90) {
        return {
            nivel: 'excelente',
            mensaje: `¡Dominas este tema perfectamente! Obtuviste ${score}% en "${quizTitle}".`,
            accion: 'Continúa al siguiente módulo — estás listo.',
            siguienteTema: 'Módulo avanzado',
        }
    }
    if (score >= 70) {
        return {
            nivel: 'bueno',
            mensaje: `Buen resultado (${score}%) en "${quizTitle}". Hay algunos puntos por afinar.`,
            accion: wrongTopics.length > 0
                ? `Revisa: ${wrongTopics.slice(0, 2).join(', ')}.`
                : 'Repasa el material antes de avanzar.',
        }
    }
    if (score >= 50) {
        return {
            nivel: 'reforzar',
            mensaje: `Obtuviste ${score}% en "${quizTitle}". Se recomienda reforzar este tema.`,
            accion: 'Te sugerimos releer el módulo completo y usar el Tutor IA para aclarar dudas.',
        }
    }
    return {
        nivel: 'repasar',
        mensaje: `Obtuviste ${score}% en "${quizTitle}". Este tema necesita más práctica.`,
        accion: 'Regresa al inicio del módulo, usa el TL;DR y el Tutor IA antes de intentarlo de nuevo.',
    }
}

