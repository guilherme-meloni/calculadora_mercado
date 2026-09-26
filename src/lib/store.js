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
            const newList = { id: newId, name: 'Minha Lista', items: [], isTemplate: false, archived: false }
            state.lists.push(newList)
            state.activeId = newId
          }
        }
        return { ...state }
      })
    },

    reopenList(id) {
      update(state => {
        const list = state.lists.find(l => l.id === id)
        if (list) {
          list.archived = false
          state.activeId = id
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
    },

    editItem(id, newData) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.map(i => 
            i.id === id ? { ...i, ...newData } : i
          )
        }
        return { ...state }
      })
    },

    importItems(text) {
      update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (!list) return state

        const lines = text.split('\n')
        const newItems = []
        let lastId = list.items.reduce((max, i) => Math.max(max, i.id), 0)

        lines.forEach(line => {
          if (!line.trim() || !line.includes(';')) return
          
          const parts = line.split(';').map(p => p.trim())
          const nome = parts[0]
          if (!nome) return

          // Pega os outros dois valores (pode ser preco/qty ou qty/preco)
          let v1 = parts[1] || '0'
          let v2 = parts[2] || '1'

          // Função para limpar e converter número
          const cleanNum = (s) => parseFloat(s.replace('R$', '').replace(/\s/g, '').replace(',', '.')) || 0

          let n1 = cleanNum(v1)
          let n2 = cleanNum(v2)

          let preco = 0
          let qty = 1

          // Lógica Inteligente de Detecção:
          // 1. Se um tem vírgula/ponto e o outro não, o decimal é o preço
          const hasDecimal1 = v1.includes(',') || v1.includes('.')
          const hasDecimal2 = v2.includes(',') || v2.includes('.')

          if (hasDecimal1 && !hasDecimal2) {
            preco = n1; qty = n2;
          } else if (hasDecimal2 && !hasDecimal1) {
            preco = n2; qty = n1;
          } else if (v1.includes('R$')) {
            preco = n1; qty = n2;
          } else if (v2.includes('R$')) {
            preco = n2; qty = n1;
          } else {
            // Se ambos forem parecidos, assume o padrão: Nome; Preço; Qtd
            preco = n1; qty = n2;
          }

          // Segurança para quantidade
          if (qty <= 0) qty = 1

          lastId++
          newItems.push({
            id: lastId,
            nome,
            preco: preco,
            qty: qty,
            cat: '🛒',
            checked: false
          })
        })

        list.items = [...newItems, ...list.items]
        return { ...state }
      })
    }
  }
}

export const appStore = createAppStore()

// Navegação e UI
export const activeView = writable('home') // 'home' | 'calculadora' (calculadora = adicionar + ver o carrinho, junto)
export const sortOrder = writable('default') // 'default' | 'name' | 'price-asc' | 'price-desc'
export const bottomSheetOpen = writable(false)
export const bottomSheetContent = writable(null) // 'lists' | 'templates' | 'history'
export const ultimoAdicionado = writable(null) // { nome, ts } — pra mostrar aviso na Calculadora

// Derived store para os itens da lista ativa (compatibilidade com componentes existentes)
export const items = derived([appStore, sortOrder], ([$state, $sort]) => {
  const activeList = $state.lists.find(l => l.id === $state.activeId)
  if (!activeList) return []
  
  let listItems = [...activeList.items]
  
  if ($sort === 'name') {
    listItems.sort((a, b) => a.nome.localeCompare(b.nome))
  } else if ($sort === 'price-asc') {
    listItems.sort((a, b) => (a.preco * a.qty) - (b.preco * b.qty))
  } else if ($sort === 'price-desc') {
    listItems.sort((a, b) => (b.preco * b.qty) - (a.preco * a.qty))
  }
  
  return listItems
})

export const activeList = derived(appStore, $state => {
  return $state.lists.find(l => l.id === $state.activeId)
})

// Derived para expor as funções de items (manter a interface items.add, etc)
export const itemsActions = {
  add: (nome, preco, cat) => {
    appStore.addListItem(nome, preco, cat)
    ultimoAdicionado.set({ nome, ts: Date.now() })
  },
  changeQty: (id, delta) => appStore.changeQty(id, delta),
  remove: (id) => appStore.removeListItem(id),
  clear: () => appStore.clearCurrentList(),
  toggleChecked: (id) => appStore.toggleItemChecked(id),
  editPrice: (id, price) => appStore.editItemPrice(id, price),
  editQty: (id, qty) => appStore.editItemQty(id, qty)
}
