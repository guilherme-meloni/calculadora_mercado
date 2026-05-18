<script>
  import { items } from '../lib/store.js'
  import ItemRow from './ItemRow.svelte'
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
  <div class="sec">Lista de compras</div>
  <div class="list">
    {#each $items as item (item.id)}
      <ItemRow {item} />
    {/each}
  </div>
{/if}

<style>
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
