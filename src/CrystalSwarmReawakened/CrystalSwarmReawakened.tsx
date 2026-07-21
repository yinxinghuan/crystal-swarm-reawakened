import { useEffect, useState } from 'react'
import LineIcon from './components/LineIcon'
import { useCrystalSwarm } from './hooks/useCrystalSwarm'
import { t } from './i18n'
import './CrystalSwarmReawakened.less'

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
        {showHint && <p className="csr__hint">{t('hint')}</p>}
        {game.phase === 'awaken' && game.awakened >= 8 && game.awakened < 42 && <p className="csr__count">{game.awakened} <span>/ 42</span></p>}
        {game.phase === 'bloom' && <p className="csr__bloom-copy">{t('bloom')}</p>}
        <p className="csr__signature">REAWAKENED</p>
      </div>
    </main>
  )
}
