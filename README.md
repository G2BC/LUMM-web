![Licença MIT](https://img.shields.io/badge/Licença-MIT-yellow.svg)

# LUMM-web

## Requisitos

- Node.js 20+

## Setup do Projeto

### 1️⃣ Clonar o repositório

```bash
git@github.com:G2BC/LUMM-web.git
cd LUMM-web
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Rodar em desenvolvimento

```bash
npm run dev
```

### Variáveis de ambiente

Localmente, copie `.env.sample` para `.env` e preencha os valores.

Em produção, as variáveis `VITE_*` são injetadas no bundle durante o build. O deploy usa
o `.env.vault` versionado no repositório e a secret `DOTENV_KEY` cadastrada em
`Settings > Secrets and variables > Actions`; não é necessário cadastrar cada `VITE_*`
como secret separada no GitHub Actions.

### ⚠️ Mantenha as regras de Lint e Formatação

Para garantir a consistência e a qualidade do código neste projeto, **antes de mesclar uma PR**, certifique-se de que seu código passou nas ferramentas de lint e formatação (`eslint` e `prettier`) durante a execução da action de CI.

### 🛠️ Dicas

Rode `npm run lint:fix` e `npm run prettier:format` antes de commitar.

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.
