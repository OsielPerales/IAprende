/**
 * Validación estructural de datos autorales del curso IA v3.
 * No conecta Firebase, no ejecuta TypeScript ni importa datos en producción.
 *
 * Ejecutar: node scripts/validate-curso-ia-v3.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(projectRoot, 'src/store/cursoIAInteractivoV3.ts'), 'utf8')

function extractJson(before, after) {
  const start = source.indexOf(before)
  if (start < 0) throw new Error('No se encontró ' + before)
  const jsonStart = start + before.length
  const end = source.indexOf(after, jsonStart)
  if (end < 0) throw new Error('No se encontró el límite ' + after)
  return JSON.parse(source.slice(jsonStart, end).trim())
}

const curso = extractJson('export const cursoIAInteractivoV3: Curso = ', '\n\nexport const bloquesIAInteractivoV3')
const bloques = extractJson('export const bloquesIAInteractivoV3: Bloque[] = ', '\n\nexport const mapaDidacticoIAInteractivoV3')
const mapaRaw = source.slice(source.indexOf('export const mapaDidacticoIAInteractivoV3 = ') + 'export const mapaDidacticoIAInteractivoV3 = '.length).trim()
const mapa = JSON.parse(mapaRaw.replace(/\s+as const\s*$/, ''))

const tipos = new Set(['texto', 'imagen', 'carrusel', 'cuestionario', 'simulador', 'portada', 'comparador', 'infografia', 'tarjetas_flip', 'tabla_editable', 'checklist', 'campo_libre', 'simulador_prompt', 'caso_etico', 'mapa_ecosistema', 'resumen_personal'])
const esperado = { Encuadre: 15, Explorar: 25, Diseñar: 55, Validar: 20, Cierre: 20 }
const errores = []
const assert = (test, msg) => { if (!test) errores.push(msg) }
const ids = new Set()
const counts = {}

assert(curso.publicado === false, 'El piloto NO debe estar publicado')
assert(curso.id !== 'c-ia-estrategica', 'No sobrescribir la versión existente')
assert(bloques.length === mapa.length, 'Cada bloque necesita un mapa didáctico')
assert(bloques.length === 33, 'Se esperan 33 bloques')
for (const [index, bloque] of bloques.entries()) {
  const prefix = 'Bloque #' + (index + 1)
  assert(bloque.orden === index + 1, prefix + ': orden incorrecto')
  assert(!ids.has(bloque.id), prefix + ': ID duplicado')
  ids.add(bloque.id)
  assert(bloque.curso_id === curso.id, prefix + ': curso_id incorrecto')
  assert(tipos.has(bloque.tipo), prefix + ': tipo inválido ' + bloque.tipo)
  assert(bloque.contenido && typeof bloque.contenido === 'object', prefix + ': falta contenido')
  assert(mapa[index]?.id === bloque.id, prefix + ': mapa no corresponde al bloque')
  const m = mapa[index]
  if (m) {
    assert(Number.isInteger(m.duracion_min) && m.duracion_min > 0, prefix + ': duración inválida')
    counts[m.fase] = (counts[m.fase] || 0) + m.duracion_min
  }
  const c = bloque.contenido ?? {}
  if (bloque.tipo === 'cuestionario') {
    assert(Array.isArray(c.preguntas) && c.preguntas.length >= 3, prefix + ': cuestionario incompleto')
    const qids = new Set()
    for (const q of c.preguntas ?? []) {
      assert(!qids.has(q.id), prefix + ': pregunta repetida')
      qids.add(q.id)
      assert(['opcion_multiple', 'abierta'].includes(q.tipo), prefix + ': subtipo inválido')
      assert(q.tipo !== 'opcion_multiple' || (Array.isArray(q.opciones) && q.correcta >= 0 && q.correcta < q.opciones.length), prefix + ': opciones incorrectas')
    }
  }
  if (bloque.tipo === 'simulador') {
    assert(c.html.includes('sandbox') === false, prefix + ': no introducir atributos de iframe en el HTML interno')
    assert(c.html.includes('<!doctype html>'), prefix + ': HTML incompleto')
    assert(c.instrucciones.includes('no se guarda'), prefix + ': declaración de no persistencia ausente')
  }
  if (bloque.tipo === 'comparador') {
    const n = c.caracteristicas.length
    const selected = [...c.correctas_a, ...c.correctas_b]
    assert(new Set(selected).size === n && selected.every(v => v >= 0 && v < n), prefix + ': claves inválidas en comparador')
  }
  if (bloque.tipo === 'tabla_editable') assert(c.progreso_field === 'bitacora', prefix + ': campo de tabla no compatible con versión actual')
  if (bloque.tipo === 'campo_libre') assert(['rol_construido','contexto_construido','prompt_maestro'].includes(c.progreso_field), prefix + ': campo libre sin persistencia tipada')
}
for (const [fase, minutos] of Object.entries(esperado)) assert(counts[fase] === minutos, fase + ': minutos '+counts[fase]+' en vez de '+minutos)
assert(Object.values(counts).reduce((a,b)=>a+b,0) === 135, 'Duración total distinta de 135 minutos')
const suma = nombre => {
  const bloque = bloques.find(x => x.tipo === 'cuestionario' && x.contenido.titulo === nombre)
  return bloque ? bloque.contenido.preguntas.reduce((acc,p)=>acc+(p.puntos??0),0) : null
}
assert(suma('Comprueba si puedes diseñar una instrucción segura') === 100, 'Formativa no suma 100')
assert(suma('Verifica lo que te llevas') === 100, 'Cuestionario final no suma 100')
if (errores.length) {
  console.error('Validación FALLIDA:', errores.join('\n- '))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ estado: 'ESTRUCTURA_VALIDADA', bloques: bloques.length, tipos: [...new Set(bloques.map(x=>x.tipo))].length, minutos: counts, publicado: curso.publicado },null,2))
  console.log('NOTA: revisión estructural solamente; no garantiza compilación, backend, persistencia, seguridad ni evaluación pedagógica real.')
}
