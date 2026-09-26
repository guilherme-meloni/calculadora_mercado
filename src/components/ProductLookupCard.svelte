<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { buscarMediaMensal } from '../lib/productApi.js'
  import { traduzirCategoria, traduzirAlergenos, nutriScoreValido } from '../lib/traducoes.js'
  import PriceChart from './PriceChart.svelte'
  export let produto = null   // resultado de buscarProduto()
  export let codigo = ''      // usado quando não achou nada, pra cadastro manual

  const dispatch = createEventDispatcher()
  let preco = ''
  let nomeManual = ''
  let catManual = ''
  let historico = []

  onMount(async () => {
    if (produto?.jaConhecido) {
      historico = await buscarMediaMensal(produto.codigo_barras)
    }
  })

  function confirmar() {
    if (!preco) return
    if (produto) {
      dispatch('confirmar', { produto, preco: parseFloat(preco) })
    } else {
      dispatch('confirmar', {
        produto: { codigo_barras: codigo, nome: nomeManual || 'Produto', categoria: catManual, fonte: 'manual' },
        preco: parseFloat(preco)
      })
    }
  }
</script>

<div class="lookup-card glass pop-in">
  {#if produto}
    <div class="topo">
      {#if produto.imagem_url}<img src={produto.imagem_url} alt="" />{/if}
      <div>
        <h3>{produto.nome}</h3>
        {#if produto.categoria}<span class="tag">{traduzirCategoria(produto.categoria)}</span>{/if}
        {#if produto.marca}<span class="tag">{produto.marca}</span>{/if}
      </div>
    </div>

    <div class="selos">
      {#if nutriScoreValido(produto.nutri_score)}<span class="selo nutri-{produto.nutri_score.toLowerCase()}">Nutri-Score {produto.nutri_score}</span>{/if}
      {#if produto.nova_group}<span class="selo">Grupo NOVA {produto.nova_group}</span>{/if}
    </div>

    {#if produto.alergenos}
      <p class="alergenos">⚠ Contém: {traduzirAlergenos(produto.alergenos)}</p>
    {/if}

    {#if produto.jaConhecido}
      <PriceChart dados={historico} />
    {/if}
  {:else}
    <p class="sem-produto">Não achei esse código nas bases. Cadastre manualmente:</p>
    <input class="campo" placeholder="Nome do produto" bind:value={nomeManual} />
    <input class="campo" placeholder="Categoria" bind:value={catManual} />
  {/if}

  <input class="campo preco" type="number" step="0.01" placeholder="Preço (R$)" bind:value={preco} />
  <button class="btn-confirmar" on:click={confirmar} disabled={!preco}>Adicionar à lista</button>
</div>

<style>
  .lookup-card { padding: 16px; border-radius: var(--radius-xl); }
  .topo { display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
  .topo img { width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover; }
  h3 { font-size: 17px; }
  .tag {
    display: inline-block; font-size: 11px; font-weight: 700; color: var(--text3);
    background: var(--surface2); border-radius: var(--radius-pill); padding: 2px 10px; margin: 2px 4px 0 0;
  }
  .selos { display: flex; gap: 6px; flex-wrap: wrap; margin: 8px 0; }
  .selo {
    font-size: 11px; font-weight: 900; padding: 3px 10px; border-radius: var(--radius-pill);
    background: var(--surface2); color: var(--text2);
  }
  .selo.nutri-a, .selo.nutri-b { background: var(--accent2); color: var(--surface); }
  .selo.nutri-d, .selo.nutri-e { background: var(--red); color: var(--surface); }
  .alergenos { font-size: 13px; color: var(--red); font-weight: 700; margin: 8px 0; }
  .sem-produto { font-size: 13px; color: var(--text3); margin-bottom: 10px; }
  .campo {
    width: 100%; padding: 12px; margin-top: 8px; border-radius: var(--radius-md);
    border: 1.5px solid var(--border); font-family: var(--font-main); font-size: 15px; background: var(--surface2);
  }
  .btn-confirmar {
    width: 100%; margin-top: 12px; padding: 14px; border-radius: var(--radius-lg); border: none;
    background: var(--green); color: var(--surface); font-weight: 900; font-size: 15px;
  }
  .btn-confirmar:disabled { opacity: 0.5; }
</style>
