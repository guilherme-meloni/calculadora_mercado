import { writable } from 'svelte/store'

const STORAGE_KEY = 'mercado_items'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function createItemsStore() {
  const { subscribe, set, update } = writable(loadItems())

  subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {}
  })

  let uid = loadItems().reduce((max, i) => Math.max(max, i.id), 0) + 1

  return {
    subscribe,

    add(nome, preco, cat) {
      update(items => [{ id: uid++, nome, preco, qty: 1, cat }, ...items])
    },

    changeQty(id, delta) {
      update(items =>
        items
          .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
          .filter(i => i.qty > 0)
      )
    },

    remove(id) {
      update(items => items.filter(i => i.id !== id))
    },

    clear() {
      set([])
    }
  }
}

export const items = createItemsStore()
