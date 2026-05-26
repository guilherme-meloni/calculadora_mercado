<script>
  import { appStore } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'
  import { slide } from 'svelte/transition'

  $: archivedLists = $appStore.lists.filter(l => l.archived)
  let expandedId = null

  function toggle(id) {
    expandedId = expandedId === id ? null : id
  }

  function deleteHistory(id) {
    if (confirm('Remover esta compra do histórico permanentemente?')) {
      appStore.deleteList(id)
    }
  }

  function restore(id) {
    appStore.update(state => {
      const list = state.lists.find(l => l.id === id)
      if (list) list.archived = false
      return { ...state, activeId: id }
    })
  }
</script>

<div class="history">
  <div class="header">
    <div class="title">Histórico de Compras</div>
  </div>

  {#each archivedLists as list (list.id)}
    <div class="archived-card" class:expanded={expandedId === list.id}>
      <button class="card-header" on:click={() => toggle(list.id)} aria-expanded={expandedId === list.id}>
        <div class="info">
          <div class="name">{list.name}</div>
          <div class="meta">
            {list.items.length} itens · {formatBRL(list.items.reduce((a, i) => a + i.preco * i.qty, 0))}
          </div>
        </div>
        <div class="arrow">{expandedId === list.id ? '▴' : '▾'}</div>
      </button>

      {#if expandedId === list.id}
        <div class="details" transition:slide>
          <div class="item-list">
            {#each list.items as item}
              <div class="item-row">
                <span>{item.cat} {item.nome} ({item.qty}x)</span>
                <span>{formatBRL(item.preco * item.qty)}</span>
              </div>
            {/each}
          </div>
          <div class="actions">
            <button class="btn-restore" on:click={() => restore(list.id)}>Reabrir</button>
            <button class="btn-del" on:click={() => deleteHistory(list.id)}>Excluir</button>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="empty-msg">Nenhuma compra arquivada.</div>
  {/each}
</div>

<style>
  .history {
    padding: 0 16px;
    margin-bottom: 24px;
  }
  .header {
    margin-bottom: 12px;
  }
  .title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }

  .archived-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  .card-header {
    width: 100%;
    background: none;
    border: none;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    color: inherit;
  }
  .name { font-size: 14px; font-weight: 700; color: var(--text); }
  .meta { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .arrow { color: var(--text3); font-size: 18px; }

  .details {
    padding: 0 18px 18px;
    border-top: 1px dashed var(--border);
    background: var(--bg);
  }
  .item-list {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .item-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text2);
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .actions button {
    flex: 1;
    padding: 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
  .btn-restore { background: var(--blue); color: white; border: none; }
  .btn-del { background: none; border: 1px solid var(--border); color: var(--red); }

  .empty-msg {
    font-size: 11px;
    color: var(--text3);
    font-style: italic;
    text-align: center;
    padding: 10px;
  }
</style>
