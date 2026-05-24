<script>
  import { appStore } from '../lib/store.js'

  let newTemplateName = ''
  let showCreate = false

  $: templates = $appStore.lists.filter(l => l.isTemplate && !l.archived)

  function handleCreate() {
    if (!newTemplateName.trim()) return
    appStore.createList(newTemplateName.trim(), true)
    newTemplateName = ''
    showCreate = false
  }

  function handleSwitch(id) {
    appStore.switchList(id)
  }

  function handleUse(id) {
    appStore.duplicateTemplateAsActive(id)
  }

  function handleDelete(id, name) {
    if (confirm(`Excluir o template "${name}"?`)) {
      appStore.deleteList(id)
    }
  }
</script>

<div class="template-manager">
  <div class="header">
    <div class="title">Seus Templates</div>
    <button class="btn-new" on:click={() => showCreate = !showCreate}>
      {showCreate ? 'Cancelar' : '+ Novo Template'}
    </button>
  </div>

  {#if showCreate}
    <div class="create-box">
      <input
        type="text"
        placeholder="Nome do template"
        bind:value={newTemplateName}
        on:keydown={e => e.key === 'Enter' && handleCreate()}
      />
      <button on:click={handleCreate}>Criar</button>
    </div>
  {/if}

  <div class="templates-list">
    {#each templates as t (t.id)}
      <div class="template-item" class:active={t.id === $appStore.activeId}>
        <div class="info" on:click={() => handleSwitch(t.id)}>
          <div class="name">{t.name}</div>
          <div class="meta">{t.items.length} itens pré-definidos</div>
        </div>
        <div class="actions">
          <button class="btn-use" on:click={() => handleUse(t.id)}>Usar</button>
          <button class="btn-del" on:click={() => handleDelete(t.id, t.name)}>✕</button>
        </div>
      </div>
    {:else}
      <div class="empty-msg">Nenhum template criado.</div>
    {/each}
  </div>
</div>

<style>
  .template-manager {
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
    color: var(--yellow);
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
    background: var(--yellow);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 0 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .templates-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .template-item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  .template-item.active {
    border-color: var(--yellow);
    background: var(--surface2);
  }

  .info { flex: 1; cursor: pointer; }
  .name { font-size: 14px; font-weight: 700; }
  .meta { font-size: 11px; color: var(--text3); }

  .actions { display: flex; gap: 6px; }
  .btn-use {
    background: var(--yellow);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .btn-del {
    background: none;
    border: 1px solid var(--border);
    color: var(--text3);
    border-radius: 8px;
    width: 26px; height: 26px;
    font-size: 10px;
    cursor: pointer;
  }
  .btn-del:hover { color: var(--red); border-color: var(--red); }

  .empty-msg {
    font-size: 11px;
    color: var(--text3);
    font-style: italic;
    text-align: center;
    padding: 10px;
  }
</style>
