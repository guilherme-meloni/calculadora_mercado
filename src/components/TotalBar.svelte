<script>
  import { items, itemsActions, activeList, appStore } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'
  import { shareOnWhatsApp } from '../lib/shareUtils.js'

  $: total = $items.reduce((a, i) => a + i.preco * i.qty, 0)
  $: count = $items.length
  $: checkedCount = $items.filter(i => i.checked).length
  $: isTemplate = $activeList?.isTemplate || false

  async function handleFinalize() {
    if (await window.customConfirm('Deseja arquivar esta compra e enviá-la para o histórico?')) {
      appStore.archiveList($activeList.id)
    }
  }
</script>

<div class="totalbar-wrap" role="region" aria-label="Resumo da compra" aria-live="polite">
  <div class="totalbar">

    <!-- Contador de itens -->
    <div class="tb-counter">
      <span class="tb-counter-val">{checkedCount}</span>
      <span class="tb-counter-of">de {count}</span>
    </div>

    <!-- Total central -->
    <div class="tb-total">
      <span class="tb-total-label">Total Estimado</span>
      <span class="tb-total-value">{formatBRL(total)}</span>
    </div>

    <!-- Ações -->
    <div class="tb-actions">
      {#if count > 0}
        <button class="tb-btn" on:click={() => shareOnWhatsApp($activeList)} aria-label="Compartilhar">
          📤
        </button>
        {#if !isTemplate}
          <button class="tb-btn tb-btn-primary" on:click={handleFinalize} aria-label="Finalizar">
            ✅
          </button>
        {:else}
          <button class="tb-btn" on:click={() => itemsActions.clear()} aria-label="Limpar">
            🧹
          </button>
        {/if}
      {/if}
    </div>

  </div>
</div>

<style>
.totalbar-wrap {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  padding: 10px 16px max(14px, env(safe-area-inset-bottom, 16px));
  z-index: 200;
  pointer-events: none;
}

.totalbar {
  max-width: 480px;
  margin: 0 auto;
  background: var(--surface);
  border: 2px solid var(--border2);
  border-radius: 28px;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: all;
  box-shadow: 0 8px 24px rgba(60, 32, 48, 0.12);
}

.tb-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
}
.tb-counter-val {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1;
}
.tb-counter-of {
  font-size: 0.65rem;
  color: var(--text3);
  font-weight: 700;
}

.tb-total {
  flex: 1;
  text-align: center;
}
.tb-total-label {
  display: block;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text3);
  font-weight: 800;
}
.tb-total-value {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.tb-actions {
  display: flex;
  gap: 8px;
}
.tb-btn {
  width: 42px; height: 42px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--text);
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.tb-btn:active { transform: scale(0.86); background: var(--border); }

.tb-btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(194, 84, 110, 0.3);
}
</style>
