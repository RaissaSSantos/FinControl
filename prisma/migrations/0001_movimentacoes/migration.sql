CREATE TYPE "Tipo" AS ENUM ('receita', 'despesa');
CREATE TYPE "Categoria" AS ENUM ('alimentacao','transporte','moradia','lazer','salario','outros');
CREATE TABLE "Movimentacao" (
  "id" SERIAL PRIMARY KEY,
  "descricao" VARCHAR(160) NOT NULL,
  "valor" DECIMAL(12,2) NOT NULL CHECK ("valor" > 0),
  "tipo" "Tipo" NOT NULL,
  "categoria" "Categoria" NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL
);
