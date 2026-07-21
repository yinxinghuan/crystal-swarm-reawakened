type Locale = 'zh' | 'en'
type Key = 'title' | 'hint' | 'bloom' | 'restart' | 'mute' | 'unmute' | 'fallback' | 'retry'

const copy: Record<Key, Record<Locale, string>> = {
  title: { zh: 'CRYSTAL SWARM', en: 'CRYSTAL SWARM' },
  hint: { zh: '划过黑暗，唤醒晶体', en: 'Trace the dark. Wake the crystals.' },
  bloom: { zh: '留住这一刻', en: 'Hold this moment' },
  restart: { zh: '重新生成', en: 'Regenerate' },
  mute: { zh: '静音', en: 'Mute' },
  unmute: { zh: '开启声音', en: 'Enable sound' },
  fallback: { zh: '此设备无法点亮晶体', en: 'This device cannot light the crystals.' },
  retry: { zh: '再试一次', en: 'Try again' },
}

function locale(): Locale {
  const chosen = localStorage.getItem('game_locale')
  if (chosen === 'en' || chosen === 'zh') return chosen
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const t = (key: Key) => copy[key][locale()]
