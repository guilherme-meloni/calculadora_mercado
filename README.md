<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1000&color=22C55E&center=true&vCenter=true&width=600&lines=🛒+Calculadora+de+Mercado;Lista+inteligente+no+seu+navegador;Zero+papel.+Zero+surpresas+no+caixa." alt="Typing SVG" />

<br/>

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Serve-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br/>

> **Chega de lista no papel. Controle seus gastos em tempo real, crie múltiplas listas e nunca mais leve susto no caixa.**

<br/>

---

</div>

## ✨ Por que esta calculadora é diferente?

Não é mais uma lista de compras. É uma ferramenta de **controle financeiro real**, pensada para o dia a dia brasileiro.

| 🃏 Cards Interativos | 💰 Controle em Tempo Real | 👫 Múltiplas Listas |
|---|---|---|
| Cada produto vira um bloco visual completo. Esqueça as listas monótonas. | Ajuste quantidades com `+` e `−`. O total recalcula na hora — você sabe exatamente o que está pesando no orçamento antes de chegar no caixa. | Crie listas independentes: *Feira Semanal*, *Churrasco com os Amigos*, *Compras do Mês*. Perfeito para casais e parceiros. |

---

## 🚀 Stack Tecnológica

```
⚡ Svelte      → Sem Virtual DOM. Compila direto pra JS puro. Rápido pra caramba.
🔥 Vite        → Build ultra-rápido com Hot Module Replacement (HMR).
🐋 Docker      → Container isolado. Sobe em segundos em qualquer servidor.
⚙️  Nginx       → Serve os arquivos estáticos com mínimo consumo de memória.
📦 LocalStorage → Suas listas ficam salvas no navegador. Sem backend. Sem cadastro.
```

---

## 🏗️ Arquitetura do Projeto

```
📁 calculadora-mercado/
│
├── 📁 src/
│   ├── 📁 components/        # TopBar, InputCard, ItemList e outros blocos visuais
│   ├── 📁 lib/
│   │   └── 📄 store.js       # ❤️ O coração do app — Svelte Stores + LocalStorage
│   └── 📄 App.svelte         # Componente raiz que orquestra tudo
│
├── 📄 nginx.conf             # Roteamento SPA (evita 404 no refresh)
├── 📄 Dockerfile             # Imagem de produção otimizada
└── 📄 docker-compose.yml     # Sobe o container com um comando só
```

---

## 🧠 Como a Lógica Funciona

Toda a inteligência mora em **`src/lib/store.js`**.

**Reatividade com Svelte Stores**
O estado (listas, itens, lista ativa) vive em `writable stores`. Qualquer mudança reflete instantaneamente na tela — sem manipulação manual de DOM.

**Persistência Automática com LocalStorage**
Cada alteração é serializada em JSON e salva no navegador via `subscribe`. Ao abrir o app novamente, `loadData` restaura tudo exatamente como estava.

**Estado Derivado (Derived Store)**
A lista exibida na tela usa um `derived store` que monitora qual lista está ativa (`activeId`) e filtra apenas os itens correspondentes — mantendo os componentes leves e focados.

### 🔄 Fluxo de Dados

```
  Usuário ajusta quantidade
          │
          ▼
    Invoca função
   (ex: addListItem)
          │
          ▼
   Atualiza o State
   (Svelte Store)
          │
          ├──────────────────────────────────┐
          ▼                                  ▼
  Re-renderiza o DOM                 Salva no LocalStorage
  (reatividade automática)           (subscribe automático)
```

---

## 🐋 Deploy com Docker (Produção)

Sobe tudo com **um único comando**:

```bash
docker-compose up -d --build
```

Acesse em: **http://localhost:80**

O que acontece por baixo dos panos:
- O Docker executa `npm run build` internamente
- Gera os arquivos estáticos otimizados em `dist/`
- O Nginx serve essa pasta com consumo mínimo de memória
- O `try_files` no `nginx.conf` garante que rotas virtuais da SPA nunca quebrem com 404

---

## 💻 Desenvolvimento Local

**Pré-requisito:** Node.js instalado.

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/calculadora-mercado.git
cd calculadora-mercado

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Abra **http://localhost:5173** e divirta-se. 🎉

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">

Feito com ☕ e muito `svelte store` por **você**

⭐ Se esse projeto te ajudou, deixa uma estrelinha — significa muito!

</div>
