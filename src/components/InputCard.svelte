<script>
  import { itemsActions, activeList } from '../lib/store.js'
  import { parsePrice } from '../lib/utils.js'

  const CATS = ['🛒','🥩','🥬','🥛','🧴','🍞','🧃','🧹','🐾']
  let selCat = '🛒'
  let nome = ''
  let preco = ''
  let focused = false
  let shake = false

  $: isTemplate = $activeList?.isTemplate || false

  function add() {
    const p = parsePrice(preco)
    if (!nome.trim() || p <= 0) {
      shake = true
      setTimeout(() => shake = false, 450)
      return
    }
    itemsActions.add(nome.trim(), p, selCat)
    nome = ''
    preco = ''
  }

  function onKey(e) {
    if (e.key === 'Enter') add()
  }
</script>

<div class="card" class:focused class:shake>
  <!-- Categorias -->
  <div class="cats">
    {#each CATS as c}
      <button
        class="cat"
        class:active={selCat === c}
        on:click={() => selCat = c}
        title={c}
      >{c}</button>
    {/each}
  </div>

  <!-- Campos -->
  <div class="fields">
    <div class="fw">
      <label for="inp-nome">Produto</label>
      <input
        id="inp-nome"
        type="text"
        placeholder="ex: Leite integral"
        bind:value={nome}
        on:keydown={onKey}
        on:focus={() => focused = true}
        on:blur={() => focused = false}
        autocomplete="off"
        autocorrect="off"
      />
    </div>
    <div class="fw fw-price">
      <label for="inp-preco">{isTemplate ? 'Preço Est.' : 'Preço'}</label>
      <input
        id="inp-preco"
        type="text"
        inputmode="decimal"
        placeholder="0,00"
        bind:value={preco}
        on:keydown={onKey}
        on:focus={() => focused = true}
        on:blur={() => focused = false}
        autocomplete="off"
      />
    </div>
  </div>

  <button class="btn-add" class:is-template={isTemplate} on:click={add}>
    {isTemplate ? '+ Adicionar ao template' : '+ Adicionar ao carrinho'}
  </button>
</div>

<style>
  .card {
    margin: 0 16px 14px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 22px;
    padding: 16px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .card.focused {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(194, 84, 110, 0.12);
  }
  .card.shake {
    animation: shakeAnim 0.4s ease;
  }
  @keyframes shakeAnim {
    0%,100% { transform: translateX(0); }
    15%      { transform: translateX(-7px) rotate(-0.4deg); }
    35%      { transform: translateX(7px) rotate(0.4deg); }
    55%      { transform: translateX(-4px); }
    75%      { transform: translateX(4px); }
  }

  /* ── Seletores de categoria ── */
  .cats {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    padding: 4px 2px;
  }
  .cats::-webkit-scrollbar { display: none; }

  .cat {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
    line-height: 1;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
    scroll-snap-align: start;
  }
  .cat.active {
    border-color: var(--accent);
    background: rgba(194, 84, 110, 0.1);
    box-shadow: 0 0 0 2px rgba(194, 84, 110, 0.2);
    transform: scale(1.08);
  }
  .cat:active { transform: scale(0.92); }

  /* ── Campos de texto ── */
  .fields { display: flex; gap: 10px; margin-bottom: 12px; }
  .fw { flex: 1; position: relative; }
  .fw.fw-price { flex: 0 0 126px; }

  .fw label {
    position: absolute;
    top: 10px; left: 14px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text3);
    pointer-events: none;
    transition: color 0.2s;
  }
  .fw:focus-within label { color: var(--accent); }

  .fw input {
    width: 100%;
    background: #FFF8F5;
    border: 1.5px solid var(--border);
    border-radius: 13px;
    padding: 27px 14px 10px;
    color: var(--text);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  .fw input::placeholder { color: var(--text3); font-weight: 400; }
  .fw input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(194, 84, 110, 0.1);
  }

  /* ── Botão adicionar ── */
  .btn-add {
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 15px;
    font-family: inherit;
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(194, 84, 110, 0.35);
    -webkit-tap-highlight-color: transparent;
  }
  .btn-add.is-template {
    background: var(--yellow);
    box-shadow: 0 4px 18px rgba(212, 168, 67, 0.35);
  }
  .btn-add:hover  { background: #B0485F; }
  .btn-add.is-template:hover { background: #b8913a; }
  .btn-add:active { transform: scale(0.97); box-shadow: 0 2px 8px rgba(194, 84, 110, 0.25); }
</style>
