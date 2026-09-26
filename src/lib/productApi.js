// Fala com a API própria (histórico) e com as APIs externas (Open Food/Beauty Facts, Open Library)
const MINHA_API = import.meta.env.VITE_MERCADO_API_URL || '/api'

function isLivro(codigo) {
  return codigo.startsWith('978') || codigo.startsWith('979')
}

// 1. Tenta achar na sua própria base primeiro (rápido, sem depender de rede externa)
export async function buscarNaMinhaApi(codigo) {
  try {
    const res = await fetch(`${MINHA_API}/produto/${codigo}`)
    if (res.ok) return await res.json()
  } catch { /* servidor fora do ar ou sem rede — segue o fluxo */ }
  return null
}

// 2a. Open Food Facts / Open Beauty Facts
async function buscarNaOpenFoodFacts(codigo) {
  const tentativas = [
    `https://world.openfoodfacts.org/api/v2/product/${codigo}.json`,
    `https://world.openbeautyfacts.org/api/v2/product/${codigo}.json`
  ]
  for (const url of tentativas) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'MarketMallow - App pessoal' } })
      const json = await res.json()
      if (json.status === 1 && json.product) {
        const p = json.product
        return {
          codigo_barras: codigo,
          nome: p.product_name || p.product_name_pt || 'Produto sem nome',
          categoria: (p.categories_tags?.[0] || '').replace(/^\w\w:/, ''),
          marca: p.brands || null,
          imagem_url: p.image_front_url || p.image_url || null,
          nutri_score: (p.nutriscore_grade || '').toUpperCase() || null,
          nova_group: p.nova_group ? String(p.nova_group) : null,
          alergenos: (p.allergens_tags || []).map(a => a.replace(/^\w\w:/, '')).join(', ') || null,
          origem: p.countries || null,
          fonte: url.includes('beauty') ? 'openbeautyfacts' : 'openfoodfacts'
        }
      }
    } catch { /* tenta a próxima */ }
  }
  return null
}

// 2b. Google Books / Open Library — só entra em jogo pra ISBN (prefixo 978/979)
async function buscarLivro(codigo) {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${codigo}&format=json&jscmd=data`)
    const json = await res.json()
    const livro = json[`ISBN:${codigo}`]
    if (livro) {
      return {
        codigo_barras: codigo,
        nome: livro.title,
        categoria: 'Livro',
        marca: livro.publishers?.[0]?.name || null,
        imagem_url: livro.cover?.medium || null,
        origem: (livro.publish_places?.[0]?.name) || null,
        fonte: 'openlibrary'
      }
    }
  } catch { /* sem sorte, segue pro cadastro manual */ }
  return null
}

// Fluxo completo: própria base -> externa (OFF/OBF ou Open Library, pelo prefixo) -> null = cadastro manual
export async function buscarProduto(codigo) {
  const local = await buscarNaMinhaApi(codigo)
  if (local) return { ...local, jaConhecido: true }

  const externo = isLivro(codigo) ? await buscarLivro(codigo) : await buscarNaOpenFoodFacts(codigo)
  if (externo) return { ...externo, jaConhecido: false }

  return null
}

export async function salvarProduto(produto) {
  await fetch(`${MINHA_API}/produto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  })
}

export async function registrarPreco(codigo, preco) {
  const dataCelular = new Date().toISOString().slice(0, 10) // pega a data do próprio aparelho
  await fetch(`${MINHA_API}/produto/${codigo}/preco`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preco, data: dataCelular })
  })
}

export async function listarProdutos() {
  try {
    const res = await fetch(`${MINHA_API}/produtos`)
    if (res.ok) return await res.json()
  } catch { /* sem rede ou servidor fora do ar */ }
  return []
}

export async function buscarHistorico(codigo) {
  try {
    const res = await fetch(`${MINHA_API}/produto/${codigo}/historico`)
    if (res.ok) return await res.json()
  } catch { /* sem rede */ }
  return []
}

export async function apagarPreco(codigo, id) {
  await fetch(`${MINHA_API}/produto/${codigo}/preco/${id}`, { method: 'DELETE' })
}

export async function apagarProduto(codigo) {
  await fetch(`${MINHA_API}/produto/${codigo}`, { method: 'DELETE' })
}

export async function buscarMediaMensal(codigo) {
  try {
    const res = await fetch(`${MINHA_API}/produto/${codigo}/media-mensal`)
    if (res.ok) return await res.json()
  } catch { /* sem rede */ }
  return []
}
