<script>
  import { appStore } from '../../lib/store.js'
  import TemplateCard from '../TemplateCard.svelte'

  let newTemplateName = ''
  let showCreate = false

  async function handleCreate() {
    if (!newTemplateName.trim()) return
    appStore.createList(newTemplateName.trim(), true)
    newTemplateName = ''
    showCreate = false
  }

  $: templates = $appStore.lists.filter(l => l.isTemplate && !l.archived)
</script>

<div class="panel">
  <div class="panel-header">
    <button class="btn-new" on:click={() => showCreate = !showCreate}>
      {showCreate ? 'Cancelar' : '+ Novo Template'}
    </button>
  </div>

  {#if showCreate}
    <div class="create-box pop-in">
      <input
        type="text"
        placeholder="Nome do template"
        bind:value={newTemplateName}
        on:keydown={e => e.key === 'Enter' && handleCreate()}
      />
      <button class="btn-save" on:click={handleCreate}>Criar</button>
    </div>
  {/if}

  <div class="templates-container">
    {#each templates as template (template.id)}
      <TemplateCard {template} />
    {:else}
      <div class="empty">
        <p>Você não tem templates criados.</p>
      </div>
    {/each}
  </div>
</div>

<style>
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.panel-header {
  display: flex;
  justify-content: center;
}
.btn-new {
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: var(--surface2);
  font-weight: 800;
  color: var(--yellow);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-new:active { transform: scale(0.95); background: var(--border); }

.create-box {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--border);
}
.create-box input {
  flex: 1;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  color: var(--text);
}
.btn-save {
  background: var(--yellow);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
}

.templates-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  text-align: center;
  padding: 40px 0;
  color: var(--text3);
  font-weight: 600;
}
</style>
