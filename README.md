# Minha Saúde Feminina

> **Um aplicativo pensado para cuidar da mulher em todas as fases da vida.**

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Plataformas](https://img.shields.io/badge/Plataformas-Android%20%7C%20iOS-blue)
![UNIFEBE](https://img.shields.io/badge/UNIFEBE-Projeto%20de%20Extensão-orange)

O **Minha Saúde Feminina** nasce como uma forma de estar presente no cotidiano da mulher. É um aplicativo gratuito, acessível, fácil de usar e sem julgamentos, criado para informar, orientar e acompanhar a saúde feminina com respeito à diversidade.

Este projeto é fruto do **Projeto de Curricularização da Extensão** da UNIFEBE, unindo acadêmicos dos cursos de **Medicina** e **Sistemas de Informação**. O objetivo é entregar tecnologia como aliada do cuidado humano, garantindo que a mulher chegue mais informada à consulta e fortaleça seu vínculo com a Atenção Primária (UBS).

---

## Objetivos e Impacto Social

A realidade atual mostra que as mulheres enfrentam falta de informação simples e confiável, além de dificuldades para acompanhar o próprio ciclo, o que gera atraso em diagnósticos e abandono de tratamentos. Nosso projeto busca resolver isso, enquanto proporciona aos acadêmicos:

* Desenvolvimento de competências técnicas reais com requisitos de um cliente institucional.
* Produção de impacto social concreto na saúde pública.
* Vivência em metodologias de aprendizagem baseada em projetos.
* Exercício de responsabilidade ética e sensibilidade pedagógica.

---

## Funcionalidades Principais

O aplicativo foi desenhado para oferecer uma navegação simples e intuitiva, com linguagem clara e acolhedora, dividido nas seguintes frentes:

* ** Informação e Orientação:** Conteúdos claros sobre o corpo, saúde íntima, infecções e doenças ginecológicas. 
* ** Acompanhamento de Ciclo:** Orientações sobre o ciclo menstrual e diário de sintomas (como cólicas, humor e alterações emocionais).
* ** Prevenção e Rastreio:** Lembretes de exames (Papanicolau, Mamografia), vacinas (HPV) e consultas.
* ** Diário de Queixas:** Ferramenta para registrar sangramentos anormais, corrimentos (com ícones descritivos) e dores, gerando um histórico para apresentar ao médico da UBS.
* ** Apoio Contra a Violência:** Integração com o *Violentômetro*, ajudando a identificar sinais de abuso e fornecendo canais de denúncia como o 180.

### Fases da Vida Atendidas
O cuidado acompanha a mulher em cada etapa:
* Adolescência
* Fase adulta
* Gestação e pós-parto
* Climatério e menopausa
* Senescência

---

## Tecnologias Utilizadas (Proposta)

O projeto é dividido em um aplicativo mobile e uma API no backend, utilizando as seguintes ferramentas:

**Front-end (Mobile)**
* **React Native:** Framework para o desenvolvimento do aplicativo.
* **JavaScript / TypeScript:** Linguagem base do app.

**Back-end (API)**
* **C# .NET:** Framework utilizado para a construção da API RESTful.
* **Entity Framework Core:** ORM para o mapeamento e comunicação com o banco de dados.

**Banco de Dados**
* **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.

---

## Etapas do Projeto

O desenvolvimento seguirá uma esteira ágil, contemplando as seguintes fases:

1. **Levantamento e análise de requisitos:** Definição do escopo e regras de negócio junto à equipe de Medicina.
2. **Organização e estruturação:** Curadoria dos conteúdos informativos baseados no SUS e Ministério da Saúde.
3. **Design da Interface:** Criação de protótipos de alta fidelidade focados em UX/UI para diferentes faixas etárias.
4. **Desenvolvimento da aplicação:** Codificação do front-end (Android/iOS) e back-end.
5. **Testes e validação:** Homologação técnica e validação dos conteúdos com os profissionais de saúde.
6. **Produção de vídeo demonstrativo:** Apresentação final dos requisitos implementados.

---

## Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18+)
* Gerenciador de pacotes: `npm` (mobile) e `pnpm` (sistema de artigos)
* MySQL / TiDB ou PostgreSQL para persistência
* Emulador Android/iOS ou aplicativo Expo Go no celular

---

### 1. Rodando o App Mobile (React Native / Expo)

1. Na raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

3. Abra no emulador (pressione `a` para Android ou `i` para iOS) ou escaneie o QR Code com o aplicativo Expo Go.

---

### 2. Rodando o Sistema de Artigos (API independente + Painel Web)

O sistema de gestão e persistência de artigos fica na pasta `sistema-artigos/`.

1. Acesse o diretório do sistema de artigos:
   ```bash
   cd sistema-artigos
   ```

2. Instale as dependências com `pnpm`:
   ```bash
   pnpm install
   pnpm --dir api install
   ```

3. Configure o arquivo `.env` da API (`sistema-artigos/api/.env`) com a URL do banco de dados:
   ```env
   DATABASE_URL=mysql://usuario:senha@host:3306/banco
   API_PORT=4001
   ARTICLE_SEARCH_API_KEY=uma-chave-interna-forte
   ```

4. Aplique as migrações no banco:
   ```bash
   pnpm --dir api db:migrate
   ```

5. Em terminais separados:
   - **Terminal 1 (API Independente):**
     ```bash
     pnpm api:dev
     ```
   - **Terminal 2 (Servidor Público / Painel Web):**
     ```bash
     pnpm dev
     ```

* A API estará disponível em `http://localhost:4001`
* O painel web de artigos estará disponível em `http://localhost:3000`
* Para mais detalhes sobre rotas e contratos, consulte o [README do Sistema de Artigos](file:///c:/Users/Nathan/.gemini/antigravity-ide/scratch/MinhaSaudeFeminina/sistema-artigos/README.md).

## Equipe
### Sistemas de Informação (UNIFEBE)
- Guilherme Bononomi Santiago
- João Henrique Pozzi Mees
- Nathan da Cruz Carneiro
