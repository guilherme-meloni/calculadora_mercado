<script>
  import { onMount } from 'svelte'
  import { appStore, items } from './lib/store.js'
  import TopBar from './components/TopBar.svelte'
  import ListManager from './components/ListManager.svelte'
  import TemplateManager from './components/TemplateManager.svelte'
  import HistoryManager from './components/HistoryManager.svelte'
  import InputCard from './components/InputCard.svelte'
  import ItemList from './components/ItemList.svelte'
  import TotalBar from './components/TotalBar.svelte'
  import Modal from './components/Modal.svelte'

  let isDesktop = false
  let modalConfig = null // { title, message, type, confirm, cancel, value }

  $: remainingItems = $items.filter(i => !i.checked).length

  // Atualiza o Badge do App (Bolinha no ícone)
  $: {
    if ('setAppBadge' in navigator) {
      if (remainingItems > 0) {
        navigator.setAppBadge(remainingItems).catch(() => {});
      } else {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }

  function checkSize() {
    isDesktop = window.innerWidth >= 768
  }

  function showModal(config) {
    return new Promise((resolve) => {
      modalConfig = {
        ...config,
        confirm: (val) => {
          modalConfig = null;
          resolve(val || true);
        },
        cancel: () => {
          modalConfig = null;
          resolve(false);
        }
      };
    });
  }

  // Sobrescreve funções globais para usar o modal bonito
  onMount(() => {
    window.customConfirm = (msg) => showModal({ title: 'Confirmação', message: msg, type: 'confirm' });
    window.customPrompt = (msg) => showModal({ title: 'Novo Item', message: msg, type: 'prompt' });
  });

  async function handleShortcuts() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    if (action === 'new-list') {
      const name = await showModal({ title: 'Nova Lista', message: 'Como se chama sua lista?', type: 'prompt' });
      if (name) appStore.createList(name);
    } else if (action === 'new-template') {
      const name = await showModal({ title: 'Novo Template', message: 'Nome para o modelo:', type: 'prompt' });
      if (name) appStore.createList(name, true);
    } else if (action === 'new-product') {
      setTimeout(() => {
        document.getElementById('inp-nome')?.focus();
      }, 500);
    }
    
    if (action) window.history.replaceState({}, '', '/');
  }

  onMount(() => {
    checkSize()
    handleShortcuts()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  })
</script>

<div class="app-layout" class:desktop={isDesktop}>
  <header class="main-header">
    <TopBar />
  </header>

  <div class="content-wrapper">
    <aside class="sidebar">
      <ListManager />
      <div class="divider"></div>
      <TemplateManager />
      <div class="divider"></div>
      <HistoryManager />
    </aside>

    <main class="main-content">
      <InputCard />
      <ItemList />
    </main>
  </div>

  <TotalBar />

  {#if modalConfig}
    <Modal 
      {...modalConfig} 
      on:confirm={(e) => modalConfig.confirm(e.detail)} 
      on:cancel={modalConfig.cancel} 
    />
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

  /* ─── Reset ─────────────────────────────────────────── */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ─── Paleta: Gruvbox Pastel Rosa ───────────────────── */
  :global(:root) {
    --bg:       #FFF8F5;
    --surface:  #FFFFFF;
    --surface2: #FFF0F5;
    --border:   #F2C4CE;
    --border2:  #E8A0B0;
    --accent:   #C2546E;
    --accent2:  #A8C5A0;
    --green:    #6B9E6B;
    --red:      #D95858;
    --yellow:   #D4A843;
    --blue:     #7BAFC4;
    --text:     #3C2030;
    --text2:    #6B3040;
    --text3:    #B07088;
    
    --sidebar-bg: #FDF1F3;
  }

  :global(html, body) {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Nunito', -apple-system, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  .app-layout {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    padding-bottom: 140px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
  }

  .divider {
    height: 1px;
    background: var(--border);
    margin: 0 16px 20px;
    opacity: 0.5;
  }

  /* ─── Desktop Layout ────────────────────────────────── */
  .desktop {
    padding-bottom: 120px;
  }

  @media (min-width: 768px) {
    .content-wrapper {
      flex-direction: row;
      max-width: 1200px;
      gap: 20px;
      padding: 20px;
      align-items: flex-start;
    }

    .sidebar {
      width: 320px;
      background: var(--sidebar-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 20px 0;
      position: sticky;
      top: 20px;
      max-height: calc(100vh - 160px);
      overflow-y: auto;
    }

    .main-content {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
    }
    
    .main-header {
      padding-top: 10px;
    }

    :global(body) {
      font-size: 17px;
    }
  }
</style>
