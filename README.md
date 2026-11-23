# FinControl | Projeto Integrador

Prova de conceito local de controle financeiro. A interface HTML/CSS usa a API Express em TypeScript para cadastrar e consultar movimentações. O Prisma acessa um banco PostgreSQL. Os lançamentos pertencem a um único caixa compartilhado nesta PoC.

## Executar no Windows, macOS ou Linux

Instale o Docker com Docker Compose (no Windows, Docker Desktop) e inicie-o. Extraia todo o ZIP. Abra um terminal na pasta que contém compose.yaml e execute:

    docker compose up --build

Na primeira execução é necessário acesso à internet para baixar imagens, pacotes e o Prisma. A migração cria a tabela automaticamente. Abra http://localhost:3000 no navegador. O banco começa vazio. Para parar, use Ctrl+C e depois docker compose down. O volume dados mantém os registros entre execuções.

## Verificar a jornada da PoC

1. Em um banco novo, confira os três cartões zerados e o histórico vazio.
2. Cadastre uma receita de R$ 150,90 com descrição “Serviço” e categoria Outros.
3. Cadastre uma despesa de R$ 42,35 com descrição “Conta de luz” e categoria Moradia.
4. Confira receitas de R$ 150,90, despesas de R$ 42,35, saldo de R$ 108,55 e duas linhas no histórico.
5. Em outro terminal, execute docker compose restart. Aguarde a API voltar, recarregue a página e confira os mesmos dados. Após docker compose down, use docker compose up para reabrir com o mesmo volume.

## API

| Método | Rota | Resultado |
| --- | --- | --- |
| POST | /api/transactions | Valida, grava e devolve a movimentação (201) |
| GET | /api/transactions | Histórico completo, do cadastro mais recente ao mais antigo |
| GET | /api/transactions/:id | Detalhe de uma movimentação (404 se ausente) |
| GET | /api/summary | Receitas, despesas e saldo em reais |
| GET | /api/health | Estado da conexão com o banco (200 ou 503) |

Exemplo de corpo JSON para cadastro no Postman com Content-Type application/json:

    {"descricao":"Serviço","valor":"150.90","tipo":"receita","categoria":"outros"}

Tipos aceitos: receita e despesa. Categorias: alimentacao, transporte, moradia, lazer, salario e outros. Valores devem ser positivos, com até duas casas decimais. Use ponto decimal na API. O banco usa DECIMAL(12,2), e a API devolve os valores como texto decimal. Dados inválidos retornam HTTP 400.

## Organização

- src/server.ts reúne as rotas e o cálculo do resumo.
- src/validation.ts valida os campos do formulário no servidor.
- prisma contém o modelo e a migração inicial do PostgreSQL.
- public contém a interface do grupo e sua integração com a API.
- tests contém os testes de validação. Execute com docker compose exec api npm test após iniciar a aplicação.

~
## Equipe e Contribuições

* Raissa: Testes do sistema, criação e organização do repositório no GitHub.
* Kauan: Desenvolvimento do front-end e da interface do sistema.
* Renan: Desenvolvimento do back-end e integração com o banco de dados.
* Camily: Produção e edição do vídeo demonstrativo.
* Victor: Elaboração da Prova de Conceito (PoC) e planejamento inicial do projeto.

O projeto FinControl foi desenvolvido de forma colaborativa, com responsabilidades divididas entre os integrantes da equipe. 

## Vídeo Demonstrativo

Assista à demonstração do funcionamento do FinControl: https://youtu.be/naSG2e87bag?is=DqsLKRN-7Ur4dkxd

