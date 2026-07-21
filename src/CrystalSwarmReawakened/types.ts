export const FIELD_W = 390
export const FIELD_H = 844

export type SwarmPhase = 'idle' | 'awaken' | 'bloom' | 'error'

export interface Crystal {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  spin: number
  hue: number
  active: number
  targetActive: number
  orbitSeed: number
}

export interface TrailPoint { x: number; y: number; born: number }
