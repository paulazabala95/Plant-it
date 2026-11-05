import { describe, expect, it } from 'vitest'
import { growthStage } from './garden'

describe('growthStage', () => {
  it('is a seed when nothing has grown', () => {
    expect(growthStage(0, 100)).toBe(0)
  })
  it('blooms for the biggest garden and scales the others', () => {
    expect(growthStage(100, 100)).toBe(4)
    expect(growthStage(98, 100)).toBe(4)
    expect(growthStage(90, 100)).toBe(3)
    expect(growthStage(50, 100)).toBe(2)
    expect(growthStage(10, 100)).toBe(1)
  })
})
