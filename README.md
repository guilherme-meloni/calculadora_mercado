📝 Sobre o Projeto

A Calculadora de Compras de Mercado é uma aplicação web moderna e ultra-rápida, desenvolvida no formato Single Page Application (SPA). Ela foi projetada para substituir as listas de papel ou blocos de notas tradicionais, trazendo inteligência, clareza visual e controle financeiro direto para o seu navegador.

💡 Por que esta calculadora é diferente?

Visualização Baseada em Blocos (Cards): Esqueça as listas monótonas. Cada produto adicionado funciona como um bloco interativo completo, organizando visualmente suas compras.

Percepção e Controle de Gastos: Insira o preço unitário e ajuste a quantidade instantaneamente através dos botões + e -. O valor de cada item e o somatório geral do carrinho são recalculados em tempo real, permitindo que você identifique na hora o que está pesando mais no orçamento.

Múltiplas Listas para Casais e Parcerias: Crie e salve listas independentes. Ficou muito mais fácil planejar a feira a dois ou separar as contas (ex: "Lista do Mês", "Churrasco com os Amigos", "Feira Semanal"). Faça as compras de forma transparente e sem surpresas no caixa.

🛠️ Stack Tecnológica

Framework: Svelte

Diferencial: Diferente do React ou Vue, o Svelte não utiliza um "Virtual DOM". Ele compila o código em JavaScript puro altamente otimizado diretamente no momento do build, proporcionando performance excelente e carregamento instantâneo.

Ferramenta de Build: Vite — Garante um fluxo de desenvolvimento ágil com Hot Module Replacement (HMR) e empacotamento ideal.

Linguagem: JavaScript (ES Modules).

Servidor & Deploy: Nginx e Docker — Infraestrutura moderna para rodar a aplicação em containers isolados e de alta performance.

🏗️ Arquitetura do Projeto

A estrutura foi planejada de forma modular. Cada componente Svelte (.svelte) reúne sua própria marcação (HTML), estilo (CSS) e lógica (JS), facilitando a manutenção.

├── src/
│   ├── components/      # Componentes visuais (TopBar, InputCard, ItemList, etc.)
│   ├── lib/             # Lógica de negócio e gerenciamento de estado global
│   │   └── store.js     # O coração do app: Svelte Stores e persistência de dados
│   └── App.svelte       # Componente raiz que organiza e orquestra a aplicação
├── nginx.conf           # Configuração personalizada para servir a SPA no Nginx
├── Dockerfile           # Instruções para criação da imagem de produção
└── docker-compose.yml   # Orquestração do container de forma simplificada


🧠 Lógica e Gerenciamento de Estado

Toda a inteligência e o fluxo de reatividade residem no arquivo src/lib/store.js:

Reatividade com Svelte Stores: O estado da aplicação (suas listas, itens e ID da lista ativa) é guardado em writable stores. Qualquer alteração reflete imediatamente na tela, eliminando a manipulação manual e lenta do DOM.

Persistência com LocalStorage: Através da inscrição (subscribe) automática na store, todas as alterações são convertidas em JSON e guardadas no navegador. A função loadData garante que suas listas antigas estejam lá sempre que você abrir a página.

Estado Derivado (Derived Store): A lista de itens exibida na tela utiliza o conceito de derived store, monitorando qual lista está ativa (activeId) para filtrar e expor apenas os dados correspondentes, reduzindo o processamento nos componentes de visualização.

🔄 Fluxo de Dados (Data Flow)

O ciclo de vida das interações na aplicação segue um modelo unidirecional e previsível:

┌─────────────────────────┐     Invocação de função
│  Interação do Usuário   ├──────────────────────────┐
│  (Ajuste de quantidade) │                          │
└─────────────────────────┘                          ▼
             ▲                                ┌──────────────┐
             │ Re-renderiza                   │     Ação     │
             │ o DOM                          │ (addListItem)│
┌────────────┴────────────┐                   └──────┬───────┘
│       Reatividade       │                          │
│     (Svelte Stores)     │                          ▼
└─────────────────────────┘                  ┌──────────────┐
             ▲                               │ Atualização  │
             │ Lê estado atualizado          │ (State Mut.) │
┌────────────┴────────────┐                  └──────┬───────┘
│      Persistência       │                          │
│     (LocalStorage)      │◄─────────────────────────┘
└─────────────────────────┘     Salva automaticamente


🐋 Infraestrutura e Produção (Docker + Nginx)

Os arquivos docker-compose.yml e nginx.conf garantem que você consiga implantar o app em segundos em qualquer VPS ou servidor:

Compilação Estática: O Docker executa o npm run build interno, gerando arquivos de produção otimizados na pasta dist/.

Nginx de Alta Velocidade: O servidor Nginx serve essa pasta estática com o menor uso de memória possível.

Roteamento SPA: O nginx.conf possui a diretiva try_files apontando para o index.html. Isso evita que rotas virtuais da aplicação quebrem ou deem erro 404 Not Found quando a página é atualizada no navegador do usuário.

🚀 Como Executar o Projeto

📋 Pré-requisitos

Ter o Node.js instalado para desenvolvimento local, ou o Docker configurado para produção.

💻 Modo de Desenvolvimento Local (Sem Docker)

Clone o repositório para o seu computador:

git clone [https://github.com/seu-usuario/sua-calculadora.git](https://github.com/seu-usuario/sua-calculadora.git)
cd sua-calculadora


Instale todas as dependências do projeto:

npm install


Inicie o servidor local do Vite:

npm run dev


Pronto! Abra o seu navegador no endereço: http://localhost:5173

🐳 Modo Produção com Docker Compose

Para rodar a aplicação em containers isolados simulando um ambiente de produção real:

Monte a imagem e levante o container em segundo plano:

docker-compose up -d --build


Acesse a aplicação diretamente no seu navegador na porta configurada (geralmente http://localhost:80 ou http://localhost:8080).
