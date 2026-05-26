<script>
  import { appStore, bottomSheetOpen } from '../lib/store.js';

  export let template;

  function handleUse() {
    appStore.duplicateTemplateAsActive(template.id);
    bottomSheetOpen.set(false);
  }

  async function handleDelete() {
    if (await window.customConfirm(`Excluir o template "${template.name}"?`)) {
      appStore.deleteList(template.id);
    }
  }
</script>

<article class="list-card pop-in" role="listitem">
  <div class="list-card-header">
    <span class="list-card-emoji">{template.emoji ?? '⭐'}</span>
    <div class="list-card-info">
      <h3 class="list-card-name">{template.name}</h3>
      <span class="list-card-count">{template.items.length} itens pré-definidos</span>
    </div>
  </div>

  <div class="list-card-actions">
    <button class="btn-del" on:click={handleDelete} aria-label="Excluir template">✕</button>
    <button class="btn-open" on:click={handleUse} aria-label="Usar template {template.name}">
      Usar nas compras →
    </button>
  </div>
</article>

<style>
.list-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(60, 32, 48, 0.05);
}
.list-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.list-card-emoji { font-size: 1.8rem; }
.list-card-info { flex: 1; min-width: 0; }
.list-card-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-card-count {
  font-size: 0.72rem;
  color: var(--text3);
  font-weight: 700;
}
.list-card-actions { display: flex; justify-content: space-between; align-items: center; }

.btn-del {
  background: none;
  border: none;
  color: var(--text3);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
}
.btn-del:hover { opacity: 1; color: var(--red); }

.btn-open {
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: var(--surface2);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-open:active { transform: scale(0.95); background: var(--border); }
</style>
