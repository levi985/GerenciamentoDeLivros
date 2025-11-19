#  Catálogo de Livros - LEVI HENRIQUE SALES DA SILVA / 01706233 

Este projeto é uma aplicação de **Catálogo de Livros** desenvolvida como atividade prática para consolidar conceitos fundamentais do React (Hooks, Context API e Hooks Customizados).

O objetivo foi criar uma SPA (Single Page Application) performática e organizada, simulando funcionalidades reais como consumo de API e persistência de dados.

---

##  Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Acesse no navegador:**
   O terminal mostrará o link, geralmente: http://localhost:5173

---

##  Decisões Técnicas e Conceitos Aplicados

Para atender aos requisitos do MVP, tomei as seguintes decisões de arquitetura:

1. Gerenciamento de Estado (`useState`)
Utilizado para controlar a lista de livros, os inputs do formulário e o estado de carregamento. É a fonte da verdade da aplicação.

2. Efeitos Colaterais (`useEffect`)
**Simulação de API:** Utilizei o useEffect com array de dependências vazio `[]` para buscar os dados de `/books.json` apenas uma vez na montagem do componente.

3. Manipulação de DOM (`useRef`)
**Foco Automático:** Para melhorar a UX (Experiência do Usuário), usei o useRef para acessar o input de busca diretamente e focar nele assim que a página carrega, sem precisar manipular o document nativo.

4. Context API (`ThemeContext`)
**Evitando Prop Drilling:** Como o tema (Claro/Escuro) é uma preferência global necessária em vários pontos (botão de toggle, container principal, textos), criei um Contexto. Isso evita passar props manualmente por vários níveis de componentes.

###  Sobre o Hook Customizado (`useLocalStorage`)
Conforme solicitado, criei um hook próprio para abstrair a lógica de persistência.

- **Onde foi aplicado:** No estado da barra de busca (search).
- **Por que foi usado:** Para garantir que, se o usuário atualizar a página (F5), o termo que ele estava pesquisando não seja perdido.
- **Como funciona:** O hook intercepta a leitura e escrita do estado. Ele usa `JSON.stringify` para salvar no navegador (já que localStorage só aceita texto) e `JSON.parse` para recuperar o dado formatado para o React.


# GerenciamentoDeLivros
