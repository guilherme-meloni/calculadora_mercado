<script>
  import { items } from '../lib/store.js'
  import { formatBRL } from '../lib/utils.js'

  export let item

  $: subtotal = item.preco * item.qty
</script>

<div class="item">
  <div class="ico">{item.cat}</div>
  <div class="body">
    <div class="name">{item.nome}</div>
    <div class="unit">{formatBRL(item.preco)} / un</div>
  </div>
  <div class="qty-wrap">
    <button class="qty minus" on:click={() => items.changeQty(item.id, -1)}>−</button>
    <span class="qty-num">{item.qty}</span>
    <button class="qty plus" on:click={() => items.changeQty(item.id, +1)}>+</button>
  </div>
  <span class="sub">{formatBRL(subtotal)}</span>
  <button class="del" on:click={() => items.remove(item.id)}>✕</button>
</div>

<style>
  .item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 17px;
    padding: 12px 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: border-color 0.2s, background 0.2s;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .item:hover { border-color: var(--border2); background: var(--surface2); }

  .ico {
    font-size: 20px;
    width: 38px; height: 38px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .body { flex: 1; min-width: 0; }
  .name {
    font-size: 14px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .unit { font-size: 11px; color: var(--text3); margin-top: 2px; font-variant-numeric: tabular-nums; }

  .qty-wrap {
    display: flex;
    align-items: center;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 11px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .qty {
    width: 34px; height: 34px;
    background: none; border: none;
    color: var(--text3);
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s, background 0.15s;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .qty:active { background: var(--surface2); }
  .qty.minus:active { color: var(--red); background: rgba(248,113,113,0.12); }
  .qty.plus:active  { color: var(--green); background: rgba(52,211,153,0.12); }
  .qty-num {
    font-size: 13px; font-weight: 600;
    min-width: 24px; text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .sub {
    font-size: 13px; font-weight: 600;
    color: var(--green);
    min-width: 72px; text-align: right;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  .del {
    width: 30px; height: 30px;
    background: none;
    border: 1px solid transparent;
    border-radius: 9px;
    color: var(--text3);
    font-size: 14px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .del:active {
    color: var(--red);
    border-color: rgba(248,113,113,0.35);
    background: rgba(248,113,113,0.1);
  }
</style>
