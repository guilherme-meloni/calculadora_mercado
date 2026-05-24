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
          list.items = [{ id: uid, nome, preco, qty: 1, cat, checked: false }, ...list.items]
        }
        return { ...state }
      })
    },

    toggleItemChecked(itemId) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.map(i => 
            i.id === itemId ? { ...i, checked: !i.checked } : i
          )
        }
        return { ...state }
      })
    },

    editItemPrice(itemId, newPrice) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.map(i => 
            i.id === itemId ? { ...i, preco: newPrice } : i
          )
        }
        return { ...state }
      })
    },

    editItemQty(itemId, newQty) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          if (newQty < 1) {
            list.items = list.items.filter(i => i.id !== itemId)
          } else {
            list.items = list.items.map(i => 
              i.id === itemId ? { ...i, qty: newQty } : i
            )
          }
        }
        return { ...state }
      })
    },

    archiveList(id) {
      update(state => {
        const list = state.lists.find(l => l.id === id)
        if (list) {
          list.archived = true
        }
        // Se arquivou a lista ativa, muda para outra ou cria uma nova
        if (state.activeId === id) {
          const remaining = state.lists.filter(l => !l.archived)
          if (remaining.length > 0) {
            state.activeId = remaining[0].id
          } else {
            const newId = state.lists.reduce((max, l) => Math.max(max, l.id), 0) + 1
            const newList = { id: newId, name: 'Minha Lista', items: [], isTemplate: false }
            state.lists.push(newList)
            state.activeId = newId
          }
        }
        return { ...state }
      })
    },

    duplicateTemplateAsActive(templateId) {
      update(state => {
        const template = state.lists.find(l => l.id === templateId)
        if (template) {
          const newId = state.lists.reduce((max, l) => Math.max(max, l.id), 0) + 1
          const newList = {
            id: newId,
            name: `${template.name} (Cópia)`,
            isTemplate: false,
            items: template.items.map(i => ({ ...i, checked: false }))
          }
          return {
            ...state,
            lists: [newList, ...state.lists],
            activeId: newId
          }
        }
        return state
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
    createList(name, isTemplate = false) {
      update(state => {
        const newId = state.lists.reduce((max, l) => Math.max(max, l.id), 0) + 1
        const newList = { id: newId, name: name || `Lista ${newId}`, items: [], isTemplate }
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

export const activeList = derived(appStore, $state => {
  return $state.lists.find(l => l.id === $state.activeId)
})

// Derived para expor as funções de items (manter a interface items.add, etc)
export const itemsActions = {
  add: (nome, preco, cat) => appStore.addListItem(nome, preco, cat),
  changeQty: (id, delta) => appStore.changeQty(id, delta),
  remove: (id) => appStore.removeListItem(id),
  clear: () => appStore.clearCurrentList(),
  toggleChecked: (id) => appStore.toggleItemChecked(id),
  editPrice: (id, price) => appStore.editItemPrice(id, price),
  editQty: (id, qty) => appStore.editItemQty(id, qty)
}
