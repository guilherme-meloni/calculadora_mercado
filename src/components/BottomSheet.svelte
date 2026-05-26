<script>
  import { bottomSheetOpen, bottomSheetContent } from '../lib/store.js';
  import ListsPanel     from './panels/ListsPanel.svelte';
  import TemplatesPanel from './panels/TemplatesPanel.svelte';
  import HistoryPanel   from './panels/HistoryPanel.svelte';

  const panels = {
    lists:     { title: '📋 Minhas Listas',  comp: ListsPanel     },
    templates: { title: '⭐ Templates',       comp: TemplatesPanel },
    history:   { title: '🕐 Histórico',      comp: HistoryPanel   },
  };

  $: panel = panels[$bottomSheetContent] ?? null;

  /* Swipe para fechar */
  let startY = 0, deltaY = 0, sheetEl;

  const onTouchStart = e => { startY = e.touches[0].clientY; };
  const onTouchMove  = e => {
    deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0 && sheetEl) sheetEl.style.transform = `translateY(${deltaY}px)`;
  };
  const onTouchEnd = () => {
    if (deltaY > 110) close();
    else if (sheetEl) sheetEl.style.transform = '';
    deltaY = 0;
  };

  function close() {
    if (sheetEl) {
      sheetEl.style.transform = 'translateY(100%)';
      sheetEl.style.transition = 'transform 0.28s cubic-bezier(0.32,0.72,0,1)';
      setTimeout(() => bottomSheetOpen.set(false), 280);
    } else {
      bottomSheetOpen.set(false);
    }
  }
</script>

{#if $bottomSheetOpen && panel}
  <div
    class="sheet-overlay"
    role="button" tabindex="0"
    aria-label="Fechar"
    on:click={close}
    on:keydown={e => e.key === 'Enter' && close()}
  />

  <div
    bind:this={sheetEl}
    class="sheet"
    role="dialog"
    aria-modal="true"
    aria-label={panel.title}
    on:touchstart={onTouchStart}
    on:touchmove={onTouchMove}
    on:touchend={onTouchEnd}
  >
    <div class="sheet-handle" aria-hidden="true"></div>

    <div class="sheet-head">
      <span class="sheet-title">{panel.title}</span>
      <button class="sheet-close" on:click={close} aria-label="Fechar painel">✕</button>
    </div>

    <div class="sheet-body">
      <svelte:component this={panel.comp} />
    </div>
  </div>
{/if}

<style>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(60, 32, 48, 0.35);
  z-index: 90;
  animation: fadeIn 0.2s ease forwards;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  max-height: 82dvh;
  background: var(--bg);
  border-radius: 28px 28px 0 0;
  border: 2px solid var(--border);
  border-bottom: none;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(60, 32, 48, 0.15);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  animation: sheetUp 0.32s cubic-bezier(0.32,0.72,0,1) forwards;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
@keyframes sheetUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.sheet-handle {
  width: 36px; height: 5px;
  border-radius: 999px;
  background: var(--border);
  margin: 12px auto 0;
  flex-shrink: 0;
}
.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 10px;
  flex-shrink: 0;
}
.sheet-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
}
.sheet-close {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  font-size: 0.9rem;
  color: var(--text3);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.sheet-close:active { transform: scale(0.9); background: var(--surface2); }

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px 20px;
  overscroll-behavior: contain;
}

@media (min-width: 768px) {
  .sheet, .sheet-overlay { display: none !important; }
}
</style>
