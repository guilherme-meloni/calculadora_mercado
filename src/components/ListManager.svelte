<script>
  import { appStore } from '../lib/store.js'

  let newListName = ''
  let showCreate = false

  let editingId = null
  let tempRename = ''
  let renameInput

  function handleCreate() {
    if (!newListName.trim()) return
    appStore.createList(newListName.trim())
    newListName = ''
    showCreate = false
  }

  function handleSwitch(id) {
    appStore.switchList(id)
  }

  function handleDelete(id, name) {
    if (confirm(`Excluir a lista "${name}"?`)) {
      appStore.deleteList(id)
    }
  }

  function startRename(list) {
    editingId = list.id
    tempRename = list.name
    setTimeout(() => renameInput?.focus(), 50)
  }

  function saveRename() {
    if (tempRename.trim() && editingId) {
      appStore.renameList(editingId, tempRename.trim())
    }
    editingId = null
  }

  $: lists = $appStore.lists.filter(l => !l.isTemplate && !l.archived)
</script>

<div class="manager">
  <div class="header">
    <div class="title">Suas Listas</div>
    <button class="btn-new" on:click={() => showCreate = !showCreate}>
      {showCreate ? 'Cancelar' : '+ Nova Lista'}
    </button>
  </div>

  {#if showCreate}
    <div class="create-box">
      <input
        type="text"
        placeholder="Nome da lista (ex: Churrasco)"
        bind:value={newListName}
        on:keydown={e => e.key === 'Enter' && handleCreate()}
      />
      <button on:click={handleCreate}>Criar</button>
    </div>
  {/if}

  <div class="lists-grid">
    {#each lists as list (list.id)}
      <button
        type="button"
        class="list-card"
        class:active={list.id === $appStore.activeId}
        on:click={() => handleSwitch(list.id)}
      >
        <div class="list-info">
          <div class="list-name" on:dblclick|stopPropagation={() => startRename(list)}>
            {#if editingId === list.id}
              <input
                bind:this={renameInput}
                type="text"
                bind:value={tempRename}
                on:blur={saveRename}
                on:keydown={e => e.key === 'Enter' && saveRename()}
                class="rename-input"
              />
            {:else}
              {list.name}
            {/if}
          </div>
          <div class="list-meta">{list.items.length} itens</div>
        </div>
        {#if lists.length > 1}
          <button type="button" class="btn-del" on:click|stopPropagation={() => handleDelete(list.id, list.name)}>✕</button>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .manager {
    padding: 0 16px;
    margin-bottom: 24px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }
  .btn-new {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--blue);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .create-box {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    animation: slideDown 0.2s ease;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .create-box input {
    flex: 1;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    outline: none;
  }
  .create-box button {
    background: var(--green);
    color: var(--bg);
    border: none;
    border-radius: 10px;
    padding: 0 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .lists-grid {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: none;
  }
  .lists-grid::-webkit-scrollbar { display: none; }

  .list-card {
    flex: 0 0 140px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 12px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    /* Reset button styles */
    display: block;
    width: 140px;
    text-align: left;
    font-family: inherit;
  }
  .list-card.active {
    border-color: var(--accent);
    background: var(--surface2);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .list-name {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .rename-input {
    width: 100%;
    background: white;
    border: 1px solid var(--accent);
    border-radius: 4px;
    font-size: 13px;
    padding: 2px 4px;
    font-family: inherit;
    font-weight: 700;
    outline: none;
  }
  .list-meta {
    font-size: 11px;
    color: var(--text3);
  }
  .btn-del {
    position: absolute;
    top: 6px; right: 6px;
    width: 26px; height: 26px;
    background: rgba(217, 88, 88, 0.15);
    border: 1px solid rgba(217, 88, 88, 0.2);
    border-radius: 8px;
    color: var(--red);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 2;
  }
  .btn-del:active { transform: scale(0.9); background: rgba(217, 88, 88, 0.25); }
</style>
