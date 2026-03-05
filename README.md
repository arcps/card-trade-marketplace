# Card Trade Marketplace

Este projeto é uma aplicação web desenvolvida como teste para vaga de Front End na Invita. Consiste em um um marketplace de troca de cartas. Ele foi construído utilizando o **Quasar Framework** com **Vue.js 3**, pois é a stack utilizada para a vaga.

## 🚀 Tecnologias Utilizadas

As principais tecnologias e bibliotecas empregadas neste projeto incluem:

- **[Quasar Framework](https://quasar.dev/)**: Framework UI baseado em Vue.js para criar interfaces responsivas e multiplataforma.
- **[Vue.js 3](https://vuejs.org/)**: Framework JavaScript progressivo para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado de JavaScript que melhora a qualidade e a manutenibilidade do código.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build de próxima geração que proporciona um servidor de desenvolvimento extremamente rápido.
- **[TanStack Query (Vue Query)](https://tanstack.com/query/latest)**: Biblioteca poderosa para gerenciamento de estado assíncrono (server state), cache e sincronização de dados.
- **[Axios](https://axios-http.com/)**: Cliente HTTP baseado em Promises para realizar requisições à API.
- **[Vue I18n](https://kazupon.github.io/vue-i18n/)**: Biblioteca de internacionalização para suporte a múltiplos idiomas.
- **[Sass (SCSS)](https://sass-lang.com/)**: Pré-processador CSS para estilos mais organizados e reutilizáveis.
- **[ESLint](https://eslint.org/)**: Ferramenta de linting para identificar e corrigir problemas no código JavaScript/TypeScript.

## 🛠 O que foi feito

O projeto foi estruturado seguindo as melhores práticas do Quasar CLI com Vite:

1.  **Configuração do Ambiente**: Setup inicial do projeto com suporte nativo a TypeScript.
2.  **Integração de Bibliotecas**: Configuração de _boot files_ para inicialização do Axios, i18n e Vue Query.
3.  **Plugins do Quasar**: Ativação de plugins úteis como `Notify` e `Dialog` para feedback ao usuário.
4.  **Internacionalização**: Configuração do plugin `@intlify/unplugin-vue-i18n` no Vite para otimização e uso de blocos i18n.
5.  **Qualidade de Código**: Configuração do `vite-plugin-checker` para verificação de tipos e linting em tempo real durante o desenvolvimento.

## 📦 Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente.

### Instalar as dependências

```bash
yarn
# ou
npm install
```

### Iniciar o servidor local

```bash
quasar dev
```

### Linter

```bash
yarn lint
# or
npm run lint
```

### Formatação

```bash
yarn format
# or
npm run format
```

### Build

```bash
quasar build
```
