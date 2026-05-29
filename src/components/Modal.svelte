<script>
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let title = 'Confirmação'
  export let message = ''
  export let confirmText = 'Confirmar'
  export let cancelText = 'Cancelar'
  export let type = 'confirm' // 'confirm', 'prompt', 'import' ou 'edit-item'
  export let value = ''
  export let fields = [] // Para type 'edit-item'

  const dispatch = createEventDispatcher()

  function close() {
    dispatch('cancel')
  }

  function confirm() {
    dispatch('confirm', value)
  }

  function onKey(e) {
    if (e.key === 'Enter' && type !== 'import') confirm()
    if (e.key === 'Escape') close()
  }

  function autofocus(node) {
    setTimeout(() => node.focus(), 50);
  }
</script>

<div 
  class="modal-overlay" 
  on:mousedown|self={close} 
  transition:fade={{ duration: 200 }} 
  role="button" 
  tabindex="-1"
>
  <div class="modal-card" transition:scale={{ duration: 300, start: 0.9, opacity: 0 }} role="dialog">
    <div class="header">
      <div class="title">{title}</div>
      <button class="close-top" on:click={close} aria-label="Fechar">✕</button>
    </div>
    
    <div class="body">
      {#if message}
        <p class="msg">{message}</p>
      {/if}
      
      {#if type === 'prompt'}
        <input 
          type="text" 
          bind:value 
          on:keydown={onKey} 
          placeholder="Digite aqui..."
          use:autofocus
        />
      {:else}
        {#if type === 'import'}
          <textarea
            bind:value
            placeholder="Formato: Nome;Preço;Quantidade&#10;Ex: Leite;5,50;2&#10;Suco;3,00;1"
            rows="6"
            use:autofocus
          ></textarea>
          <p class="hint">Dica: Use ponto e vírgula para separar os dados.</p>
        {:else if type === 'edit-item'}
          <div class="edit-fields">
            <div class="field-group">
              <label>Nome do Produto</label>
              <input type="text" bind:value={value.nome} use:autofocus on:keydown={onKey} />
            </div>
            <div class="field-group">
              <label>Preço</label>
              <input type="text" inputmode="decimal" bind:value={value.preco} on:keydown={onKey} />
            </div>
            <div class="field-group">
              <label>Ícone / Categoria</label>
              <div class="cat-selector">
                {#each ['🛒','🥩','🥬','🥛','🧴','🍞','🧃','🧹','🐾','🍬','🍎','🍗','🍺','🍕'] as c}
                  <button 
                    class="cat-opt" 
                    class:active={value.cat === c} 
                    on:click={() => value.cat = c}
                  >{c}</button>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>

    <div class="footer">
      <button class="btn-cancel" on:click={close}>{cancelText}</button>
      <button class="btn-confirm" on:click={confirm}>{confirmText}</button>
    </div>
  </div>
</div>

<style>
  /* ... estilos existentes ... */
  .cat-selector {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    background: var(--surface2);
    padding: 10px;
    border-radius: 16px;
    border: 1.5px solid var(--border);
  }
  .cat-opt {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 0;
    height: 36px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cat-opt.active {
    border-color: var(--accent);
    background: var(--surface2);
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(194, 84, 110, 0.15);
  }
  /* Ajuste no seletor existente para garantir que não quebre */
  .field-group input {
    margin-bottom: 4px;
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(40, 20, 30, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 28px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.25);
    overflow: hidden;
  }
  
  .header {
    padding: 24px 24px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 20px;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .close-top {
    background: var(--surface2);
    border: 1px solid var(--border);
    width: 32px; height: 32px;
    border-radius: 50%;
    color: var(--text3);
    font-size: 14px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  .body {
    padding: 10px 24px 24px;
  }

  .msg {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 20px;
  }

  input, textarea {
    width: 100%;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 14px 18px;
    font-family: inherit;
    font-size: 16px;
    color: var(--text);
    outline: none;
    transition: all 0.2s;
  }
  input:focus, textarea:focus {
    border-color: var(--accent);
    background: var(--surface);
    box-shadow: 0 0 0 4px rgba(194, 84, 110, 0.1);
  }

  textarea {
    resize: none;
    font-size: 14px;
    line-height: 1.6;
  }

  .hint {
    font-size: 12px;
    color: var(--text3);
    margin-top: 10px;
    font-weight: 600;
  }

  .edit-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .field-group label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--text3);
    letter-spacing: 0.05em;
    padding-left: 4px;
  }

  .footer {
    padding: 0 24px 24px;
    display: flex;
    gap: 12px;
  }

  button {
    flex: 1;
    padding: 16px;
    border-radius: 18px;
    font-family: inherit;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--text2);
  }

  .btn-confirm {
    background: var(--accent);
    border: none;
    color: white;
    box-shadow: 0 6px 20px rgba(194, 84, 110, 0.3);
  }
  .btn-confirm:active { transform: scale(0.96); }
</style>
