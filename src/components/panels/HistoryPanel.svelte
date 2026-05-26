<script>
  import { appStore, bottomSheetOpen } from '../../lib/store.js';
  import { formatBRL } from '../../lib/utils.js';

  let expandedId = null;

  $: archivedLists = $appStore.lists.filter(l => l.archived);

  function toggle(id) {
    expandedId = expandedId === id ? null : id;
  }

  function reopen(list) {
    appStore.reopenList(list.id);
    bottomSheetOpen.set(false);
  }

  async function deleteHistory(id) {
    if (await window.customConfirm('Remover esta compra do histórico permanentemente?')) {
      appStore.deleteList(id);
    }
  }

  function formatDate(iso) {
    if (!iso) return 'Recentemente';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));
  }

  function getListTotal(list) {
    return list.items.reduce((a, i) => a + i.preco * i.qty, 0);
  }
</script>

{#if archivedLists.length === 0}
  <div class="empty-state">
    <span class="empty-emoji">🛒</span>
    <p>Nenhuma compra finalizada ainda.</p>
  </div>
{:else}
  <ul class="history-list" role="list">
    {#each archivedLists as list (list.id)}
      <li class="history-item" class:expanded={expandedId === list.id}>

        <button
          class="history-row"
          on:click={() => toggle(list.id)}
          aria-expanded={expandedId === list.id}
        >
          <span class="history-icon">🛍️</span>
          <div class="history-meta">
            <span class="history-name">{list.name}</span>
            <span class="history-date">{formatDate(list.finalizedAt)}</span>
          </div>
          <span class="history-total">{formatBRL(getListTotal(list))}</span>
          <span class="history-chevron" aria-hidden="true">
            {expandedId === list.id ? '▲' : '▼'}
          </span>
        </button>

        {#if expandedId === list.id}
          <div class="history-detail" style="animation: accordionDown 0.25s ease forwards;">
            <ul class="detail-items" role="list">
              {#each list.items as item}
                <li class="detail-item">
                  <span class="detail-item-name">{item.cat ?? '🏷️'} {item.nome}</span>
                  <span class="detail-item-price">
                    {item.qty}× {formatBRL(item.preco)}
                  </span>
                </li>
              {/each}
            </ul>
            <div class="detail-actions">
              <button class="btn-del" on:click={() => deleteHistory(list.id)}>Excluir</button>
              <button
                class="btn-reopen"
                on:click={() => reopen(list)}
              >🔄 Reabrir esta lista</button>
            </div>
          </div>
        {/if}

      </li>
    {/each}
  </ul>
{/if}

<style>
.history-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.history-item {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(60, 32, 48, 0.04);
}
.history-item.expanded {
  border-color: var(--border2);
}
.history-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}
.history-row:active { background: var(--surface2); }
.history-icon { font-size: 1.3rem; flex-shrink: 0; }
.history-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.history-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-date {
  font-size: 0.72rem;
  color: var(--text3);
}
.history-total {
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--accent);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.history-chevron {
  font-size: 0.65rem;
  color: var(--text3);
  flex-shrink: 0;
}
.history-detail {
  padding: 0 14px 14px;
  border-top: 1px dashed var(--border);
  background: var(--surface2);
}
.detail-items {
  list-style: none;
  padding: 12px 0; margin: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}
.detail-item-name { color: var(--text); font-weight: 600; }
.detail-item-price { color: var(--text2); font-weight: 700; }
.detail-actions { display: flex; justify-content: space-between; gap: 8px; }

.btn-del {
  background: none;
  border: 1px solid var(--border);
  color: var(--red);
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 700;
}

.btn-reopen {
  flex: 1;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: var(--surface);
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text2);
  cursor: pointer;
  font-family: var(--font-main);
}
.btn-reopen:active { transform: scale(0.95); background: var(--surface2); }
.empty-state {
  text-align: center;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-emoji { font-size: 2.5rem; }
.empty-state p { color: var(--text3); font-weight: 600; }
</style>
