import test from "node:test";
import assert from "node:assert/strict";
import { validarMovimentacao } from "../src/validation.ts";

const base = { descricao: "  Serviço  ", valor: "49.90", tipo: "receita", categoria: "outros" };
test("aceita campos do formulário e preserva os centavos", () => {
  assert.deepEqual(validarMovimentacao(base), { ...base, descricao: "Serviço" });
});
for (const [campo, valores] of Object.entries({
  valor: [0, -2, "3.141", "10000000000", "", null],
  descricao: ["   ", "a".repeat(161)],
  tipo: ["entrada"],
  categoria: ["inexistente"]
})) {
  for (const valor of valores) test("rejeita " + campo + " = " + JSON.stringify(valor), () => {
    assert.throws(() => validarMovimentacao({ ...base, [campo]: valor }));
  });
}
