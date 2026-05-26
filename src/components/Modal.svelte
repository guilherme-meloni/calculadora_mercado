<script>
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let title = 'Confirmação'
  export let message = ''
  export let confirmText = 'Confirmar'
  export let cancelText = 'Cancelar'
  export let type = 'confirm' // 'confirm' ou 'prompt'
  export let value = ''

  const dispatch = createEventDispatcher()

  function close() {
    dispatch('cancel')
  }

  function confirm() {
    dispatch('confirm', value)
  }

  function onKey(e) {
    if (e.key === 'Enter') confirm()
    if (e.key === 'Escape') close()
  }

  function autofocus(node) {
    node.focus();
  }
</script>

<div 
  class="modal-overlay" 
  on:click|self={close} 
  on:keydown={e => e.key === 'Escape' && close()} 
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
      {/if}
    </div>

    <div class="footer">
      <button class="btn-cancel" on:click={close}>{cancelText}</button>
      <button class="btn-confirm" on:click={confirm}>{confirmText}</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(60, 32, 48, 0.4);
    backdrop-filter: blur(4px);
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
    max-width: 360px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    overflow: hidden;
  }

  .header {
    padding: 20px 24px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
  }

  .close-top {
    background: none; border: none;
    color: var(--text3);
    font-size: 18px;
    cursor: pointer;
  }

  .body {
    padding: 10px 24px 24px;
  }

  .msg {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  input {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    font-family: inherit;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus {
    border-color: var(--accent);
  }

  .footer {
    padding: 16px 24px 24px;
    display: flex;
    gap: 12px;
  }

  button {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel {
    background: var(--bg);
    border: 1.5px solid var(--border);
    color: var(--text3);
  }

  .btn-confirm {
    background: var(--accent);
    border: none;
    color: white;
    box-shadow: 0 4px 12px rgba(194, 84, 110, 0.3);
  }
  .btn-confirm:active { transform: scale(0.96); }
</style>
