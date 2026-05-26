<script>
  import { appStore, bottomSheetOpen } from '../lib/store.js';
  import { formatBRL } from '../lib/utils.js';

  export let list;

  $: total = list.items.reduce((a, i) => a + i.preco * i.qty, 0);
  $: checkedCount = list.items.filter(i => i.checked).length;
  $: progress = list.items.length > 0 ? (checkedCount / list.items.length) * 100 : 0;

  function handleOpen() {
    appStore.switchList(list.id);
    bottomSheetOpen.set(false);
  }

  async function handleDelete() {
    if (await window.customConfirm(`Excluir a lista "${list.name}"?`)) {
      appStore.deleteList(list.id);
    }
  }
</script>

<article class="list-card pop-in" role="listitem">
  <div class="list-card-header">
    <span class="list-card-emoji">{list.emoji ?? '🛒'}</span>
    <div class="list-card-info">
      <h3 class="list-card-name">{list.name}</h3>
      <span class="list-card-count">{list.items.length} itens</span>
    </div>
    <span class="list-card-total">{formatBRL(total)}</span>
  </div>
  
  <div class="list-card-progress" aria-label="Progresso: {checkedCount} de {list.items.length}">
    <div
      class="list-card-progress-fill"
      style="width: {progress}%"
    />
  </div>

  <div class="list-card-actions">
    <button class="btn-del" on:click={handleDelete} aria-label="Excluir lista">✕</button>
    <button class="btn-open" on:click={handleOpen} aria-label="Abrir lista {list.name}">
      Abrir →
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
.list-card-total {
  font-size: 1rem;
  font-weight: 900;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.list-card-progress {
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--surface2);
  border: 1px solid var(--border);
  overflow: hidden;
}
.list-card-progress-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--accent2);
  transition: width 0.4s ease;
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
