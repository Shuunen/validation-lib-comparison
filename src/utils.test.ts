import { afterEach, beforeEach, vi } from 'vitest'
import { checkUserA, checkUserB, checkUserC, logExecTime, nbIterations } from './utils.ts'

const userA = { age: 42, name: 'Jordan', phone: '123-456-7890' }
const userB = { age: 35, name: 'Romain', phone: '1234567890' }

describe('check users', () => {
  let assertSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    assertSpy = vi.spyOn(console, 'assert').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const checks = [
    { check: checkUserA, valid: userA },
    { check: checkUserB, valid: userB },
    { check: checkUserC, valid: userA },
  ]
  for (const { check, valid } of checks) {
    it(`${check.name} asserts true on a valid user`, () => {
      check(valid)
      expect(assertSpy).toHaveBeenCalledTimes(3)
      for (const call of assertSpy.mock.calls) expect(call[0]).toBe(true)
    })
    it(`${check.name} asserts false on an invalid user`, () => {
      check({ name: 'Nobody', phone: '0' })
      for (const call of assertSpy.mock.calls) expect(call[0]).toBe(false)
    })
  }
})

describe('logExecTime', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs the rounded elapsed time for fast, medium and slow runs', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const now = vi.spyOn(performance, 'now').mockReturnValue(1000)
    logExecTime('zod4', 950)
    logExecTime('zod4', 850)
    logExecTime('zod4', 700)
    expect(now).toHaveBeenCalledTimes(3)
    expect(logSpy).toHaveBeenCalledTimes(3)
    expect(String(logSpy.mock.calls[0]?.[1])).toContain('50')
    expect(String(logSpy.mock.calls[1]?.[1])).toContain('150')
    expect(String(logSpy.mock.calls[2]?.[1])).toContain('300')
  })
})

describe('nbIterations', () => {
  it('is 1000', () => {
    expect(nbIterations).toBe(1000)
  })
})
