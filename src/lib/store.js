import { writable, derived } from 'svelte/store'

const STORAGE_KEY = 'mercado_app_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      // Migração se necessário ou retorno básico
      if (data.lists && data.activeId) return data
    }
  } catch {}
  
  // Default inicial
  return {
    activeId: 1,
    lists: [
      { id: 1, name: 'Minha Lista', items: [] }
    ]
  }
}

function createAppStore() {
  const { subscribe, set, update } = writable(loadData())

  subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {}
  })

  return {
    subscribe,
    
    addListItem(nome, preco, cat) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          const uid = list.items.reduce((max, i) => Math.max(max, i.id), 0) + 1
          list.items = [{ id: uid, nome, preco, qty: 1, cat }, ...list.items]
        }
        return { ...state }
      })
    },

    changeQty(id, delta) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items
            .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
            .filter(i => i.qty > 0)
        }
        return { ...state }
      })
    },

    removeListItem(id) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.filter(i => i.id !== id)
        }
        return { ...state }
      })
    },

    clearCurrentList() {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) list.items = []
        return { ...state }
      })
    },

    // List Management
    createList(name) {
      update(state => {
        const newId = state.lists.reduce((max, l) => Math.max(max, l.id), 0) + 1
        const newList = { id: newId, name: name || `Lista ${newId}`, items: [] }
        return {
          ...state,
          lists: [newList, ...state.lists],
          activeId: newId
        }
      })
    },

    switchList(id) {
      update(state => ({ ...state, activeId: id }))
    },

    deleteList(id) {
      update(state => {
        const newLists = state.lists.filter(l => l.id !== id)
        if (newLists.length === 0) {
          const defaultList = { id: 1, name: 'Minha Lista', items: [] }
          return { activeId: 1, lists: [defaultList] }
        }
        let nextActiveId = state.activeId
        if (state.activeId === id) {
          nextActiveId = newLists[0].id
        }
        return { ...state, lists: newLists, activeId: nextActiveId }
      })
    },

    renameList(id, newName) {
      update(state => {
        const list = state.lists.find(l => l.id === id)
        if (list) list.name = newName
        return { ...state }
      })
    }
  }
}

export const appStore = createAppStore()

// Derived store para os itens da lista ativa (compatibilidade com componentes existentes)
export const items = derived(appStore, $state => {
  const activeList = $state.lists.find(l => l.id === $state.activeId)
  return activeList ? activeList.items : []
})

// Derived para expor as funções de items (manter a interface items.add, etc)
export const itemsActions = {
  add: (nome, preco, cat) => appStore.addListItem(nome, preco, cat),
  changeQty: (id, delta) => appStore.changeQty(id, delta),
  remove: (id) => appStore.removeListItem(id),
  clear: () => appStore.clearCurrentList()
}
