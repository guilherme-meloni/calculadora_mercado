<script>
  import { onMount } from 'svelte'
  import { activeList, items, activeView, bottomSheetContent, bottomSheetOpen } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'
  import { listarProdutos, buscarMediaMensal } from '../lib/productApi.js'
  import PriceChart from './PriceChart.svelte'

  $: totalItens = $items.length
  $: totalEstimado = $items.reduce((a, i) => a + i.preco * i.qty, 0)

  let destaqueProduto = null
  let destaqueHistorico = []

  onMount(async () => {
    const produtos = await listarProdutos()
    const comHistorico = produtos.find(p => p.qtd_registros > 1)
    if (comHistorico) {
      destaqueProduto = comHistorico
      destaqueHistorico = await buscarMediaMensal(comHistorico.codigo_barras)
    }
  })

  function abrirPainel(nome) {
    bottomSheetContent.set(nome)
    bottomSheetOpen.set(true)
  }

  const cards = [
    { key: 'calculadora', icon: '🛒', label: 'Calculadora',   desc: `Adicionar produto · ${totalItens} ite${totalItens === 1 ? 'm' : 'ns'}`, action: () => activeView.set('calculadora') },
    { key: 'history',     icon: '🕐', label: 'Histórico',     desc: 'Compras finalizadas', action: () => abrirPainel('history') },
    { key: 'products',    icon: '📦', label: 'Dados da API',  desc: 'Produtos escaneados', action: () => abrirPainel('products') },
    { key: 'templates',   icon: '⭐', label: 'Templates',     desc: 'Modelos de lista', action: () => abrirPainel('templates') },
    { key: 'import',      icon: '📥', label: 'Importar Lista', desc: 'Colar texto/IA', action: () => window.dispatchEvent(new CustomEvent('open-import')) },
  ]
</script>

<div class="home">
  <div class="home-logo">
    <img src="/favicon.png" alt="MarketMallow" class="home-logo-img" />
    <h1>MarketMallow</h1>
  </div>

  <div class="home-stats glass">
    <div class="stat">
      <span class="stat-value">{totalItens}</span>
      <span class="stat-label">itens na lista</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
      <span class="stat-value">{formatBRL(totalEstimado)}</span>
      <span class="stat-label">total estimado</span>
    </div>
  </div>

  {#if destaqueProduto}
    <div class="home-destaque glass">
      <p class="destaque-titulo">📈 Preço de {destaqueProduto.nome}</p>
      <PriceChart dados={destaqueHistorico} />
    </div>
  {/if}

  <div class="home-grid">
    {#each cards as c}
      <button class="home-card" on:click={c.action}>
        <span class="home-card-icon">{c.icon}</span>
        <span class="home-card-label">{c.label}</span>
        <span class="home-card-desc">{c.desc}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .home { display: flex; flex-direction: column; gap: 16px; padding-bottom: 20px; }

  .home-logo { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px 0 4px; }
  .home-logo-img { width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover; }
  .home-logo h1 { font-size: 1.5rem; font-weight: 900; color: var(--text); margin: 0; }

  .home-stats {
    display: flex; align-items: center;
    border-radius: var(--radius-xl);
    padding: 18px;
  }
  .stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .stat-value { font-size: 1.4rem; font-weight: 900; color: var(--accent); font-variant-numeric: tabular-nums; }
  .stat-label { font-size: 0.72rem; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-divider { width: 1.5px; height: 34px; background: var(--border); }

  .home-destaque { border-radius: var(--radius-xl); padding: 16px; }
  .destaque-titulo { font-size: 0.85rem; font-weight: 800; color: var(--text2); margin: 0 0 6px; }

  .home-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .home-card {
    display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(60, 32, 48, 0.05);
    font-family: inherit;
  }
  .home-card:active { transform: scale(0.96); background: var(--surface2); }
  .home-card-icon { font-size: 1.7rem; margin-bottom: 4px; }
  .home-card-label { font-size: 0.95rem; font-weight: 800; color: var(--text); }
  .home-card-desc { font-size: 0.72rem; color: var(--text3); font-weight: 600; }

  @media (min-width: 480px) {
    .home-grid { grid-template-columns: 1fr 1fr 1fr; }
  }
</style>
