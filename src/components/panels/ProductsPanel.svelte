<script>
  import { onMount } from 'svelte'
  import { formatBRL } from '../../lib/utils.js'
  import { listarProdutos, buscarMediaMensal, buscarHistorico, apagarPreco, apagarProduto, salvarProduto } from '../../lib/productApi.js'
  import { traduzirCategoria, traduzirAlergenos, nutriScoreValido } from '../../lib/traducoes.js'
  import PriceChart from '../PriceChart.svelte'

  let produtos = []
  let carregando = true
  let expandidoId = null
  let historicoPorCodigo = {}
  let historicoBrutoPorCodigo = {}
  let editando = false
  let form = {}

  onMount(recarregar)

  async function recarregar() {
    carregando = true
    produtos = await listarProdutos()
    carregando = false
  }

  async function toggle(codigo) {
    if (expandidoId === codigo) {
      expandidoId = null
      editando = false
      return
    }
    expandidoId = codigo
    editando = false
    historicoPorCodigo[codigo] = await buscarMediaMensal(codigo)
    historicoBrutoPorCodigo[codigo] = await buscarHistorico(codigo)
  }

  function abrirEdicao(p) {
    form = {
      codigo_barras: p.codigo_barras,
      nome: p.nome,
      categoria: p.categoria || '',
      marca: p.marca || '',
      alergenos: p.alergenos || '',
      nutri_score: p.nutri_score || '',
      fonte: p.fonte
    }
    editando = true
  }

  async function salvarEdicao() {
    await salvarProduto(form)
    editando = false
    await recarregar()
  }

  async function excluirProduto(codigo) {
    if (!confirm('Apagar esse produto e todo o histórico de preço dele? Não tem como desfazer.')) return
    await apagarProduto(codigo)
    expandidoId = null
    await recarregar()
  }

  async function excluirPreco(codigo, id) {
    await apagarPreco(codigo, id)
    historicoBrutoPorCodigo[codigo] = await buscarHistorico(codigo)
    historicoPorCodigo[codigo] = await buscarMediaMensal(codigo)
    produtos = await listarProdutos()
  }

  function formatarData(iso) {
    const [ano, mes, dia] = iso.split('-')
    return `${dia}/${mes}/${ano}`
  }
</script>

{#if carregando}
  <p class="status">Carregando…</p>
{:else if produtos.length === 0}
  <div class="empty-state">
    <span class="empty-emoji">📦</span>
    <p>Nenhum produto escaneado ainda.</p>
  </div>
{:else}
  <ul class="prod-list" role="list">
    {#each produtos as p (p.codigo_barras)}
      <li class="prod-item" class:expanded={expandidoId === p.codigo_barras}>
        <button class="prod-row" on:click={() => toggle(p.codigo_barras)} aria-expanded={expandidoId === p.codigo_barras}>
          <div class="prod-meta">
            <span class="prod-name">{p.nome}</span>
            <span class="prod-sub">{traduzirCategoria(p.categoria) || 'sem categoria'} · {p.qtd_registros} registro{p.qtd_registros === 1 ? '' : 's'}</span>
          </div>
          {#if p.ultimo_preco}<span class="prod-preco">{formatBRL(p.ultimo_preco)}</span>{/if}
          <span class="prod-chevron" aria-hidden="true">{expandidoId === p.codigo_barras ? '▲' : '▼'}</span>
        </button>

        {#if expandidoId === p.codigo_barras}
          <div class="prod-detail">
            {#if editando}
              <div class="edit-form">
                <label>Nome<input bind:value={form.nome} /></label>
                <label>Categoria<input bind:value={form.categoria} placeholder="ex: Laticínios" /></label>
                <label>Marca<input bind:value={form.marca} /></label>
                <label>Alergênicos <span class="hint">(separados por vírgula)</span><input bind:value={form.alergenos} placeholder="ex: leite, soja" /></label>
                <label>Nutri-Score
                  <select bind:value={form.nutri_score}>
                    <option value="">—</option>
                    {#each ['A','B','C','D','E'] as letra}<option value={letra}>{letra}</option>{/each}
                  </select>
                </label>
                <div class="edit-botoes">
                  <button class="btn-cancelar-edit" on:click={() => editando = false}>Cancelar</button>
                  <button class="btn-salvar-edit" on:click={salvarEdicao}>Salvar</button>
                </div>
              </div>
            {:else}
              {#if p.marca}<p class="prod-detail-line">Marca: {p.marca}</p>{/if}
              {#if nutriScoreValido(p.nutri_score)}<p class="prod-detail-line">Nutri-Score: {p.nutri_score}</p>{/if}
              {#if p.alergenos}<p class="prod-detail-line alerta">⚠ Contém: {traduzirAlergenos(p.alergenos)}</p>{/if}

              <PriceChart dados={historicoPorCodigo[p.codigo_barras] || []} />

              {#if historicoBrutoPorCodigo[p.codigo_barras]?.length}
                <ul class="historico-lista">
                  {#each historicoBrutoPorCodigo[p.codigo_barras] as h (h.id)}
                    <li class="historico-item">
                      <span>{formatarData(h.data)}</span>
                      <span class="historico-preco">{formatBRL(h.preco)}</span>
                      <button class="btn-apagar-preco" on:click={() => excluirPreco(p.codigo_barras, h.id)} aria-label="Apagar esse registro de preço">🗑</button>
                    </li>
                  {/each}
                </ul>
              {/if}

              <div class="acoes-produto">
                <button class="btn-editar" on:click={() => abrirEdicao(p)}>✏️ Editar dados</button>
                <button class="btn-excluir" on:click={() => excluirProduto(p.codigo_barras)}>🗑 Apagar produto</button>
              </div>
            {/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .status { text-align: center; padding: 24px; font-weight: 700; color: var(--text2); }
  .prod-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .prod-item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(60, 32, 48, 0.04);
  }
  .prod-item.expanded { border-color: var(--border2); }
  .prod-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
  }
  .prod-row:active { background: var(--surface2); }
  .prod-meta { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .prod-name { font-size: 0.9rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prod-sub { font-size: 0.72rem; color: var(--text3); }
  .prod-preco { font-size: 0.95rem; font-weight: 900; color: var(--accent); flex-shrink: 0; font-variant-numeric: tabular-nums; }
  .prod-chevron { font-size: 0.65rem; color: var(--text3); flex-shrink: 0; }
  .prod-detail { padding: 0 14px 14px; border-top: 1px dashed var(--border); background: var(--surface2); }
  .prod-detail-line { font-size: 0.8rem; color: var(--text2); margin: 10px 0 0; font-weight: 600; }
  .prod-detail-line.alerta { color: var(--red); }
  .empty-state { text-align: center; padding: 32px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .empty-emoji { font-size: 2.5rem; }
  .empty-state p { color: var(--text3); font-weight: 600; }

  .historico-lista { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto; }
  .historico-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.78rem; color: var(--text2);
    background: var(--surface); border-radius: var(--radius-sm, 8px); padding: 6px 8px;
  }
  .historico-item span:first-child { flex: 1; }
  .historico-preco { font-weight: 800; font-variant-numeric: tabular-nums; }
  .btn-apagar-preco { background: none; border: none; cursor: pointer; font-size: 0.85rem; opacity: 0.6; padding: 2px 4px; }
  .btn-apagar-preco:active { opacity: 1; }

  .acoes-produto { display: flex; gap: 8px; margin-top: 12px; }
  .btn-editar, .btn-excluir {
    flex: 1; padding: 10px; border-radius: var(--radius-md); font-weight: 700; font-size: 0.78rem;
    border: 1.5px solid var(--border); background: var(--surface); color: var(--text2); cursor: pointer;
  }
  .btn-excluir { color: var(--red); border-color: var(--red); }

  .edit-form { display: flex; flex-direction: column; gap: 10px; padding-top: 10px; }
  .edit-form label { display: flex; flex-direction: column; gap: 4px; font-size: 0.75rem; font-weight: 700; color: var(--text2); }
  .edit-form .hint { font-weight: 500; color: var(--text3); }
  .edit-form input, .edit-form select {
    padding: 10px; border-radius: var(--radius-sm, 8px); border: 1.5px solid var(--border);
    font-family: inherit; font-size: 0.85rem; background: var(--surface);
  }
  .edit-botoes { display: flex; gap: 8px; margin-top: 4px; }
  .btn-cancelar-edit, .btn-salvar-edit {
    flex: 1; padding: 10px; border-radius: var(--radius-md); font-weight: 800; font-size: 0.8rem; cursor: pointer;
  }
  .btn-cancelar-edit { border: 1.5px solid var(--border); background: var(--surface); color: var(--text2); }
  .btn-salvar-edit { border: none; background: var(--accent); color: var(--surface); }
</style>
