<script>
  import { onMount } from 'svelte'
  import { items, activeView } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'
  import { listarProdutos, buscarMediaMensal } from '../lib/productApi.js'
  import PriceChart from './PriceChart.svelte'

  $: totalEstimado = $items.reduce((a, i) => a + i.preco * i.qty, 0)
  $: ultimosItens = [...$items].slice(-3).reverse()

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
</script>

<div class="flex flex-col gap-4 pb-4">
  <div class="flex items-center justify-center gap-2 pt-1">
    <img src="/favicon.png" alt="MarketMallow" class="w-9 h-9 rounded-xl object-cover" />
    <h1 class="text-lg font-black text-text-main">MarketMallow</h1>
  </div>

  <div class="rounded-3xl bg-brand-primary text-white p-6 shadow-soft flex flex-col items-center gap-1">
    <span class="text-xs font-bold uppercase tracking-wider opacity-80">Total da compra atual</span>
    <span class="text-4xl font-black">{formatBRL(totalEstimado)}</span>
    <span class="text-xs font-bold opacity-80">{$items.length} ite{$items.length === 1 ? 'm' : 'ns'} na lista</span>
  </div>

  <div class="rounded-3xl bg-surface border border-border-soft shadow-soft p-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-black uppercase tracking-wider text-text-muted">Últimos itens</span>
      <button class="text-xs font-black text-brand-primary" on:click={() => activeView.set('calculadora')}>Ver todos</button>
    </div>
    {#if ultimosItens.length === 0}
      <p class="text-sm text-text-muted font-semibold py-2">Nenhum item ainda — toque no + para começar.</p>
    {:else}
      <ul class="flex flex-col gap-2">
        {#each ultimosItens as item (item.id)}
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-brand-secondary flex items-center justify-center text-base shrink-0">{item.cat}</span>
            <span class="flex-1 text-sm font-bold text-text-main truncate">{item.nome}</span>
            <span class="text-sm font-black text-brand-primary">{formatBRL(item.preco * item.qty)}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if destaqueProduto}
    <div class="rounded-3xl bg-surface border border-border-soft shadow-soft p-4">
      <p class="text-xs font-black uppercase tracking-wider text-text-muted mb-2">📈 Preço de {destaqueProduto.nome}</p>
      <PriceChart dados={destaqueHistorico} />
    </div>
  {/if}
</div>
