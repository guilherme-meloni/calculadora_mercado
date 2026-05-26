<script>
  import { activeList, bottomSheetOpen, bottomSheetContent } from '../lib/store.js';

  function open(panel) {
    bottomSheetContent.set(panel);
    bottomSheetOpen.set(true);
  }
</script>

<header class="topbar">
  <div class="topbar-left">
    <span class="topbar-logo" aria-hidden="true">🍬</span>
    <span class="topbar-listname">{$activeList?.name || 'MarketMallow'}</span>
  </div>

  <nav class="topbar-nav" aria-label="Abrir painéis">
    <button class="topbar-btn" on:click={() => open('lists')}     aria-label="Minhas listas">   📋 </button>
    <button class="topbar-btn" on:click={() => open('templates')} aria-label="Templates">        ⭐ </button>
    <button class="topbar-btn" on:click={() => open('history')}   aria-label="Histórico">        🕐 </button>
  </nav>
</header>

<style>
.topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: calc(60px + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--surface);
  border-bottom: 2.5px solid var(--border);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 14px;
  padding-right: 14px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 16px rgba(60, 32, 48, 0.05);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.topbar-logo { font-size: 1.4rem; }
.topbar-listname {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-nav {
  display: flex;
  gap: 6px;
}
.topbar-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--text);
  transition: all 0.15s;
}
.topbar-btn:active { transform: scale(0.86); background: var(--border); }

@media (min-width: 768px) {
  .topbar-nav { display: none; }
}
</style>
