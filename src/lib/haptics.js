// Vibration API — feedback tátil pro uso no mercado, com uma mão só.
// Sempre confere se a API existe antes de usar, pra não quebrar no iOS/desktop.
import { writable } from 'svelte/store'

const CHAVE_STORAGE = 'mercado-calc:haptics-enabled'

function lerPreferenciaSalva() {
  try {
    const v = localStorage.getItem(CHAVE_STORAGE)
    return v === null ? true : v === 'true' // ligado por padrão
  } catch {
    return true
  }
}

function criarHapticsEnabledStore() {
  const { subscribe, set, update } = writable(lerPreferenciaSalva())

  return {
    subscribe,
    set: (valor) => {
      try { localStorage.setItem(CHAVE_STORAGE, String(valor)) } catch { /* ignora */ }
      set(valor)
    },
    toggle: () => update(v => {
      const novo = !v
      try { localStorage.setItem(CHAVE_STORAGE, String(novo)) } catch { /* ignora */ }
      return novo
    })
  }
}

export const hapticsEnabled = criarHapticsEnabledStore()

let habilitadoAtual = lerPreferenciaSalva()
hapticsEnabled.subscribe(v => habilitadoAtual = v)

function podeVibrar() {
  return habilitadoAtual && typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function'
}

function vibrar(padrao) {
  if (!podeVibrar()) return
  try { window.navigator.vibrate(padrao) } catch { /* alguns navegadores lançam em contexto inválido */ }
}

export function lightTap() { vibrar(10) }
export function success() { vibrar([30, 50, 30]) }
export function error() { vibrar([100, 50, 100]) }
export function deletar() { vibrar(50) }
