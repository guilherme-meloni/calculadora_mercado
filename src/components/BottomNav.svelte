<script>
  import { Home, Clock, Package, ListChecks, Plus } from 'lucide-svelte'
  import { activeView, bottomSheetContent, bottomSheetOpen } from '../lib/store.js'
  import { lightTap } from '../lib/haptics.js'

  let mostrarEscolha = false

  function irPara(view) {
    lightTap()
    mostrarEscolha = false
    activeView.set(view)
  }

  function abrirPainel(nome) {
    lightTap()
    mostrarEscolha = false
    bottomSheetContent.set(nome)
    bottomSheetOpen.set(true)
  }

  function toggleEscolha() {
    lightTap()
    mostrarEscolha = !mostrarEscolha
  }
</script>

{#if mostrarEscolha}
  <div class="fixed inset-0 bg-text-main/20 z-[300]" on:click={() => mostrarEscolha = false}></div>
  <div class="fixed left-1/2 -translate-x-1/2 bottom-24 z-[301] w-[88%] max-w-xs bg-surface rounded-3xl shadow-soft border border-border-soft p-3 flex flex-col gap-2">
    <button class="flex items-center gap-3 p-3 rounded-2xl bg-brand-secondary text-text-main font-extrabold text-sm" on:click={() => abrirPainel('scanner')}>
      📷 Escanear código
    </button>
    <button class="flex items-center gap-3 p-3 rounded-2xl bg-brand-secondary text-text-main font-extrabold text-sm" on:click={() => abrirPainel('manual')}>
      ⌨️ Digitar manual
    </button>
  </div>
{/if}

<nav class="md:hidden fixed bottom-0 left-0 right-0 z-[200] bg-surface border-t border-border-soft flex items-center justify-around px-2"
     style="height: calc(64px + env(safe-area-inset-bottom, 0px)); padding-bottom: env(safe-area-inset-bottom, 0px);">
  <button class="flex flex-col items-center gap-0.5 w-14 py-1" class:text-brand-primary={$activeView === 'home'} class:text-text-muted={$activeView !== 'home'} on:click={() => irPara('home')}>
    <Home size={20} />
    <span class="text-[10px] font-bold">Início</span>
  </button>

  <button class="flex flex-col items-center gap-0.5 w-14 py-1 text-text-muted" on:click={() => abrirPainel('history')}>
    <Clock size={20} />
    <span class="text-[10px] font-bold">Histórico</span>
  </button>

  <div class="w-14"></div>

  <button class="flex flex-col items-center gap-0.5 w-14 py-1 text-text-muted" on:click={() => abrirPainel('products')}>
    <Package size={20} />
    <span class="text-[10px] font-bold">Dados</span>
  </button>

  <button class="flex flex-col items-center gap-0.5 w-14 py-1" class:text-brand-primary={$activeView === 'calculadora'} class:text-text-muted={$activeView !== 'calculadora'} on:click={() => abrirPainel('lists')}>
    <ListChecks size={20} />
    <span class="text-[10px] font-bold">Listas</span>
  </button>
</nav>

<button
  class="md:hidden fixed left-1/2 -translate-x-1/2 z-[210] w-14 h-14 rounded-full bg-brand-primary text-white shadow-soft flex items-center justify-center active:bg-brand-primary-hover"
  style="bottom: calc(32px + env(safe-area-inset-bottom, 0px));"
  on:click={toggleEscolha}
  aria-label="Adicionar produto"
>
  <Plus size={26} strokeWidth={3} />
</button>
