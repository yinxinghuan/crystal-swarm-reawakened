let ctx: AudioContext | undefined

function context() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function chime(kind: 'touch' | 'crystal' | 'stage' | 'bloom', muted: boolean, index = 0) {
  if (muted) return
  try {
    const audio = context()
    const now = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    const frequencies = {
      touch: 260,
      crystal: 520 + (index % 8) * 68,
      stage: 220,
      bloom: 330 + index * 190,
    }
    osc.type = kind === 'crystal' ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(frequencies[kind], now)
    osc.frequency.exponentialRampToValueAtTime(frequencies[kind] * (kind === 'bloom' ? 2.1 : 1.28), now + (kind === 'bloom' ? .62 : .12))
    const volume = kind === 'bloom' ? .045 : kind === 'stage' ? .03 : .014
    gain.gain.setValueAtTime(.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume, now + .018)
    gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'bloom' ? .72 : .16))
    osc.connect(gain).connect(audio.destination)
    osc.start(now)
    osc.stop(now + (kind === 'bloom' ? .76 : .19))
  } catch { /* Audio is optional. */ }
}
