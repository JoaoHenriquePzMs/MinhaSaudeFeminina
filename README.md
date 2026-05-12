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
* Node.js e gerenciador de pacotes (npm ou yarn)
* SDK do .NET (ex: .NET 8)
* PostgreSQL instalado e rodando
* Emulador Android/iOS ou dispositivo físico (para o React Native)

### 1. Configurando o Banco de Dados (PostgreSQL)
1. Crie um banco de dados no PostgreSQL.
2. No repositório do back-end, localize o arquivo `appsettings.json`.
3. Atualize a string de conexão (`ConnectionStrings`) com as credenciais do seu banco local.
4. Execute as migrations para criar as tabelas no banco:
   ```bash
   dotnet ef database update

### 2. Rodando a API (C# .NET)
1. Acesse a pasta do back-end:
    ```Bash
    cd backend

2. Restaure as dependências e inicie o servidor:
    ```Bash
    dotnet run

A API estará disponível localmente (geralmente em http://localhost:5000 ou https://localhost:5001).

### 3. Rodando o App (React Native)

1. Acesse a pasta do mobile:
    ```Bash
    cd mobile

2. Instale as dependências:
    ```Bash
    npm install

3. Inicie o empacotador:
    ```Bash
    npx expo start

(Substitua por npx react-native start se estiver utilizando a CLI pura do React Native).

## Equipe
### Sistemas de Informação (UNIFEBE)
- Guilherme Bononomi Santiago
- João Henrique Pozzi Mees
- Nathan da Cruz Carneiro
