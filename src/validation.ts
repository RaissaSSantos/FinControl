const tipos = ["receita", "despesa"] as const;
const categorias = ["alimentacao", "transporte", "moradia", "lazer", "salario", "outros"] as const;

function pertence<T extends string>(opcoes: readonly T[], valor: unknown): valor is T {
  return opcoes.some(opcao => opcao === valor);
}

export function validarMovimentacao(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("Envie uma movimentação em JSON.");
  const { descricao, valor, tipo, categoria } = body as Record<string, unknown>;
  if (typeof descricao !== "string" || !descricao.trim() || descricao.trim().length > 160)
    throw new Error("Informe uma descrição de até 160 caracteres.");
  const quantia = typeof valor === "number" || typeof valor === "string" ? String(valor) : "";
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(quantia) || Number(quantia) === 0)
    throw new Error("Informe um valor positivo com até dez dígitos inteiros e duas casas decimais.");
  if (!pertence(tipos, tipo)) throw new Error("Selecione receita ou despesa.");
  if (!pertence(categorias, categoria)) throw new Error("Selecione uma categoria válida.");
  return { descricao: descricao.trim(), valor: quantia, tipo, categoria };
}
