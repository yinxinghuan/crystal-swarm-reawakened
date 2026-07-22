import { useEffect, useState } from 'react'
import LineIcon from './components/LineIcon'
import { useCrystalSwarm } from './hooks/useCrystalSwarm'
import { t } from './i18n'
import './CrystalSwarmReawakened.less'

function GhostFinger() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11.2V7.5a2.5 2.5 0 1 1 5 0v3.7a4.5 4.5 0 0 0 2-3.7 4.5 4.5 0 0 0-9 0c0 1.6.8 2.9 2 3.7Zm9.8 4.7-4.5-2.3a1.4 1.4 0 0 0-.6-.1H13v-6a1.5 1.5 0 0 0-3 0v10.7l-3.4-.7a1.1 1.1 0 0 0-1 .3l-.8.8 4.9 4.9c.3.3.7.4 1.1.4h6.8c.7 0 1.3-.5 1.4-1.3l.8-5.2a1.5 1.5 0 0 0-1-1.5Z"/></svg>
}

export default function CrystalSwarmReawakened() {
  const game = useCrystalSwarm()
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    if (game.hintDismissed) {
      const timer = window.setTimeout(() => setShowHint(false), 280)
      return () => window.clearTimeout(timer)
    }
  }, [game.hintDismissed])

  useEffect(() => {
    if (game.phase === 'idle') setShowHint(true)
  }, [game.phase])

  if (!game.supported) {
    return <main className="csr csr--fallback">
      <div className="csr__fallback-crystal" aria-hidden="true" />
      <h1>{t('title')}</h1>
      <p>{t('fallback')}</p>
      <button className="csr__fallback-retry" onPointerDown={game.reset}>{t('retry')}</button>
    </main>
  }

  return (
    <main className={`csr csr--${game.phase}`}>
      <div
        ref={game.shellRef}
        className="csr__stage"
        onPointerDown={game.onPointerDown}
        onPointerMove={game.onPointerMove}
        onPointerUp={game.onPointerUp}
        onPointerCancel={game.onPointerUp}
      >
        <canvas ref={game.canvasRef} className="csr__canvas" aria-label={t('hint')} />
        <header className="csr__header">
          <p className="csr__eyebrow">EXPERIMENT / 01</p>
          <h1>{t('title')}</h1>
        </header>
        <button
          className="csr__icon-button csr__mute"
          type="button"
          onPointerDown={(event) => { event.stopPropagation(); game.toggleMuted() }}
          aria-label={game.muted ? t('unmute') : t('mute')}
          title={game.muted ? t('unmute') : t('mute')}
        >
          <LineIcon name={game.muted ? 'mute' : 'sound'} />
        </button>
        <button
          className="csr__icon-button csr__restart"
          type="button"
          onPointerDown={(event) => { event.stopPropagation(); game.reset() }}
          aria-label={t('restart')}
          title={t('restart')}
        >
          <LineIcon name="restart" />
        </button>
        {showHint && <div className="csr__demo" aria-hidden="true">
          <svg className="csr__demo-path" viewBox="0 0 220 180"><path d="M64 115 C72 67 133 50 161 84 C183 111 153 143 105 133" /></svg>
          <div className="csr__demo-finger"><span className="csr__demo-ripple" /><GhostFinger /></div>
          <p className="csr__hint">{t('hint')}</p>
        </div>}
        {game.phase === 'awaken' && game.awakened >= 8 && game.awakened < 42 && <p className="csr__count">{game.awakened} <span>/ 42</span></p>}
        {game.phase === 'bloom' && <p className="csr__bloom-copy">{t('bloom')}</p>}
        <p className="csr__signature">REAWAKENED</p>
      </div>
    </main>
  )
}
