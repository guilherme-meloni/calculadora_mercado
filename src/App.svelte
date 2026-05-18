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
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

  /* ─── Reset ─────────────────────────────────────────── */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ─── Fonte fofa: Nunito ─────────────────────────────── */

  /* ─── Paleta: Gruvbox Pastel Rosa ───────────────────── */
  :global(:root) {
    /* Fundos */
    --bg:       #FFF8F5;   /* creme quente — fundo da página   */
    --surface:  #FFFFFF;   /* branco puro — cards              */
    --surface2: #FFF0F5;   /* rosa claríssimo — hover/inputs   */

    /* Bordas */
    --border:   #F2C4CE;   /* rosa pastel suave                */
    --border2:  #E8A0B0;   /* rosa médio — hover/focus         */

    /* Acentos principais */
    --accent:   #C2546E;   /* rosa âncora — botões, destaque   */
    --accent2:  #A8C5A0;   /* verde feira — label ativo        */

    /* Semânticos */
    --green:    #6B9E6B;   /* confirmações, subtotais          */
    --red:      #D95858;   /* erros, remover                   */
    --yellow:   #D4A843;   /* avisos, estrelas                 */
    --blue:     #7BAFC4;   /* infos, links                     */

    /* Texto */
    --text:     #3C2030;   /* quase-preto quente — principal   */
    --text2:    #6B3040;   /* marrom-rosa — secundário         */
    --text3:    #B07088;   /* rosa médio — dicas, labels       */
  }

  /* ─── Base ───────────────────────────────────────────── */
  :global(html, body) {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Nunito', -apple-system, 'SF Pro Display', system-ui, sans-serif;
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
