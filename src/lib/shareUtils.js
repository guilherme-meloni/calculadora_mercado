import { formatBRL } from './utils.js'

export function formatListForWhatsApp(list) {
  if (!list || !list.items.length) return ''

  const itemsByCategory = list.items.reduce((acc, item) => {
    const cat = item.cat || '🛒'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  let text = `🛒 *Lista: ${list.name}*\n━━━━━━━━━━━━━━━━━━\n\n`

  for (const [cat, items] of Object.entries(itemsByCategory)) {
    text += `${cat}\n`
    items.forEach(item => {
      const checkedMark = item.checked ? '✅ ' : ''
      const subtotal = item.preco * item.qty
      text += `  • ${checkedMark}${item.nome} (${item.qty}x) — ${formatBRL(item.preco)} = *${formatBRL(subtotal)}*\n`
    })
    text += '\n'
  }

  const totalUnits = list.items.reduce((a, i) => a + i.qty, 0)
  const totalGeral = list.items.reduce((a, i) => a + (i.preco * i.qty), 0)

  text += `━━━━━━━━━━━━━━━━━━\n`
  text += `📦 *Total de itens: ${totalUnits} unidades*\n`
  text += `💰 *Total: ${formatBRL(totalGeral)}*\n\n`
  text += `_Gerado pelo MarketMallow_ 🍬`

  return text
}

export function shareOnWhatsApp(list) {
  const text = formatListForWhatsApp(list)
  if (!text) return
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}
