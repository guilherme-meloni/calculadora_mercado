<script>
  import { appStore, items } from '../lib/store.js'
  $: count = $items.length
  $: activeList = $appStore.lists.find(l => l.id === $appStore.activeId)
</script>

<div class="topbar">
  <div>
    <div class="eye">{activeList ? activeList.name : 'Mercado'}</div>
    <div class="title">Calculadora 🛒</div>
  </div>
  <div class="badge">
    <span class="dot"></span>
    <span>{count} {count === 1 ? 'item' : 'itens'}</span>
  </div>
</div>

<style>
  .topbar {
    padding: max(env(safe-area-inset-top), 28px) 20px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 22px;
  }
  .eye {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 3px;
  }
  .title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text2);
    font-variant-numeric: tabular-nums;
  }
  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
  }
</style>
