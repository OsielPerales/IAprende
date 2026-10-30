import { expect, it } from 'vitest'
import vm from 'node:vm'
import { bloquesIA } from '../src/store/seedCursoIA'
for (const block of bloquesIA) {
  const html = block.contenido.html
  if (typeof html !== 'string') continue
  for (const [index, match] of [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
    it(`${block.id}: embedded script ${index + 1} remains syntactically valid after TS escaping`, () => {
      expect(() => new vm.Script(match[1], { filename: block.id })).not.toThrow()
    })
  }
}
