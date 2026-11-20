const form = document.querySelector("form");
const mensagem = document.querySelector("#mensagem");
const botao = form.querySelector("button");
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const categorias = Object.fromEntries(Array.from(form.categoria.options, o => [o.value, o.text]));
const tipos = { receita: "Receita", despesa: "Despesa" };

async function api(caminho, opcoes) {
  const resposta = await fetch("/api/" + caminho, opcoes);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || "Falha ao consultar a API.");
  return dados;
}

async function atualizar() {
  const [resumo, historico] = await Promise.all([api("summary"), api("transactions")]);
  document.querySelector(".balance h3").textContent = moeda.format(resumo.saldo);
  document.querySelector(".income h3").textContent = moeda.format(resumo.receitas);
  document.querySelector(".expense h3").textContent = moeda.format(resumo.despesas);
  const corpo = document.querySelector("tbody");
  corpo.replaceChildren();
  for (const item of historico) {
    const linha = corpo.insertRow();
    linha.insertCell().textContent = item.descricao;
    linha.insertCell().textContent = categorias[item.categoria];
    const tag = document.createElement("span");
    tag.className = "tag " + item.tipo;
    tag.textContent = tipos[item.tipo];
    linha.insertCell().append(tag);
    const valor = linha.insertCell();
    const entrada = item.tipo === "receita";
    valor.className = entrada ? "valor-positivo" : "valor-negativo";
    valor.textContent = (entrada ? "+ " : "- ") + moeda.format(item.valor);
  }
  if (!historico.length) {
    const celula = corpo.insertRow().insertCell();
    celula.colSpan = 4;
    celula.textContent = "Nenhuma movimentação cadastrada.";
  }
}

form.addEventListener("submit", async evento => {
  evento.preventDefault();
  if (botao.disabled) return;
  botao.disabled = true;
  mensagem.textContent = "Salvando…";
  try {
    await api("transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    form.reset();
    try {
      await atualizar();
      mensagem.textContent = "Movimentação cadastrada.";
    } catch {
      mensagem.textContent = "Movimentação salva. Recarregue a página para atualizar o painel.";
    }
  } catch (erro) {
    mensagem.textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

botao.disabled = true;
atualizar().catch(() => {
  mensagem.textContent = "Falha ao carregar os dados. Confira a conexão com a API.";
}).finally(() => { botao.disabled = false; });
