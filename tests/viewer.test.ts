import { expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
vi.mock('../src/lib/firebase', () => ({ auth: {}, db: {} }))
vi.mock('../src/lib/ai', () => ({ AI_CLAUDE_URL: '', getAdaptiveRecommendation: vi.fn() }))
import { StudentBlockView } from '../src/pages/CursoViewer'
const props: any = { quizAnswers: {}, onQuizAnswer: () => {}, onQuizSubmit: () => {}, isCompleted: false, courseTitle: 'Curso', onContinue: () => {}, progreso: null, onProgresoUpdate: () => {} }
it('student viewer renders the documented annotated image type', () => {
  const html = renderToStaticMarkup(React.createElement(StudentBlockView, { ...props, bloque: { tipo: 'imagen', contenido: { url: 'https://example.test/image.png', alt: 'Diagrama', caption: 'Paso 1', cuadros: [{ id: 'a', texto: 'Punto clave', posicion: 'top-left', color: 'info' }] } } }))
  expect(html).toContain('alt="Diagrama"')
  expect(html).toContain('Punto clave')
  expect(html).toContain('Paso 1')
})
it('open-only quiz does not invent a 75 percent grade', () => {
  const html = renderToStaticMarkup(React.createElement(StudentBlockView, { ...props, isCompleted: true, bloque: { tipo: 'cuestionario', contenido: { preguntas: [{ id: 'p', texto: 'Explica', tipo: 'abierta', puntos: 10 }] } } }))
  expect(html).toContain('pendiente de revisión')
  expect(html).not.toContain('75%')
})
