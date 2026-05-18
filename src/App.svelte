<script>
  import TopBar from './components/TopBar.svelte'
  import InputCard from './components/InputCard.svelte'
  import ItemList from './components/ItemList.svelte'
  import TotalBar from './components/TotalBar.svelte'
</script>

<div class="app">
  <TopBar />
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
    --bg: #0c0c0e;
    --surface: #131316;
    --surface2: #1a1a1f;
    --border: #23232a;
    --border2: #2d2d38;
    --accent: #7c6dfa;
    --accent2: #a78bfa;
    --green: #34d399;
    --red: #f87171;
    --text: #f1f0f5;
    --text2: #9898b3;
    --text3: #55556a;
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
