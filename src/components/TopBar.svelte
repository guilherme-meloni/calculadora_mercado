<script>
  import { appStore, items } from '../lib/store.js'
  $: count = $items.length
  $: activeList = $appStore.lists.find(l => l.id === $appStore.activeId)
</script>

<div class="topbar">
  <div>
    <div class="eye">{activeList ? activeList.name : 'Minhas compras'}</div>
    <div class="title">MarketMallow 🍬</div>
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
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent2);   /* verde feira */
    margin-bottom: 3px;
  }

  .title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #FFF0F5;
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 6px 13px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text2);
    font-variant-numeric: tabular-nums;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    /* pulsa suavemente pra dar vida */
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1;   transform: scale(1);    }
    50%       { opacity: 0.5; transform: scale(0.75); }
  }
</style>
