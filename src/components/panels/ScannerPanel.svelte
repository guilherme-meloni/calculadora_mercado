<script>
  import { itemsActions, bottomSheetOpen } from '../../lib/store.js'
  import { buscarProduto, salvarProduto, registrarPreco } from '../../lib/productApi.js'
  import ProductLookupCard from '../ProductLookupCard.svelte'

  let buscando = false
  let produtoEncontrado = null
  let codigoAtual = ''
  let mostrarResultado = false
  let BarcodeScannerComp = null

  import('../BarcodeScanner.svelte').then(m => BarcodeScannerComp = m.default)

  async function aoEscanear(e) {
    codigoAtual = e.detail.codigo
    buscando = true
    produtoEncontrado = await buscarProduto(codigoAtual)
    buscando = false
    mostrarResultado = true
  }

  async function aoConfirmar(e) {
    const { produto, preco } = e.detail
    if (!produto.jaConhecido) await salvarProduto(produto)
    await registrarPreco(produto.codigo_barras, preco)
    itemsActions.add(produto.nome, preco, '🛒')
    bottomSheetOpen.set(false)
  }

  function escanearDeNovo() {
    mostrarResultado = false
    produtoEncontrado = null
    codigoAtual = ''
  }
</script>

{#if buscando}
  <p class="status">Procurando produto…</p>
{:else if mostrarResultado}
  <ProductLookupCard produto={produtoEncontrado} codigo={codigoAtual} on:confirmar={aoConfirmar} />
  <button class="btn-outro" on:click={escanearDeNovo}>↺ Escanear outro produto</button>
{:else}
  {#if BarcodeScannerComp}
    <svelte:component this={BarcodeScannerComp} on:scan={aoEscanear} />
  {:else}
    <p class="status">Carregando câmera…</p>
  {/if}
{/if}

<style>
  .status {
    text-align: center;
    padding: 24px;
    font-weight: 700;
    color: var(--text2);
  }
  .btn-outro {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    border-radius: var(--radius-lg);
    border: 1.5px solid var(--border);
    background: var(--surface);
    color: var(--text2);
    font-weight: 700;
  }
</style>
