<script>
  import { itemsActions, appStore } from '../lib/store.js'
  import { formatBRL, parsePrice } from '../lib/utils.js'

  export let item
  export let isTemplate = false

  $: subtotal = item.preco * item.qty

  let editingPrice = false
  let tempPrice = ''
  let priceInput

  let editingQty = false
  let tempQty = ''
  let qtyInput

  let editingName = false
  let tempName = ''
  let nameInput

  function startEditPrice() {
    tempPrice = item.preco.toString().replace('.', ',')
    editingPrice = true
    setTimeout(() => priceInput?.focus(), 50)
  }

  function savePrice() {
    const p = parsePrice(tempPrice)
    if (p >= 0) {
      itemsActions.editPrice(item.id, p)
    }
    editingPrice = false
  }

  function startEditQty() {
    tempQty = item.qty.toString()
    editingQty = true
    setTimeout(() => qtyInput?.focus(), 50)
  }

  function saveQty() {
    const q = parseInt(tempQty)
    if (!isNaN(q)) {
      itemsActions.editQty(item.id, q)
    }
    editingQty = false
  }

  function startEditName() {
    tempName = item.nome
    editingName = true
    setTimeout(() => nameInput?.focus(), 50)
  }

  function saveName() {
    if (tempName.trim()) {
      // Usamos update direto na store para renomear o item já que não temos essa action específica
      appStore.update(state => {
        const list = state.lists.find(l => l.id === state.activeId)
        if (list) {
          list.items = list.items.map(i => i.id === item.id ? { ...i, nome: tempName.trim() } : i)
        }
        return { ...state }
      })
    }
    editingName = false
  }

  function onKeyPrice(e) {
    if (e.key === 'Enter') savePrice()
    if (e.key === 'Escape') editingPrice = false
  }

  function onKeyQty(e) {
    if (e.key === 'Enter') saveQty()
    if (e.key === 'Escape') editingQty = false
  }

  function onKeyName(e) {
    if (e.key === 'Enter') saveName()
    if (e.key === 'Escape') editingName = false
  }

  let longPressTimer
  function startLongPress() {
    longPressTimer = setTimeout(startEditQty, 600)
  }
  function cancelLongPress() {
    clearTimeout(longPressTimer)
  }
</script>

<div class="item" class:checked={item.checked && !isTemplate} class:is-template={isTemplate}>
  {#if !isTemplate}
    <button 
      class="check-btn" 
      class:is-checked={item.checked}
      on:click={() => itemsActions.toggleChecked(item.id)}
      aria-label="Marcar como pego"
    >
      <div class="check-inner">
        {#if item.checked}✓{/if}
      </div>
    </button>
  {/if}

  <div class="ico">{item.cat}</div>
  
  <div class="body">
    <div class="name" on:click={startEditName}>
      {#if editingName}
        <input
          bind:this={nameInput}
          type="text"
          bind:value={tempName}
          on:blur={saveName}
          on:keydown={onKeyName}
          class="inline-input name-input"
        />
      {:else}
        {item.nome}
      {/if}
    </div>
    <div class="unit" on:click={startEditPrice}>
      {#if editingPrice}
        <input
          bind:this={priceInput}
          type="text"
          inputmode="decimal"
          bind:value={tempPrice}
          on:blur={savePrice}
          on:keydown={onKeyPrice}
          class="inline-input"
        />
      {:else}
        <span class="price-link" class:missing={item.preco <= 0}>
          {item.preco > 0 ? formatBRL(item.preco) : 'Definir preço'} / un
        </span>
      {/if}
    </div>
  </div>

  <div class="qty-wrap">
    <button class="qty minus" on:click={() => itemsActions.changeQty(item.id, -1)}>−</button>
    <div 
      class="qty-val" 
      on:mousedown={startLongPress} 
      on:mouseup={cancelLongPress}
      on:touchstart={startLongPress}
      on:touchend={cancelLongPress}
      on:dblclick={startEditQty}
    >
      {#if editingQty}
        <input
          bind:this={qtyInput}
          type="number"
          inputmode="numeric"
          bind:value={tempQty}
          on:blur={saveQty}
          on:keydown={onKeyQty}
          class="inline-input qty-input"
        />
      {:else}
        <span class="qty-num">{item.qty}</span>
      {/if}
    </div>
    <button class="qty plus" on:click={() => itemsActions.changeQty(item.id, +1)}>+</button>
  </div>

  <span class="sub">{formatBRL(subtotal)}</span>
  <button class="del" on:click={() => itemsActions.remove(item.id)}>✕</button>
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
    transition: all 0.2s;
  }
  .item.checked {
    opacity: 0.5;
  }
  .item.checked .name {
    text-decoration: line-through;
    color: var(--text3);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .item:hover { border-color: var(--border2); background: var(--surface2); }

  /* Checkbox Custom */
  .check-btn {
    background: none; border: none; padding: 0;
    cursor: pointer; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .check-inner {
    width: 24px; height: 24px;
    border: 2px solid var(--border2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 14px;
    transition: all 0.2s;
  }
  .is-checked .check-inner {
    background: var(--green);
    border-color: var(--green);
  }

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
    transition: all 0.2s;
  }
  .unit { font-size: 11px; color: var(--text3); margin-top: 2px; font-variant-numeric: tabular-nums; cursor: pointer; }
  .price-link.missing { color: var(--red); font-weight: 800; text-decoration: underline; }
  .price-link:hover { color: var(--accent); text-decoration: underline; }

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
  .qty-val {
    min-width: 30px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }

  .qty-num {
    font-size: 13px; font-weight: 600;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .inline-input {
    width: 60px;
    background: white;
    border: 1px solid var(--accent);
    border-radius: 4px;
    font-size: 11px;
    padding: 2px 4px;
    font-family: inherit;
    outline: none;
  }
  .qty-input {
    width: 40px;
    text-align: center;
    font-size: 13px;
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
