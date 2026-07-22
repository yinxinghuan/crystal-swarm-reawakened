import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { Crystal, SwarmPhase, TrailPoint } from '../types'
import { chime } from '../utils/audio'

const CRYSTAL_COUNT = 64
const COMPLETE_AT = 42
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function makeCrystals(): Crystal[] {
  return Array.from({ length: CRYSTAL_COUNT }, (_, index) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 34 + Math.pow(Math.random(), .62) * 188
    return {
      x: .5 + Math.cos(angle) * distance / 390,
      y: .52 + Math.sin(angle) * distance / 844,
      vx: 0, vy: 0,
      size: 8 + Math.random() * 16,
      spin: Math.random() * Math.PI * 2,
      hue: index % 11 === 0 ? 318 : 175 + Math.random() * 55,
      active: index < 5 ? .08 : 0,
      targetActive: index < 5 ? .08 : 0,
      orbitSeed: Math.random() * Math.PI * 2,
    }
  })
}

export function useCrystalSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const crystalsRef = useRef<Crystal[]>(makeCrystals())
  const trailsRef = useRef<TrailPoint[]>([])
  const pointerRef = useRef({ x: .5, y: .52, down: false, moved: false, lastMove: 0 })
  const phaseRef = useRef<SwarmPhase>('idle')
  const startRef = useRef(0)
  const bloomRef = useRef(0)
  const awakenedRef = useRef(0)
  const rafRef = useRef(0)
  const mutedRef = useRef(false)
  const reducedRef = useRef(false)
  const [phase, setPhase] = useState<SwarmPhase>('idle')
  const [awakened, setAwakened] = useState(0)
  const [muted, setMuted] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)
  const [supported, setSupported] = useState(true)

  const activateNear = useCallback((x: number, y: number, now: number) => {
    const crystals = crystalsRef.current
    const radius = pointerRef.current.moved ? .205 : .16
    let changed = 0
    for (const crystal of crystals) {
      if (crystal.targetActive > 0) continue
      const dx = crystal.x - x
      const dy = crystal.y - y
      if (Math.hypot(dx, dy * .58) < radius) {
        crystal.targetActive = 1
        changed += 1
        chime('crystal', mutedRef.current, changed)
      }
    }
    if (changed) {
      const total = crystals.filter((crystal) => crystal.targetActive > 0).length
      awakenedRef.current = total
      setAwakened(total)
      if (total === 18 || total === 32) chime('stage', mutedRef.current)
    }
  }, [])

  const positionFromEvent = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height }
  }

  const addTrail = (x: number, y: number, now: number) => {
    const prior = trailsRef.current[trailsRef.current.length - 1]
    if (!prior || Math.hypot(x - prior.x, y - prior.y) > .012 || now - prior.born > 50) {
      trailsRef.current.push({ x, y, born: now })
      if (trailsRef.current.length > 24) trailsRef.current.shift()
    }
  }

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const now = performance.now()
    const { x, y } = positionFromEvent(event)
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current = { x, y, down: true, moved: false, lastMove: now }
    addTrail(x, y, now)
    setHintDismissed(true)
    if (!startRef.current) {
      startRef.current = now
      phaseRef.current = 'awaken'
      setPhase('awaken')
      chime('touch', mutedRef.current)
    }
    activateNear(x, y, now)
  }, [activateNear])

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current.down) return
    const now = performance.now()
    const { x, y } = positionFromEvent(event)
    const moved = Math.hypot(x - pointerRef.current.x, y - pointerRef.current.y) > .018
    pointerRef.current = { x, y, down: true, moved: pointerRef.current.moved || moved, lastMove: now }
    addTrail(x, y, now)
    if (moved) setHintDismissed(true)
    activateNear(x, y, now)
  }, [activateNear])

  const onPointerUp = useCallback(() => { pointerRef.current.down = false }, [])

  const reset = useCallback(() => {
    crystalsRef.current = makeCrystals()
    trailsRef.current = []
    pointerRef.current = { x: .5, y: .52, down: false, moved: false, lastMove: 0 }
    startRef.current = 0
    bloomRef.current = 0
    phaseRef.current = 'idle'
    setPhase('idle')
    setAwakened(0)
    awakenedRef.current = 0
    setHintDismissed(false)
  }, [])

  const toggleMuted = useCallback(() => {
    mutedRef.current = !mutedRef.current
    setMuted(mutedRef.current)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = shellRef.current
    if (!canvas || !shell) return
    const context = canvas.getContext('2d')
    if (!context) { setSupported(false); return }
    reducedRef.current = prefersReducedMotion()
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(shell.clientWidth * dpr)
      canvas.height = Math.floor(shell.clientHeight * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(shell)
    resize()
    let last = performance.now()

    const draw = (now: number) => {
      const elapsed = Math.min(34, now - last)
      last = now
      const width = shell.clientWidth
      const height = shell.clientHeight
      const cx = width * .5
      const cy = height * .52
      const bloomElapsed = bloomRef.current ? now - bloomRef.current : 0
      const bloomProgress = Math.min(1, bloomElapsed / 5400)
      if (!bloomRef.current && awakenedRef.current >= COMPLETE_AT && now - startRef.current > 5000) {
        bloomRef.current = now
        phaseRef.current = 'bloom'
        setPhase('bloom')
        ;[0, 1, 2].forEach((beat) => window.setTimeout(() => chime('bloom', mutedRef.current, beat), beat * 700))
      }
      const motion = reducedRef.current ? .25 : 1
      context.clearRect(0, 0, width, height)
      const background = context.createRadialGradient(cx, cy, 4, cx, cy, Math.max(width, height) * .72)
      background.addColorStop(0, bloomRef.current ? '#102a3b' : '#09182b')
      background.addColorStop(.44, '#071222')
      background.addColorStop(1, '#03050d')
      context.fillStyle = background
      context.fillRect(0, 0, width, height)

      const dustCount = reducedRef.current || window.devicePixelRatio > 2 ? 80 : 180
      for (let index = 0; index < dustCount; index += 1) {
        const angle = index * 2.399 + Math.sin(now / 9000 + index) * .3
        const radius = (index % 23) / 23 * Math.max(width, height) * .66 + 26
        const x = cx + Math.cos(angle + now / 23000) * radius
        const y = cy + Math.sin(angle * 1.41 + now / 18000) * radius * .68
        context.fillStyle = `rgba(126, 220, 255, ${.025 + (index % 4) * .008})`
        context.fillRect(x, y, 1, 1)
      }

      const trails = trailsRef.current.filter((trail) => now - trail.born < 2200)
      trailsRef.current = trails
      if (trails.length > 1) {
        context.lineCap = 'round'
        for (let index = 1; index < trails.length; index += 1) {
          const alpha = Math.max(0, 1 - (now - trails[index].born) / 2200)
          context.strokeStyle = `rgba(130, 248, 234, ${alpha * .45})`
          context.lineWidth = 1 + alpha * 3
          context.beginPath()
          context.moveTo(trails[index - 1].x * width, trails[index - 1].y * height)
          context.lineTo(trails[index].x * width, trails[index].y * height)
          context.stroke()
        }
      }
      if (pointerRef.current.down) {
        const px = pointerRef.current.x * width
        const py = pointerRef.current.y * height
        const pulse = 13 + Math.sin(now / 90) * 2
        context.strokeStyle = 'rgba(159, 255, 243, .62)'
        context.lineWidth = 1
        context.beginPath(); context.arc(px, py, pulse, 0, Math.PI * 2); context.stroke()
        context.beginPath(); context.arc(px, py, pulse * 1.72, 0, Math.PI * 2); context.strokeStyle = 'rgba(119, 172, 255, .19)'; context.stroke()
      }

      const crystals = crystalsRef.current
      for (let index = 0; index < crystals.length; index += 1) {
        const crystal = crystals[index]
        crystal.active += (crystal.targetActive - crystal.active) * Math.min(1, elapsed / 90)
        const pointX = pointerRef.current.x
        const pointY = pointerRef.current.y
        const pull = crystal.active * (pointerRef.current.down ? .00017 : .000042)
        crystal.vx += (pointX - crystal.x) * pull
        crystal.vy += (pointY - crystal.y) * pull
        crystal.vx += Math.cos(now / 1900 + crystal.orbitSeed) * .000003 * motion
        crystal.vy += Math.sin(now / 1600 + crystal.orbitSeed) * .000003 * motion
        if (bloomRef.current) {
          const targetRadius = .115 + (index % 12) / 12 * .16
          const targetAngle = crystal.orbitSeed + now / 1000 * .4 * motion
          const tx = .5 + Math.cos(targetAngle) * targetRadius
          const ty = .52 + Math.sin(targetAngle) * targetRadius * .53
          crystal.vx += (tx - crystal.x) * .00045
          crystal.vy += (ty - crystal.y) * .00045
        }
        crystal.vx *= .92; crystal.vy *= .92
        crystal.x += crystal.vx * elapsed
        crystal.y += crystal.vy * elapsed
        crystal.x = Math.max(.03, Math.min(.97, crystal.x))
        crystal.y = Math.max(.08, Math.min(.94, crystal.y))
        crystal.spin += .006 * motion + crystal.active * .004
        const x = crystal.x * width
        const y = crystal.y * height
        const size = crystal.size * (.72 + crystal.active * .5 + bloomProgress * .22)
        const lum = .12 + crystal.active * .76
        context.save()
        context.translate(x, y)
        context.rotate(crystal.spin)
        context.shadowBlur = crystal.active * 18 + bloomProgress * 10
        context.shadowColor = `hsla(${crystal.hue}, 95%, 70%, .8)`
        context.beginPath()
        context.moveTo(0, -size)
        context.lineTo(size * .46, -size * .12)
        context.lineTo(size * .28, size)
        context.lineTo(-size * .42, size * .58)
        context.lineTo(-size * .52, -size * .28)
        context.closePath()
        const fill = context.createLinearGradient(-size, -size, size, size)
        fill.addColorStop(0, `hsla(${crystal.hue + 14}, 96%, ${44 + lum * 34}%, ${.16 + lum * .62})`)
        fill.addColorStop(.58, `hsla(${crystal.hue}, 86%, ${26 + lum * 35}%, ${.1 + lum * .5})`)
        fill.addColorStop(1, `hsla(${crystal.hue - 18}, 95%, 88%, ${.08 + lum * .38})`)
        context.fillStyle = fill
        context.fill()
        context.shadowBlur = 0
        context.strokeStyle = `rgba(220, 252, 255, ${.08 + lum * .7})`
        context.lineWidth = .75
        context.stroke()
        context.beginPath(); context.moveTo(0, -size); context.lineTo(size * .28, size); context.strokeStyle = `rgba(255,255,255,${.06 + lum * .42})`; context.stroke()
        context.restore()
      }

      if (bloomRef.current) {
        const glow = Math.sin(Math.min(bloomElapsed, 3000) / 350 * Math.PI) ** 2
        const cloud = context.createRadialGradient(cx, cy, 0, cx, cy, 190 + glow * 60)
        cloud.addColorStop(0, `rgba(245, 154, 239, ${.12 + glow * .16})`)
        cloud.addColorStop(.36, `rgba(111, 247, 230, ${.09 + glow * .12})`)
        cloud.addColorStop(1, 'rgba(5, 9, 19, 0)')
        context.fillStyle = cloud
        context.fillRect(cx - 260, cy - 260, 520, 520)
        for (let index = 0; index < 110; index += 1) {
          const p = (index * 1.618 + now / 1600) % (Math.PI * 2)
          const radius = 18 + (index % 17) * 8 + Math.sin(now / 600 + index) * 5
          context.fillStyle = `hsla(${index % 7 === 0 ? 318 : 181 + index % 38}, 95%, 76%, ${.13 + glow * .22})`
          context.fillRect(cx + Math.cos(p) * radius, cy + Math.sin(p) * radius * .56, 1.5, 1.5)
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); observer.disconnect() }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r') reset()
      if (event.key.toLowerCase() === 'm') toggleMuted()
      if (event.code === 'Space' && !startRef.current) {
        const now = performance.now()
        startRef.current = now
        phaseRef.current = 'awaken'
        setPhase('awaken')
        activateNear(.5, .52, now)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activateNear, reset, toggleMuted])

  return { canvasRef, shellRef, phase, awakened, muted, hintDismissed, supported, onPointerDown, onPointerMove, onPointerUp, reset, toggleMuted }
}
