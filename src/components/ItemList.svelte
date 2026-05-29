<script>
  import { items, activeList, sortOrder } from '../lib/store.js'
  import ItemRow from './ItemRow.svelte'

  $: isTemplate = $activeList?.isTemplate || false
</script>

{#if $items.length === 0}
  <div class="empty">
    <div class="empty-icon">🧺</div>
    <div class="empty-title">Carrinho vazio</div>
    <div class="empty-sub">
      Adicione produtos acima.<br>Use Enter para adicionar rápido.
    </div>
  </div>
{:else}
  <div class="list-header">
    <div class="sec">{$activeList?.name || 'Lista de compras'}</div>
    
    <div class="sort-box">
      <select bind:value={$sortOrder} class="sort-select">
        <option value="default">Padrão</option>
        <option value="name">Alfabética</option>
        <option value="price-desc">R$ Maior</option>
        <option value="price-asc">R$ Menor</option>
      </select>
    </div>
  </div>

  <div class="list">
    {#each $items as item (item.id)}
      <ItemRow {item} {isTemplate} />
    {/each}
  </div>
{/if}

<style>
  .list-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 2px 16px 10px;
    gap: 12px;
  }

  .sec {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text3);
    padding-bottom: 4px;
  }
  .sec::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .sort-box {
    margin-bottom: 2px;
  }

  .sort-select {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 4px 8px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 800;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sort-select:focus { border-color: var(--accent); }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    gap: 10px;
  }
  .empty-icon {
    width: 68px; height: 68px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin-bottom: 6px;
  }
  .empty-title { font-size: 16px; font-weight: 700; color: var(--text2); }
  .empty-sub { font-size: 13px; color: var(--text3); text-align: center; line-height: 1.6; }

  .sec {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 20px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text3);
  }
  .sec::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px;
  }
</style>
