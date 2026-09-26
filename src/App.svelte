<script>
  import { onMount } from 'svelte'
  import { appStore, items, bottomSheetOpen, activeView } from './lib/store.js'
  import TopBar from './components/TopBar.svelte'
  import BottomSheet from './components/BottomSheet.svelte'
  import TotalBar from './components/TotalBar.svelte'
  import InputCard from './components/InputCard.svelte'
  import ItemList from './components/ItemList.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import Modal from './components/Modal.svelte'
  import Home from './components/Home.svelte'

  let modalConfig = null

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

  onMount(() => {
    window.customConfirm = (msg) => showModal({ title: 'Confirmação', message: msg, type: 'confirm' });
    window.customPrompt = (msg) => showModal({ title: 'Novo Item', message: msg, type: 'prompt' });
    window.customEditItem = (item) => showModal({ 
      title: 'Editar Item', 
      type: 'edit-item', 
      value: { 
        nome: item.nome, 
        preco: item.preco.toString().replace('.', ','),
        cat: item.cat || '🛒'
      } 
    });

    const openImport = async () => {
      const text = await showModal({ 
        title: 'Importar Lista', 
        message: 'Cole abaixo o texto gerado pela IA ou sua lista manual.',
        type: 'import' 
      });
      if (text) appStore.importItems(text);
    };

    window.addEventListener('open-import', openImport);
    return () => window.removeEventListener('open-import', openImport);
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
    handleShortcuts()
  })
</script>

<div class="app-container">
  <TopBar />

  <div class="layout-wrapper">
    <!-- Sidebar: Desktop only -->
    <aside class="sidebar-aside glass glass-heavy">
      <Sidebar />
    </aside>

    <!-- Main Content -->
    <main class="main-view">
      {#if $activeView === 'home'}
        <Home />
      {:else}
        <button class="voltar" on:click={() => activeView.set('home')}>← Início</button>
        <InputCard />
        <ItemList />
      {/if}
      <div class="footer-spacer" aria-hidden="true"></div>
    </main>
  </div>

  {#if $activeView === 'calculadora' && !$bottomSheetOpen}
    <TotalBar />
  {/if}
  <BottomSheet />

  {#if modalConfig}
    <Modal 
      {...modalConfig} 
      on:confirm={(e) => modalConfig.confirm(e.detail)} 
      on:cancel={modalConfig.cancel} 
    />
  {/if}
</div>

<style>
  .app-container {
    min-height: 100dvh;
    padding-top: calc(70px + env(safe-area-inset-top, 0px));
  }

  .layout-wrapper {
    display: block;
    padding: 0 12px;
  }

  .sidebar-aside {
    display: none;
  }

  .main-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .footer-spacer {
    height: 110px;
  }

  .voltar {
    align-self: flex-start;
    background: none;
    border: none;
    color: var(--text2);
    font-weight: 800;
    font-size: 0.9rem;
    padding: 6px 4px;
    cursor: pointer;
  }
  .voltar:active { opacity: 0.6; }

  /* Desktop Layout */
  @media (min-width: 768px) {
    .layout-wrapper {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 32px;
      align-items: start;
    }

    .sidebar-aside {
      display: block;
      border-radius: var(--radius-lg);
      padding: 24px;
      position: sticky;
      top: calc(90px + env(safe-area-inset-top, 0px));
      height: fit-content;
      max-height: calc(100dvh - 140px);
      overflow-y: auto;
      scrollbar-width: none;
    }
    .sidebar-aside::-webkit-scrollbar { display: none; }
  }
</style>
