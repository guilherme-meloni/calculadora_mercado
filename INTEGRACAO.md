# Como encaixar isso no mercado-calc existente

Nada aqui reescreve o que já existe — são peças novas que se conectam ao `store.js` e ao `App.svelte` que você já tem.

## 0. Tudo sobe junto (Docker)
Incluí um `docker-compose.yml` pronto pra colar na raiz do seu projeto (substitui o que você já
tem lá — ele mantém o serviço `calculadora` que já existia e adiciona o `mercado-api` do lado).
Com ele, `docker compose up -d --build` sobe os dois containers de uma vez: o site na 3019 e a
API na 3011, com a base SQLite persistida em `./mercado-api/data`.

Só falta um ajuste manual no **Dockerfile do frontend** (não o do mercado-api, o outro): veja
`AJUSTE-NO-DOCKERFILE-DO-FRONTEND.txt`. É necessário porque o Vite grava a URL da API dentro do
JavaScript no momento do build — sem isso o app não sabe pra onde mandar as chamadas.

O `docker-compose.yml` já vem com `http://100.89.81.37:3011` (seu IP Tailscale) como
`VITE_MERCADO_API_URL` — troque se esse IP mudar.

Se preferir rodar sem Docker pra testar rápido: `cd mercado-api && npm install && npm start`
(sobe em `:3011`). Pra trocar a porta, sem precisar editar código: `PORT=3012 npm start`.

**Sobre o `better-sqlite3`:** troquei pelo `node:sqlite`, que já vem embutido no Node (estável a
partir da v24) — zero dependência nativa pra compilar, resolve o erro de binding que você teve.
O Dockerfile do backend já usa `node:24-alpine` por causa disso.

## 1. Frontend (se for integrar sem Docker por enquanto)
Copie os 3 arquivos de `src/components/` e o `src/lib/productApi.js` para o mesmo lugar no seu projeto.

Adicione no `.env` (raiz do projeto — copie o `.env.example` incluso):
```
VITE_MERCADO_API_URL=http://SEU_SERVIDOR:3011
```
(use o IP/hostname do Tailscale se for acessar só pela VPN)

## 3. Ligando no App.svelte
No seu App.svelte, adicione um estado pra abrir o scanner (parecido com como você já abre o BottomSheet/Modal):

```svelte
<script>
  import BarcodeScanner from './components/BarcodeScanner.svelte'
  import ProductLookupCard from './components/ProductLookupCard.svelte'
  import { buscarProduto, salvarProduto, registrarPreco } from './lib/productApi.js'
  import { appStore } from './lib/store.js'

  let scannerAberto = false
  let produtoEncontrado = null
  let codigoAtual = ''

  async function aoEscanear(e) {
    codigoAtual = e.detail.codigo
    scannerAberto = false
    produtoEncontrado = await buscarProduto(codigoAtual)
  }

  async function aoConfirmar(e) {
    const { produto, preco } = e.detail
    if (!produto.jaConhecido) await salvarProduto(produto)
    await registrarPreco(produto.codigo_barras, preco)
    appStore.addListItem(produto.nome, preco, produto.categoria || '🛒')
    produtoEncontrado = null
  }
</script>

{#if scannerAberto}
  <BarcodeScanner on:scan={aoEscanear} />
{/if}

{#if produtoEncontrado !== undefined && codigoAtual}
  <ProductLookupCard produto={produtoEncontrado} codigo={codigoAtual} on:confirmar={aoConfirmar} />
{/if}
```

Coloque um botão no seu `InputCard.svelte` ou `TopBar.svelte` (mesmo estilo `.glass` dos outros) que só faz `scannerAberto = true`.

## 4. Gráfico de preço
Em qualquer lugar que mostre detalhe de um produto (ex: um clique no `ItemRow.svelte`), busque e mostre:

```svelte
<script>
  import { buscarMediaMensal } from './lib/productApi.js'
  import PriceChart from './components/PriceChart.svelte'
  let historico = []
  buscarMediaMensal(item.codigo_barras).then(d => historico = d)
</script>
<PriceChart dados={historico} />
```

## 5. Offline
Sem rede, `buscarProduto` retorna `null` silenciosamente (todos os `fetch` têm `try/catch`) e o `ProductLookupCard` cai automaticamente no modo de cadastro manual — o app continua funcionando exatamente como hoje.

## Sobre o redesign "clean cute fofo"
Não mexi nas cores nem na geometria — usei exatamente seus tokens atuais (`--accent` #C2546E, `radius-xl` 32px, `.glass`, Nunito). Se quiser ir além disso (nova paleta, novos componentes visuais, animações), me chama numa conversa separada focada só nisso — aqui o objetivo foi entregar peças funcionais que já respeitam o visual que você tem hoje sem arriscar quebrar nada.
