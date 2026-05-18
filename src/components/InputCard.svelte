<script>
  import { itemsActions } from '../lib/store.js'
  import { parsePrice } from '../lib/utils.js'

  const CATS = ['🥩','🥬','🥛','🧴','🍞','🧃','🛒']
  let selCat = '🛒'
  let nome = ''
  let preco = ''
  let focused = false
  let shake = false

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
      <label for="inp-preco">Preço</label>
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

  <button class="btn-add" on:click={add}>
    + Adicionar ao carrinho
  </button>
</div>

<style>
  .card {
    margin: 0 16px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 16px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .card.focused {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent), 0 8px 32px rgba(124,109,250,0.14);
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

  .cats {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .cats::-webkit-scrollbar { display: none; }

  .cat {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 7px 11px;
    font-size: 18px;
    cursor: pointer;
    flex-shrink: 0;
    line-height: 1;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .cat.active {
    border-color: var(--accent);
    background: rgba(124,109,250,0.15);
    box-shadow: 0 0 0 1px rgba(124,109,250,0.3);
  }

  .fields { display: flex; gap: 10px; margin-bottom: 12px; }
  .fw { flex: 1; position: relative; }
  .fw.fw-price { flex: 0 0 126px; }

  .fw label {
    position: absolute;
    top: 10px; left: 14px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text3);
    pointer-events: none;
    transition: color 0.2s;
  }
  .fw:focus-within label { color: var(--accent2); }

  .fw input {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 13px;
    padding: 27px 14px 10px;
    color: var(--text);
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .fw input::placeholder { color: var(--text3); }
  .fw input:focus { border-color: var(--accent); }

  .btn-add {
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 13px;
    padding: 15px;
    font-family: inherit;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.02em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(124,109,250,0.4);
    -webkit-tap-highlight-color: transparent;
  }
  .btn-add::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 55%);
    pointer-events: none;
  }
  .btn-add:active { transform: scale(0.97); }
</style>
