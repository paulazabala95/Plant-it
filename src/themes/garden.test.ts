import { describe, expect, it } from 'vitest'
import { growthStage, lookAtAge, skyAt } from './garden'

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

describe('skyAt', () => {
  it('starts as a morning sky and ends as a sunset', () => {
    expect(skyAt(0)).toEqual(['#a7c7e4', '#f3eef1'])
    expect(skyAt(1)).toEqual(['#e4568b', '#f6c94d'])
  })
  it('clamps outside the career', () => {
    expect(skyAt(-1)).toEqual(skyAt(0))
    expect(skyAt(2)).toEqual(skyAt(1))
  })
})

describe('lookAtAge', () => {
  it('turns hair grey and adds glasses with age', () => {
    expect(lookAtAge(30, '#3B2A2A')).toEqual({ hair: '#3B2A2A', glasses: false })
    expect(lookAtAge(50, '#3B2A2A').glasses).toBe(false)
    expect(lookAtAge(67, '#3B2A2A')).toEqual({ hair: '#D7D2CB', glasses: true })
  })
})
