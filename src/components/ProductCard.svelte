<script>
  import { Check, X, Plus, Minus } from 'lucide-svelte'
  import { itemsActions, appStore } from '../lib/store.js'
  import { formatBRL, parsePrice } from '../lib/utils.js'
  import { lightTap, deletar as vibrarDeletar } from '../lib/haptics.js'

  export let item
  export let isTemplate = false

  let expandido = false
  $: subtotal = item.preco * item.qty

  async function editar() {
    const result = await window.customEditItem(item)
    if (result) {
      appStore.editItem(item.id, {
        nome: result.nome.trim(),
        preco: parsePrice(result.preco),
        cat: result.cat
      })
    }
  }

  function toggleChecked(e) {
    e.stopPropagation()
    if (!item.checked && item.preco <= 0) { editar(); return }
    lightTap()
    itemsActions.toggleChecked(item.id)
  }

  function mudarQtd(delta) {
    lightTap()
    itemsActions.changeQty(item.id, delta)
  }

  function remover() {
    vibrarDeletar()
    itemsActions.remove(item.id)
  }

  function aoTocarCard() {
    if (isTemplate) return
    expandido = !expandido
  }
</script>

<div
  class="rounded-3xl bg-surface border border-border-soft shadow-soft p-3 transition-opacity"
  class:opacity-60={item.checked && !isTemplate}
>
  <button type="button" class="w-full flex items-center gap-3 text-left" on:click={aoTocarCard}>
    {#if !isTemplate}
      <button
        type="button"
        class="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
        class:bg-success={item.checked}
        class:border-transparent={item.checked}
        class:bg-brand-secondary={!item.checked}
        class:border-border-soft={!item.checked}
        on:click={toggleChecked}
        aria-label="Marcar como pego"
      >
        {#if item.checked}<Check size={16} color="white" strokeWidth={3} />{/if}
      </button>
    {/if}

    <div class="w-9 h-9 rounded-xl bg-brand-secondary flex items-center justify-center text-xl shrink-0">
      {item.cat}
    </div>

    <div class="flex-1 min-w-0">
      <p class="font-extrabold text-sm text-text-main truncate" class:line-through={item.checked && !isTemplate}>
        {item.nome}
      </p>
      <button type="button" class="text-xs font-bold" class:text-text-muted={item.preco > 0} class:text-brand-primary={item.preco <= 0} on:click|stopPropagation={editar}>
        {item.preco > 0 ? formatBRL(item.preco) : 'Definir preço'} <span class="font-medium opacity-70">/ un</span>
      </button>
    </div>

    <span class="font-black text-brand-primary text-base whitespace-nowrap">{formatBRL(subtotal)}</span>
  </button>

  {#if expandido && !isTemplate}
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-border-soft">
      <div class="flex items-center bg-brand-secondary rounded-xl overflow-hidden">
        <button type="button" class="w-9 h-9 flex items-center justify-center active:bg-border-soft" on:click={() => mudarQtd(-1)} aria-label="Diminuir quantidade">
          <Minus size={16} />
        </button>
        <span class="w-8 text-center font-black text-sm">{item.qty}</span>
        <button type="button" class="w-9 h-9 flex items-center justify-center active:bg-border-soft" on:click={() => mudarQtd(1)} aria-label="Aumentar quantidade">
          <Plus size={16} />
        </button>
      </div>

      <button type="button" class="w-9 h-9 rounded-xl bg-brand-secondary text-text-muted flex items-center justify-center active:text-brand-primary" on:click={remover} aria-label="Remover item">
        <X size={16} />
      </button>
    </div>
  {/if}
</div>
