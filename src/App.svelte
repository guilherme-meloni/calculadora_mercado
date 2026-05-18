<script>
  import TopBar from './components/TopBar.svelte'
  import ListManager from './components/ListManager.svelte'
  import InputCard from './components/InputCard.svelte'
  import ItemList from './components/ItemList.svelte'
  import TotalBar from './components/TotalBar.svelte'
</script>

<div class="app">
  <TopBar />
  <ListManager />
  <InputCard />
  <ItemList />
</div>
<TotalBar />

<style>
  /* CSS global via :global() */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(:root) {
    --bg: #282828;
    --surface: #3c3836;
    --surface2: #504945;
    --border: #665c54;
    --border2: #7c6f64;
    --accent: #d3869b;
    --accent2: #b8bb26;
    --green: #b8bb26;
    --red: #fb4934;
    --yellow: #fabd2f;
    --blue: #83a598;
    --text: #ebdbb2;
    --text2: #d5c4a1;
    --text3: #a89984;
  }

  :global(html, body) {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    padding-bottom: 170px;
    min-height: 100dvh;
  }
</style>
