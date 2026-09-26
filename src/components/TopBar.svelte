<script>
  import { activeList, activeView } from '../lib/store.js';
</script>

<header class="topbar">
  <button class="topbar-left" on:click={() => activeView.set('home')} aria-label="Voltar ao início">
    <img src="/favicon.png" alt="MarketMallow" class="topbar-logo" />
    <span class="topbar-listname">{$activeList?.name || 'MarketMallow'}</span>
  </button>

  <nav class="topbar-nav" aria-label="Início">
    <button class="topbar-btn" on:click={() => activeView.set('home')} aria-label="Início"> 🏠 </button>
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
  min-width: 0;
  flex: 1;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.topbar-logo { width: 28px; height: 28px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.topbar-listname {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.topbar-nav {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
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
