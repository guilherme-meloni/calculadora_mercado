<script>
  import { itemsActions, appStore } from '../lib/store.js'
  import { formatBRL, parsePrice } from '../lib/utils.js'

  export let item
  export let isTemplate = false

  $: subtotal = item.preco * item.qty

  let longPressTimer
  async function handleLongPress() {
    const result = await window.customEditItem(item);
    if (result) {
      const p = parsePrice(result.preco);
      appStore.update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.map(i => i.id === item.id ? { ...i, nome: result.nome.trim(), preco: p } : i)
        }
        return { ...state }
      })
    }
  }

  function startLongPress() {
    longPressTimer = setTimeout(handleLongPress, 600)
  }
  function cancelLongPress() {
    clearTimeout(longPressTimer)
  }
  function toggleChecked() {
    if (!item.checked && item.preco <= 0) {
      handleLongPress();
      return;
    }
    itemsActions.toggleChecked(item.id)
  }
</script>

<div 
  class="item" 
  class:checked={item.checked && !isTemplate} 
  class:is-template={isTemplate}
  on:mousedown={startLongPress}
  on:mouseup={cancelLongPress}
  on:touchstart={startLongPress}
  on:touchend={cancelLongPress}
>
  {#if !isTemplate}
    <button 
      class="check-btn" 
      class:is-checked={item.checked}
      on:click|stopPropagation={toggleChecked}
      aria-label="Marcar como pego"
    >
      <div class="check-inner">
        {#if item.checked}✓{/if}
      </div>
    </button>
  {/if}

  <div class="ico">{item.cat}</div>
  
  <div class="body">
    <div class="name-btn">
      <span class="name-txt">{item.nome}</span>
    </div>
    <div class="unit-box">
      <button class="price-link" class:missing={item.preco <= 0} on:click|stopPropagation={handleLongPress}>
        <span class="price">{item.preco > 0 ? formatBRL(item.preco) : 'Definir preço'}</span> / un
      </button>
    </div>
  </div>

  <div class="qty-wrap" on:mousedown|stopPropagation on:touchstart|stopPropagation>
    <button class="qty minus" on:click={() => itemsActions.changeQty(item.id, -1)}>−</button>
    <div class="qty-val">
      <span class="qty-num">{item.qty}</span>
    </div>
    <button class="qty plus" on:click={() => itemsActions.changeQty(item.id, +1)}>+</button>
  </div>

  <div class="sub-box">
    <span class="sub price">{formatBRL(subtotal)}</span>
  </div>
  <button class="del" on:click|stopPropagation={() => itemsActions.remove(item.id)} aria-label="Remover item">✕</button>
</div>

<style>
  .item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 10px;
    display: grid;
    grid-template-columns: auto auto 1fr auto auto auto;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(60, 32, 48, 0.04);
  }
  .item:hover { border-color: var(--border2); }

  @media (max-width: 400px) {
    .item { gap: 6px; padding: 8px; }
  }

  .item.checked { opacity: 0.6; }
  .item.checked .name-txt { text-decoration: line-through; color: var(--text3); }

  .check-btn {
    background: none; border: none; padding: 0;
    cursor: pointer; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .check-inner {
    width: 26px; height: 26px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    transition: all 0.2s;
  }
  .is-checked .check-inner {
    background: var(--green);
    border-color: transparent;
  }

  .ico {
    font-size: 20px;
    width: 38px; height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--surface2);
    border: 1px solid var(--border);
  }

  .body { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
  .name-btn {
    background: none; border: none; padding: 0;
    width: 100%; text-align: left; cursor: pointer;
    font-family: inherit; color: inherit;
    overflow: hidden;
  }
  .name-txt {
    display: block;
    font-size: 0.85rem; font-weight: 700;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: var(--text);
  }
  .unit-box { width: 100%; display: flex; }
  .price-link { 
    background: none; border: none; padding: 0;
    font-size: 0.7rem; color: var(--text3); margin-top: 1px; 
    cursor: pointer; font-family: inherit;
    font-weight: 600;
    white-space: nowrap;
  }
  .price-link.missing { 
    color: var(--red); 
    font-weight: 800; 
    text-decoration: underline;
    animation: alertPulse 1.5s infinite;
  }
  @keyframes alertPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .price-link:hover { color: var(--accent); }

  .qty-wrap {
    display: flex;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--surface2);
    border: 1px solid var(--border);
  }
  .qty {
    width: 28px; height: 28px;
    background: none; border: none;
    color: var(--text);
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .qty:active { background: var(--border); }
  .qty-val {
    min-width: 24px;
    height: 28px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    background: none; border: none; padding: 0;
    font-family: inherit; color: inherit;
  }
  .qty-num { font-size: 0.8rem; font-weight: 800; }

  .inline-input {
    width: 60px;
    background: white;
    border: 1.5px solid var(--accent);
    border-radius: 6px;
    font-size: 0.75rem;
    padding: 2px 4px;
    font-family: inherit;
    outline: none;
  }
  .name-input { width: 100%; }
  .qty-input { width: 34px; text-align: center; }

  .sub-box {
    min-width: 64px; text-align: right;
    flex-shrink: 0;
  }
  .sub {
    font-size: 0.8rem;
    color: var(--accent);
  }

  .del {
    width: 26px; height: 26px;
    background: none;
    border: none;
    color: var(--text3);
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    opacity: 0.4;
    transition: all 0.2s;
  }
  .del:hover { opacity: 1; color: var(--red); }
</style>
