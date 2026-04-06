# Finder API — Keyserver Finder

API centralizada para descoberta e extração de chaves públicas OpenPGP a partir de múltiplos servidores de chave (keyservers).

## Como funciona

Ao receber um endereço de e-mail, a API consulta **em paralelo** todos os servidores suportados. Os resultados são agrupados por **fingerprint**, eliminando duplicatas. A resposta contém todas as chaves únicas encontradas e de quais servidores cada uma veio.

## Servidores suportados

| Servidor | Status |
|---|---|
| [keys.openpgp.org](https://keys.openpgp.org) | Ativo |
| [FlowCrypt Attester](https://flowcrypt.com) | Ativo |
| [Mailvelope Keyserver](https://keys.mailvelope.com) | Ativo |
| Ubuntu Keyserver | Desativado (em testes) |
| MIT Keyserver | Desativado (em testes) |

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)

## Instalação e execução

```bash
# Instalar dependências
pnpm install

# Iniciar em modo desenvolvimento (com hot-reload)
pnpm dev
```

O servidor sobe em `http://localhost:3000`.

## Documentação interativa (Swagger)

Acesse `http://localhost:3000/api-docs` para explorar e testar os endpoints via Swagger UI.

## Endpoint

### `GET /api/keys`

Busca as chaves públicas OpenPGP associadas a um e-mail.

**Query parameter:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `email` | string | Sim | Endereço de e-mail a ser consultado |

**Exemplo de requisição:**

```
GET http://localhost:3000/api/keys?email=pessoa@exemplo.com
```

**Respostas:**

#### 200 — Chave(s) encontrada(s)

```json
{
  "success": true,
  "message": "Chave pública encontrada com sucesso.",
  "data": [
    {
      "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----",
      "sources": ["keys.openpgp.org", "FlowCrypt Attester"]
    }
  ]
}
```

#### 404 — Nenhuma chave encontrada

```json
{
  "success": false,
  "message": "Nenhuma chave pública encontrada para o e-mail: pessoa@exemplo.com"
}
```

#### 422 — E-mail inválido

```json
{
  "success": false,
  "message": "O formato do e-mail é inválido. Ex. usuario@dominio.com"
}
```

#### 500 — Erro interno

```json
{
  "success": false,
  "message": "Ocorreu um erro inesperado. Tente novamente mais tarde."
}
```

## Estrutura do projeto

```
src/
├── config/         # Configuração do Swagger
├── controllers/    # Recebe a requisição e chama o serviço
├── integrations/   # Implementações de cada keyserver
├── middlewares/    # Validação de entrada e tratamento global de erros
├── routes/         # Definição das rotas e documentação OpenAPI
├── services/       # Orquestra as consultas e agrupa os resultados
├── utils/          # Classes de erro e utilitários
└── validations/    # Schemas de validação (Zod)
```
