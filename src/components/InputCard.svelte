<script>
  import { itemsActions, activeList, bottomSheetContent, bottomSheetOpen, ultimoAdicionado } from '../lib/store.js'
  import { parsePrice } from '../lib/utils.js'

  const CATS = ['🛒','🥩','🥬','🥛','🧴','🍞','🧃','🧹','🐾']
  let selCat = '🛒'
  let nome = ''
  let preco = ''
  let focused = false
  let shake = false
  let avisoTexto = null
  let avisoTimeout

  $: isTemplate = $activeList?.isTemplate || false

  $: if ($ultimoAdicionado) {
    avisoTexto = `✅ ${$ultimoAdicionado.nome} adicionado à lista`
    clearTimeout(avisoTimeout)
    avisoTimeout = setTimeout(() => avisoTexto = null, 2500)
  }

  function abrirScanner() {
    bottomSheetContent.set('scanner')
    bottomSheetOpen.set(true)
  }

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

  async function openEmojiPicker() {
    const emoji = await window.customPrompt('Qual emoji deseja usar?');
    if (emoji) selCat = emoji;
  }
</script>

<div class="card pop-in" class:focused class:shake>
  {#if avisoTexto}
    <p class="aviso-adicionado">{avisoTexto}</p>
  {/if}

  <button class="btn-scan" on:click={abrirScanner}>📷 Escanear código de barras</button>
  <p class="ou">ou adicione manualmente</p>

  <div class="cats">
    {#each CATS as c}
      <button
        class="cat"
        class:active={selCat === c}
        on:click={() => selCat = c}
        title={c}
      >{c}</button>
    {/each}
    <button class="cat cat-custom" on:click={openEmojiPicker} title="Emoji Personalizado">
      🎨
    </button>
  </div>

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
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(60, 32, 48, 0.05);
  }
  .card.focused {
    border-color: var(--accent);
    box-shadow: 0 8px 24px rgba(60, 32, 48, 0.1);
    transform: scale(1.01);
  }
  .card.shake {
    animation: shakeAnim 0.4s ease;
  }
  @keyframes shakeAnim {
    0%,100% { transform: translateX(0); }
    15%      { transform: translateX(-7px); }
    35%      { transform: translateX(7px); }
    55%      { transform: translateX(-4px); }
    75%      { transform: translateX(4px); }
  }

  .aviso-adicionado {
    background: var(--green, #6a9955);
    color: var(--surface);
    font-weight: 800;
    font-size: 13px;
    text-align: center;
    padding: 10px;
    border-radius: var(--radius-md);
    margin-bottom: 10px;
  }
  .btn-scan {
    width: 100%;
    padding: 14px;
    margin-bottom: 8px;
    border-radius: var(--radius-lg);
    border: 1.5px dashed var(--accent);
    background: var(--surface2);
    color: var(--accent);
    font-family: inherit;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
  }
  .btn-scan:active { transform: scale(0.97); }
  .ou {
    text-align: center;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text3);
    margin: 0 0 14px;
  }

  .cats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 18px;
  }

  .cat {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 10px 4px;
    font-size: 22px;
    cursor: pointer;
    line-height: 1;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cat.active {
    border-color: var(--accent);
    background: var(--surface2);
    box-shadow: 0 0 0 3px rgba(194, 84, 110, 0.15);
    transform: scale(1.08);
  }
  .cat:active { transform: scale(0.9); }

  .fields { display: flex; gap: 12px; margin-bottom: 16px; }
  .fw { flex: 1; position: relative; }
  .fw.fw-price { flex: 0 0 110px; }

  .fw label {
    position: absolute;
    top: 10px; left: 14px;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text3);
    pointer-events: none;
    transition: color 0.2s;
  }
  .fw:focus-within label { color: var(--accent); }

  .fw input {
    width: 100%;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 18px;
    padding: 28px 14px 12px;
    color: var(--text);
    font-family: inherit;
    font-size: 16px;
    font-weight: 700;
    outline: none;
    transition: all 0.2s;
    -webkit-appearance: none;
  }
  .fw input::placeholder { color: var(--text3); opacity: 0.5; font-weight: 500; }
  .fw input:focus {
    border-color: var(--accent);
    background: var(--surface);
  }

  .btn-add {
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 18px;
    padding: 16px;
    font-family: inherit;
    font-weight: 900;
    font-size: 16px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(194, 84, 110, 0.3);
    -webkit-tap-highlight-color: transparent;
  }
  .btn-add.is-template {
    background: var(--yellow);
    box-shadow: 0 6px 20px rgba(212, 168, 67, 0.3);
  }
  .btn-add:hover  { transform: translateY(-2px); }
  .btn-add:active { transform: scale(0.96); box-shadow: 0 4px 12px rgba(194, 84, 110, 0.2); }
</style>
