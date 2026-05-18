<script>
  import { items, itemsActions } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'

  $: total = $items.reduce((a, i) => a + i.preco * i.qty, 0)
  $: totalUnits = $items.reduce((a, i) => a + i.qty, 0)
  $: count = $items.length
</script>

<div class="bar">
  <div class="fade"></div>
  <div class="inner">
    <div>
      <div class="eye">Total estimado</div>
      <div class="val">{formatBRL(total)}</div>
      <div class="meta">{totalUnits} unidades · {count} {count === 1 ? 'produto' : 'produtos'}</div>
    </div>
    {#if count > 0}
      <div class="right">
        <div class="pill">
          <span class="pill-lbl">Itens</span>
          <span class="pill-val">{count}</span>
        </div>
        <button class="btn-clear" on:click={() => itemsActions.clear()}>Limpar</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    display: flex;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
  }
  .fade {
    height: 36px;
    background: linear-gradient(to top, var(--bg) 20%, transparent);
  }
  .inner {
    margin: 0 16px;
    margin-bottom: max(env(safe-area-inset-bottom), 16px);
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 22px;
    padding: 15px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -2px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,109,250,0.1);
    pointer-events: all;
    max-width: 480px;
    width: calc(100vw - 32px);
  }
  .eye {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--text3); margin-bottom: 3px;
  }
  .val {
    font-size: 30px; font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .meta { font-size: 11px; color: var(--text3); margin-top: 3px; font-variant-numeric: tabular-nums; }

  .right { display: flex; align-items: center; gap: 8px; }
  .pill {
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.22);
    border-radius: 11px;
    padding: 6px 11px; text-align: center;
  }
  .pill-lbl {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--green); opacity: 0.65; display: block;
  }
  .pill-val { font-size: 15px; font-weight: 700; color: var(--green); font-variant-numeric: tabular-nums; }

  .btn-clear {
    background: none;
    border: 1px solid var(--border2);
    border-radius: 11px;
    padding: 9px 14px;
    color: var(--text3);
    font-family: inherit;
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-clear:active {
    border-color: var(--red);
    color: var(--red);
    background: rgba(248,113,113,0.07);
  }
</style>
