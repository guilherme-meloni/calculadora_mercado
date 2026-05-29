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
      appStore.editItem(item.id, {
        nome: result.nome.trim(),
        preco: p,
        cat: result.cat
      });
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
  <div class="main-content">
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
          <span class="price">{item.preco > 0 ? formatBRL(item.preco) : 'Definir preço'}</span> <span class="un">/ un</span>
        </button>
      </div>
    </div>

    <button class="del" on:click|stopPropagation={() => itemsActions.remove(item.id)} aria-label="Remover item">✕</button>
  </div>

  <div class="actions-row">
    <div class="qty-wrap" on:mousedown|stopPropagation on:touchstart|stopPropagation>
      <button class="qty minus" on:click={() => itemsActions.changeQty(item.id, -1)}>−</button>
      <div class="qty-val">
        <span class="qty-num">{item.qty}</span>
      </div>
      <button class="qty plus" on:click={() => itemsActions.changeQty(item.id, +1)}>+</button>
    </div>

    <div class="sub-box">
      <span class="sub-label">Subtotal</span>
      <span class="sub price">{formatBRL(subtotal)}</span>
    </div>
  </div>
</div>

<style>
  .item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.2s;
    animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(60, 32, 48, 0.04);
  }
  .item:hover { border-color: var(--border2); }

  .main-content {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .item.checked { opacity: 0.6; }
  .item.checked .name-txt { text-decoration: line-through; color: var(--text3); }

  .check-btn {
    background: none; border: none; padding: 0;
    cursor: pointer; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .check-inner {
    width: 28px; height: 28px;
    border-radius: 10px;
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
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--surface2);
    border: 1px solid var(--border);
  }

  .body { 
    flex: 1; 
    min-width: 0; 
    display: flex; 
    flex-direction: column; 
    justify-content: center;
  }
  .name-btn {
    width: 100%; text-align: left;
    overflow: hidden;
  }
  .name-txt {
    display: block;
    font-size: 0.95rem; font-weight: 800;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: var(--text);
  }
  .unit-box { display: flex; }
  .price-link { 
    background: none; border: none; padding: 0;
    font-size: 0.75rem; color: var(--text3); 
    cursor: pointer; font-family: inherit;
    font-weight: 700;
    white-space: nowrap;
  }
  .un { font-weight: 500; opacity: 0.7; }
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

  .del {
    width: 30px; height: 30px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text3);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .del:hover { color: var(--red); border-color: var(--red); }

  .actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface2);
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .qty-wrap {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .qty {
    width: 32px; height: 32px;
    background: none; border: none;
    color: var(--text);
    font-size: 1.1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .qty:active { background: var(--surface2); }
  .qty-val {
    min-width: 30px;
    height: 32px;
    display: flex; align-items: center; justify-content: center;
    font-family: inherit;
  }
  .qty-num { font-size: 0.9rem; font-weight: 900; color: var(--text); }

  .sub-box {
    text-align: right;
    display: flex;
    flex-direction: column;
  }
  .sub-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    font-weight: 800;
    color: var(--text3);
    letter-spacing: 0.05em;
    margin-bottom: -2px;
  }
  .sub {
    font-size: 1rem;
    font-weight: 900;
    color: var(--accent);
  }
</style>