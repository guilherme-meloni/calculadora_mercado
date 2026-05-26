<script>
  import ListsPanel from './panels/ListsPanel.svelte';
  import TemplatesPanel from './panels/TemplatesPanel.svelte';
  import HistoryPanel from './panels/HistoryPanel.svelte';

  let openSection = 'lists'; // 'lists' | 'templates' | 'history'
</script>

<div class="sidebar-inner">
  <div class="sidebar-logo">
    <span>🍬</span>
    <h1>MarketMallow</h1>
  </div>

  {#each [
    { key: 'lists',     title: '📋 Minhas Listas',    component: ListsPanel },
    { key: 'templates', title: '⭐ Templates',  component: TemplatesPanel },
    { key: 'history',   title: '🕐 Histórico', component: HistoryPanel },
  ] as section}
    <div class="sidebar-section">
      <button
        class="sidebar-section-header"
        on:click={() => openSection = openSection === section.key ? null : section.key}
        aria-expanded={openSection === section.key}
      >
        <span>{section.title}</span>
        <span aria-hidden="true">{openSection === section.key ? '▲' : '▼'}</span>
      </button>
      {#if openSection === section.key}
        <div class="sidebar-section-body" style="animation: accordionDown 0.25s ease forwards;">
          <svelte:component this={section.component} />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
.sidebar-inner { display: flex; flex-direction: column; gap: 12px; }
.sidebar-logo {
  display: flex; align-items: center; gap: 8px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 8px;
}
.sidebar-logo span { font-size: 1.5rem; }
.sidebar-logo h1 { font-size: 1.1rem; font-weight: 900; color: var(--text); margin: 0; }

.sidebar-section {
  border-radius: var(--radius-md);
  overflow: hidden;
}
.sidebar-section-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.sidebar-section-header:hover { border-color: var(--border2); background: var(--surface); }

.sidebar-section-body {
  padding: 12px 4px 4px;
}
</style>
