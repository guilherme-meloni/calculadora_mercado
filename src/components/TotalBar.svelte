<script>
  import { items, itemsActions, activeList, appStore } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'
  import { shareOnWhatsApp } from '../lib/shareUtils.js'

  $: total = $items.reduce((a, i) => a + i.preco * i.qty, 0)
  $: totalUnits = $items.reduce((a, i) => a + i.qty, 0)
  $: count = $items.length
  $: checkedCount = $items.filter(i => i.checked).length
  $: isTemplate = $activeList?.isTemplate || false

  async function handleFinalize() {
    if (await window.customConfirm('Deseja arquivar esta compra e enviá-la para o histórico?')) {
      appStore.archiveList($activeList.id)
    }
  }
</script>

<div class="bar">
  <div class="fade"></div>
  <div class="inner">
    <div>
      <div class="eye">Total estimado</div>
      <div class="val">{formatBRL(total)}</div>
      {#if !isTemplate}
        <div class="meta">
          {checkedCount} de {count} pegos · {totalUnits} un
        </div>
      {:else}
        <div class="meta">{totalUnits} unidades · {count} {count === 1 ? 'produto' : 'produtos'}</div>
      {/if}
    </div>

    <div class="right">
      {#if count > 0}
        <button class="btn-share" on:click={() => shareOnWhatsApp($activeList)} title="Compartilhar no WhatsApp">
          📤
        </button>
        {#if !isTemplate}
          <button class="btn-finalize" on:click={handleFinalize}>Finalizar</button>
        {:else}
          <button class="btn-clear" on:click={() => itemsActions.clear()}>Limpar</button>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
    /* Fix para flicker no iOS Safari */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
  .fade {
    height: 36px;
    background: linear-gradient(to top, var(--bg) 20%, transparent);
    width: 100%;
  }
  .inner {
    margin: 0 16px;
    margin-bottom: max(env(safe-area-inset-bottom), 16px);
    background: var(--surface);
    border: 1.5px solid var(--border2);
    border-radius: 22px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8px 32px rgba(194, 84, 110, 0.15);
    pointer-events: all;
    max-width: 480px;
    width: calc(100vw - 32px);
    /* Garante altura fixa para evitar flicker no resize de conteúdo */
    min-height: 82px;
  }
  
  /* Desktop adjustment for width */
  @media (min-width: 768px) {
    .inner {
      max-width: 800px;
    }
  }

  .eye {
    font-size: 9px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text3); margin-bottom: 2px;
  }
  .val {
    font-size: 26px; font-weight: 800;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    line-height: 1;
  }
  .meta { font-size: 11px; color: var(--text3); margin-top: 4px; font-variant-numeric: tabular-nums; font-weight: 600; }

  .right { display: flex; align-items: center; gap: 8px; }
  
  .btn-share {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-share:active { transform: scale(0.9); background: var(--border); }

  .btn-finalize {
    background: var(--green);
    color: white;
    border: none;
    border-radius: 14px;
    padding: 12px 20px;
    font-family: inherit;
    font-size: 14px; font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(107, 158, 107, 0.3);
    transition: all 0.2s;
  }
  .btn-finalize:active { transform: scale(0.96); opacity: 0.9; }

  .btn-clear {
    background: none;
    border: 1px solid var(--border2);
    border-radius: 11px;
    padding: 9px 14px;
    color: var(--text3);
    font-family: inherit;
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-clear:active {
    border-color: var(--red);
    color: var(--red);
    background: rgba(248,113,113,0.07);
  }
</style>
