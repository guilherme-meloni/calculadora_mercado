<script>
  export let dados = []   // [{ mes: '2026-08', media: 5.4, amostras: 3 }, ...]

  $: max = Math.max(...dados.map(d => d.media), 0.01)
  $: min = Math.min(...dados.map(d => d.media), 0)
  $: pontos = dados.map((d, i) => {
    const x = dados.length > 1 ? (i / (dados.length - 1)) * 260 + 20 : 150
    const y = 110 - ((d.media - min) / (max - min || 1)) * 90
    return { x, y, ...d }
  })
  $: linha = pontos.map(p => `${p.x},${p.y}`).join(' ')
  $: mediaGeral = dados.length ? (dados.reduce((s, d) => s + d.media, 0) / dados.length).toFixed(2) : null
</script>

<div class="chart-card glass">
  {#if dados.length === 0}
    <p class="vazio">Ainda sem histórico de preço pra esse produto.</p>
  {:else}
    {#if mediaGeral}<p class="media-geral">Média real: <strong>R$ {mediaGeral}</strong></p>{/if}
    <svg viewBox="0 0 300 130" class="grafico">
      <polyline points={linha} fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      {#each pontos as p}
        <circle cx={p.x} cy={p.y} r="4" fill="var(--accent2)" stroke="var(--surface)" stroke-width="1.5" />
      {/each}
    </svg>
    <div class="eixo">
      {#each pontos as p}
        <span>{p.mes.slice(5)}/{p.mes.slice(2,4)}</span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .chart-card { padding: 16px; border-radius: var(--radius-xl); }
  .vazio { font-size: 13px; color: var(--text3); text-align: center; padding: 12px 0; }
  .media-geral { font-size: 14px; color: var(--text2); margin-bottom: 4px; }
  .media-geral strong { color: var(--accent); font-size: 18px; }
  .grafico { width: 100%; height: auto; }
  .eixo { display: flex; justify-content: space-between; font-size: 10px; color: var(--text3); padding: 0 4px; }
</style>
