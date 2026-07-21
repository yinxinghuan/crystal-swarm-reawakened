type IconName = 'sound' | 'mute' | 'restart'

export default function LineIcon({ name }: { name: IconName }) {
  if (name === 'restart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 1.3 4.4M20 5v6h-6" /></svg>
  if (name === 'mute') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Zm12 0 5 5m0-5-5 5" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Zm12-1.5a5 5 0 0 1 0 7m2.5-10a9 9 0 0 1 0 13" /></svg>
}
