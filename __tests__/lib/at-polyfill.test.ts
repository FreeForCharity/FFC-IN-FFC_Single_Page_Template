import { AT_POLYFILL_JS } from '../../src/lib/at-polyfill'

/**
 * Executes the inline polyfill string the root layout injects into <head>
 * and asserts ES2022 `.at()` semantics. Modern engines already have `.at`,
 * so the polyfill's install path never runs in CI unless we delete the
 * native implementations first — which is exactly what this suite does
 * (and restores afterwards).
 */

type ProtoWithAt = { at?: unknown }

const typedArrayProto = Object.getPrototypeOf(Int8Array.prototype) as ProtoWithAt
const protos: ProtoWithAt[] = [Array.prototype, String.prototype, typedArrayProto]
const saved = protos.map((p) => Object.getOwnPropertyDescriptor(p, 'at'))

describe('AT_POLYFILL_JS', () => {
  beforeEach(() => {
    for (const p of protos) delete p.at
    new Function(AT_POLYFILL_JS)()
  })

  afterAll(() => {
    protos.forEach((p, i) => {
      const desc = saved[i]
      if (desc) Object.defineProperty(p, 'at', desc)
    })
  })

  it('installs .at on Array, String, and TypedArray prototypes', () => {
    expect(typeof Array.prototype.at).toBe('function')
    expect(typeof String.prototype.at).toBe('function')
    expect(typeof typedArrayProto.at).toBe('function')
  })

  it('handles positive, negative, and out-of-range indices on arrays', () => {
    expect([10, 20, 30].at(0)).toBe(10)
    expect([10, 20, 30].at(-1)).toBe(30)
    expect([10, 20, 30].at(2)).toBe(30)
    expect([10, 20, 30].at(3)).toBeUndefined()
    expect([10, 20, 30].at(-4)).toBeUndefined()
  })

  it('truncates fractional indices and treats NaN as 0 (spec semantics)', () => {
    expect([10, 20, 30].at(1.9)).toBe(20)
    expect([10, 20, 30].at(-1.9)).toBe(30)
    expect([10, 20, 30].at(NaN)).toBe(10)
  })

  it('works on strings and typed arrays', () => {
    expect('abc'.at(-1)).toBe('c')
    expect('abc'.at(1)).toBe('b')
    expect(Int8Array.from([1, 2, 3]).at(-1)).toBe(3)
  })

  it('does not overwrite an existing native implementation', () => {
    const sentinel = () => 'native'
    Object.defineProperty(Array.prototype, 'at', {
      writable: true,
      configurable: true,
      value: sentinel,
    })
    new Function(AT_POLYFILL_JS)()
    expect(Array.prototype.at).toBe(sentinel)
  })
})
