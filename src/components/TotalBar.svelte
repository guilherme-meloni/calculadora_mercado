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
    padding-bottom: env(safe-area-inset-bottom, 16px);
    /* Fix para flicker no iOS Safari */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
  }

  .inner {
    margin: 0 16px;
    background: var(--surface);
    border: 2px solid var(--border2);
    border-radius: 26px;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 12px 40px rgba(194, 84, 110, 0.25);
    pointer-events: all;
    max-width: 440px;
    width: calc(100vw - 32px);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  @media (min-width: 768px) {
    .inner {
      max-width: 500px;
    }
  }

  .eye {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text3); margin-bottom: 2px;
  }
  .val {
    font-size: 28px; font-weight: 800;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    line-height: 1;
  }
  .meta { font-size: 12px; color: var(--text3); margin-top: 4px; font-variant-numeric: tabular-nums; font-weight: 700; }

  .right { display: flex; align-items: center; gap: 10px; }
  
  .btn-share {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    width: 46px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-share:active { transform: scale(0.9); background: var(--border); }

  .btn-finalize {
    background: var(--green);
    color: white;
    border: none;
    border-radius: 16px;
    padding: 0 24px;
    height: 46px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(107, 158, 107, 0.35);
    transition: all 0.2s;
  }
  .btn-finalize:active { transform: scale(0.96); box-shadow: 0 2px 8px rgba(107, 158, 107, 0.2); }

  .btn-clear {
    background: none;
    border: 1.5px solid var(--border2);
    border-radius: 14px;
    padding: 0 16px;
    height: 46px;
    color: var(--text3);
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-clear:active {
    border-color: var(--red);
    color: var(--red);
    background: rgba(248,113,113,0.07);
  }
</style>
