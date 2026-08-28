# API e servidor de artigos

O projeto é dividido em duas aplicações:

- `api/`: API independente responsável pela persistência dos artigos usando Drizzle ORM e MySQL/TiDB.
- `server/`: servidor público que autentica as requisições e encaminha as rotas de artigos para a API independente.

## Configuração

Configure as variáveis de ambiente da API:

```env
DATABASE_URL=mysql://usuario:senha@host:3306/banco
API_PORT=4001
ARTICLE_SEARCH_API_KEY=uma-chave-interna-forte
```

Configure também o servidor público:

```env
ARTICLE_DATA_API_URL=http://localhost:4001
ARTICLE_SEARCH_API_KEY=uma-chave-interna-forte
ARTICLE_DATA_API_TIMEOUT_MS=5000
```

A variável `ARTICLE_SEARCH_API_KEY` deve ter o mesmo valor nos dois processos quando usada. Em desenvolvimento, ela pode ser omitida. Nunca coloque essa chave no frontend.

## Rotas da API independente

### Saúde

```http
GET /health
```

Retorna o status da API:

```json
{
  "ok": true,
  "service": "articles-api"
}
```

### Buscar artigos

```http
GET /api/articles
GET /api/articles/search
GET /api/articles/search?q=autocuidado
```

O parâmetro `q` é opcional e pesquisa em título, resumo, categoria e autora. O header `x-viewer-id` também é opcional:

```http
x-viewer-id: usuario-open-id
```

Artigos publicados são retornados para qualquer visitante. Rascunhos só são retornados quando o valor de `x-viewer-id` corresponde ao `ownerId` do artigo.

Resposta:

```json
{
  "articles": [
    {
      "id": "art-001",
      "ownerId": "usuario-open-id",
      "author": "Nome da autora",
      "title": "Título do artigo",
      "slug": "titulo-do-artigo",
      "excerpt": "Resumo curto.",
      "category": "Autocuidado",
      "status": "Publicado",
      "content": "<p>Conteúdo em HTML.</p>",
      "updatedAt": "2026-08-28T12:00:00.000Z",
      "createdAt": "2026-08-28T12:00:00.000Z"
    }
  ]
}
```

### Receber resultados de busca

```http
POST /api/articles/search-results
Content-Type: application/json
x-article-search-key: uma-chave-interna-forte
```

Corpo:

```json
{
  "articles": [
    {
      "id": "resultado-001",
      "ownerId": "usuario-open-id",
      "author": "Nome da autora",
      "title": "Título do artigo",
      "slug": "titulo-do-artigo",
      "excerpt": "Resumo curto.",
      "category": "Ciclo menstrual",
      "status": "Rascunho",
      "content": "<p>Conteúdo retornado pela API.</p>",
      "updatedAt": "2026-08-28T12:00:00.000Z"
    }
  ]
}
```

A API cria ou atualiza os registros pelo `id` usando o ORM. Repetir o mesmo resultado não cria duplicatas. Em caso de sucesso, retorna HTTP `202`:

```json
{
  "success": true,
  "received": 1
}
```

### Criar um artigo pela interface

```http
POST /api/articles
Content-Type: application/json
Cookie: sessão autenticada
```

O servidor público identifica o usuário autenticado, gera `id`, `ownerId` e `author`, encaminha o artigo para a API independente e retorna HTTP `201` com o registro persistido:

```json
{
  "article": {
    "id": "art-001",
    "ownerId": "usuario-open-id",
    "author": "Nome da autora",
    "title": "Título do artigo",
    "slug": "titulo-do-artigo",
    "excerpt": "Resumo curto.",
    "category": "Autocuidado",
    "status": "Rascunho",
    "content": "<p>Conteúdo em HTML.</p>",
    "updatedAt": "2026-08-28T12:00:00.000Z",
    "createdAt": "2026-08-28T12:00:00.000Z"
  }
}
```

### Atualizar um artigo

```http
PUT /api/articles/:id
Content-Type: application/json
x-viewer-id: usuario-open-id
x-article-search-key: uma-chave-interna-forte
```

Corpo:

```json
{
  "title": "Título atualizado",
  "slug": "titulo-atualizado",
  "excerpt": "Resumo atualizado.",
  "category": "Autocuidado",
  "content": "<p>Conteúdo atualizado.</p>",
  "status": "Publicado"
}
```

A atualização só é permitida para o proprietário do artigo. Sem `x-viewer-id`, retorna HTTP `401`. Para artigo inexistente ou pertencente a outro usuário, retorna HTTP `404`.

### Excluir um artigo

```http
DELETE /api/articles/:id
x-viewer-id: usuario-open-id
x-article-search-key: uma-chave-interna-forte
```

A exclusão só é permitida para o proprietário do artigo. Sem `x-viewer-id`, retorna HTTP `401`. Para artigo inexistente ou pertencente a outro usuário, retorna HTTP `404`.

## Rotas do servidor público

O servidor público expõe as mesmas rotas de artigos:

```http
GET    /api/articles
GET    /api/articles/search
POST   /api/articles/search-results
PUT    /api/articles/:id
DELETE /api/articles/:id
```

Nas requisições do navegador, o servidor identifica o usuário pela sessão autenticada e envia o `x-viewer-id` para a API. O navegador não precisa conhecer a URL interna nem a chave da API.

Ao criar, editar ou remover pela interface, a operação só é confirmada na tela depois que a API responde com sucesso. Em seguida, a interface executa uma nova busca no backend para refletir os dados realmente persistidos no banco. Se a API falhar, o estado local não é alterado e uma mensagem de erro é exibida.

O servidor retorna HTTP `502` quando a API independente está indisponível.

## Banco de dados

A API possui schema Drizzle em `api/schema.ts` e migração inicial em `api/migrations/0000_narrow_katie_power.sql`.

Gere uma nova migração quando o schema mudar:

```bash
pnpm --dir api db:generate
```

Aplique as migrações no banco configurado em `DATABASE_URL`:

```bash
pnpm --dir api db:migrate
```

## Como rodar localmente

Instale as dependências dos dois projetos:

```bash
pnpm install
pnpm --dir api install
```

Aplique a estrutura do banco:

```bash
pnpm --dir api db:migrate
```

Abra dois terminais. No primeiro, rode a API independente:

```bash
pnpm api:dev
```

No segundo, rode o servidor público:

```bash
pnpm dev
```

Por padrão, a API fica em `http://localhost:4001` e o servidor público em `http://localhost:3000`.

## Build e produção

Compile a API independente:

```bash
pnpm api:build
```

Inicie a API compilada:

```bash
pnpm api:start
```

O servidor público pode ser compilado e iniciado com:

```bash
pnpm build
pnpm start
```

## Verificação e testes

Verifique e teste somente a API independente:

```bash
pnpm api:check
pnpm api:test
```

O projeto raiz também pode ser validado com:

```bash
pnpm check
pnpm test
```
