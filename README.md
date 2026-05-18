🛒 Calculadora de Compras de Mercado (Baseada em Blocos)

Uma aplicação web moderna, ultra-rápida e totalmente reativa desenvolvida para transformar a forma como planejamos e controlamos nossos gastos de supermercado.

Diferente de uma simples lista de papel ou notas de texto, esta aplicação foi desenhada como uma Single Page Application (SPA) intuitiva onde cada produto vira um bloco (card) interativo.

💡 Por que esta calculadora é diferente?

Visualização por Blocos: Cada produto adicionado é um bloco visual. Você insere o preço e, ao lado, ajusta a quantidade instantaneamente.

Percepção Real de Gastos: Ao aumentar ou diminuir a quantidade (+ ou -), o valor daquele item e o total geral são recalculados em tempo real. Isso permite visualizar de imediato o impacto de cada produto e identificar rapidamente o que está encarecendo a sua compra.

Múltiplas Listas para Casais e Parcerias: Crie e salve listas independentes. Isso facilita o planejamento compartilhado com seu parceiro ou parceira (ex: "Lista do Mês", "Churrasco de Fim de Semana", "Feira Semanal"), tornando a divisão de tarefas e o orçamento a dois muito mais simples e transparentes.

🛠️ Stack Tecnológica

Framework: Svelte — Diferente de frameworks tradicionais como React ou Vue, o Svelte não utiliza um "Virtual DOM". Ele compila o código para JavaScript puro altamente otimizado diretamente no momento do build, proporcionando uma execução leve e extremamente rápida no navegador.

Ferramenta de Build: Vite — Utilizada para um fluxo de desenvolvimento ágil com Hot Module Replacement (HMR) e para gerar o empacotamento otimizado para produção.

Linguagem: JavaScript (ES Modules).

Servidor & Deploy: Nginx e Docker — Infraestrutura pronta para rodar a aplicação em containers de forma isolada e performática.

🏗️ Arquitetura do Projeto

A arquitetura do projeto é baseada em componentes independentes do Svelte (.svelte), os quais encapsulam sua própria estrutura (HTML), estilização (CSS) e lógica de comportamento (JS) em arquivos unificados.

├── src/
│   ├── components/      # Componentes visuais reusáveis (TopBar, InputCard, ItemList, etc.)
│   ├── lib/             # Lógica de negócio e gerenciamento de estado
│   │   └── store.js     # O coração da aplicação: as Stores do Svelte e persistência
│   └── App.svelte       # Componente raiz que orquestra a interface
├── nginx.conf           # Configuração de rotas para servir arquivos estáticos em produção (SPA)
├── Dockerfile           # Instruções para construção da imagem da aplicação
└── docker-compose.yml   # Configuração para subir o container facilmente


🧠 Lógica e Gerenciamento de Estado

A inteligência da aplicação está concentrada no arquivo src/lib/store.js:

Reatividade com Svelte Stores: Utilizamos writable stores para guardar o estado global da aplicação (as listas, itens criados e a lista ativa no momento). Quando o valor de uma store muda, o Svelte atualiza o DOM automaticamente nas partes exatas que dependem daquele dado.

Persistência com LocalStorage: Para que você não perca suas listas ao atualizar ou fechar o navegador, adicionamos uma escuta (subscribe) na store que serializa os dados para JSON e os salva de forma automática no localStorage. Ao inicializar a aplicação, a função loadData é executada para resgatar essas informações históricas.

Estado Derivado (Derived Store): A store de itens exibidos na tela é do tipo derived e acompanha a store principal. Se você altera a lista ativa (activeId), ela recalcula e filtra dinamicamente os itens que devem ser listados, mantendo os componentes de interface focados exclusivamente em renderizar o visual.

🔄 Fluxo de Dados (Data Flow)

O ciclo de vida de uma ação dentro da aplicação segue um modelo unidirecional:

[ Interação do Usuário ] ──> Ajuste de preço/quantidade no bloco (ex: clicando em "+")
         │
         ▼
     [ Ação ]            ──> O componente chama a função exposta na store (ex: 'addListItem')
         │
         ▼
 [ Atualização ]         ──> O 'appStore' atualiza o estado interno (listas/itens)
         │
         ▼
 [ Persistência ]        ──> O 'subscribe' da store salva o novo estado no 'localStorage'
         │
         ▼
  [ Reatividade ]        ──> O Svelte detecta a mudança e re-renderiza unicamente os blocos afetados no DOM


🐋 Infraestrutura e Produção (Docker + Nginx)

Os arquivos docker-compose.yml e nginx.conf garantem que a aplicação possa ser empacotada e disponibilizada em qualquer ambiente de forma rápida e escalável:

Compilação Estática: O processo do Docker executa npm run build, que gera uma pasta dist/ contendo arquivos estáticos extremamente otimizados (HTML, CSS e JS puros).

Servidor Nginx: O Nginx atua como um servidor de altíssima velocidade para entregar esses arquivos estáticos gerados.

Configuração SPA (nginx.conf): Como se trata de uma aplicação Single Page (SPA), as requisições de rota feitas pelo usuário são interceptadas pelo Nginx. Se o arquivo físico correspondente não existir no servidor, a diretiva try_files direciona o fluxo para o index.html. Isso garante que o roteador do Svelte cuide da navegação interna sem estourar erros 404 Not Found.

🚀 Como Executar o Projeto

Pré-requisitos

Certifique-se de ter o Node.js instalado na sua máquina ou o Docker configurado.

Modo de Desenvolvimento Local (Sem Docker)

Clone este repositório:

git clone [https://github.com/seu-usuario/sua-calculadora.git](https://github.com/seu-usuario/sua-calculadora.git)
cd sua-calculadora


Instale as dependências necessárias:

npm install


Suba o servidor de desenvolvimento do Vite:

npm run dev


Acesse o endereço informado no terminal (geralmente http://localhost:5173).

Modo Produção com Docker Compose

Caso queira colocar a aplicação em um servidor próprio ou rodar usando containers locais:

Suba o container rodando em segundo plano:

docker-compose up -d --build


A aplicação estará pronta e disponível na porta configurada no seu arquivo docker-compose.yml (por padrão, porta 80 ou 8080).

Feito com 💙 para facilitar o seu dia a dia no mercado!
