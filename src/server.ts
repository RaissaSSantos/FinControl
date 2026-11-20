import express, { ErrorRequestHandler } from "express";
import path from "node:path";
import { PrismaClient, Prisma } from "@prisma/client";
import { validarMovimentacao } from "./validation";

const db = new PrismaClient();
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ erro: "Banco de dados indisponível." });
  }
});

app.post("/api/transactions", async (req, res) => {
  let data;
  try {
    data = validarMovimentacao(req.body);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
    return;
  }
  const item = await db.movimentacao.create({ data });
  res.location("/api/transactions/" + item.id).status(201).json(item);
});

app.get("/api/transactions", async (_req, res) => {
  res.json(await db.movimentacao.findMany({ orderBy: { id: "desc" } }));
});

app.get("/api/transactions/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!/^[1-9]\d*$/.test(req.params.id) || id > 2147483647) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  const item = await db.movimentacao.findUnique({ where: { id } });
  if (!item) {
    res.status(404).json({ erro: "Movimentação não encontrada." });
    return;
  }
  res.json(item);
});

app.get("/api/summary", async (_req, res) => {
  const grupos = await db.movimentacao.groupBy({ by: ["tipo"], _sum: { valor: true } });
  const total = (tipo: string) => grupos.find(g => g.tipo === tipo)?._sum.valor ?? new Prisma.Decimal(0);
  const receitas = total("receita");
  const despesas = total("despesa");
  res.json({ receitas: receitas.toFixed(2), despesas: despesas.toFixed(2), saldo: receitas.minus(despesas).toFixed(2) });
});

app.use(express.static(path.resolve(__dirname, "../public")));
const tratarErro: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    res.status(err.status).json({ erro: "Corpo da requisição inválido ou muito grande." });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: "Falha ao processar a solicitação." });
};
app.use(tratarErro);
app.listen(Number(process.env.PORT || 3000), () => console.log("FinControl iniciado."));
