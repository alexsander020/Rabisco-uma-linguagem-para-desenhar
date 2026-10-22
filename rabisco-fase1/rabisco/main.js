import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";
import { casos } from "./casos.js";

const entrada = document.getElementById("entrada");
const divTokens = document.getElementById("tokens");
const divStatus = document.getElementById("status");
const saida = document.getElementById("saida");
const seletor = document.getElementById("exemplos");

// ---- lista de casos de teste ----
for (const caso of casos) {
    const opcao = document.createElement("option");
    opcao.value = caso.id;
    opcao.textContent = caso.id + " — " + caso.nome;
    seletor.appendChild(opcao);
}

seletor.addEventListener("change", () => {
    const caso = casos.find((c) => c.id === seletor.value);
    if (caso) {
        entrada.value = caso.programa;
        analisar();
    }
});

// programa inicial: o exemplo do carro (caso V4)
entrada.value = casos.find((c) => c.id === "V4").programa;

// ---- tabela de tokens (tipo, lexema, linha) ----
function mostrarTokens(tokens) {
    divTokens.textContent = "";

    if (tokens.length === 0) {
        divTokens.textContent = "(nenhum token)";
        return;
    }

    const tabela = document.createElement("table");
    const cabecalho = tabela.insertRow();
    for (const titulo of ["linha", "tipo", "lexema"]) {
        const th = document.createElement("th");
        th.textContent = titulo;
        cabecalho.appendChild(th);
    }

    for (const token of tokens) {
        const tr = tabela.insertRow();
        tr.insertCell().textContent = token.linha;
        tr.insertCell().textContent = token.tipo;
        tr.insertCell().textContent = token.lexema;
    }

    divTokens.appendChild(tabela);
}

function mostrarStatus(classe, texto) {
    divStatus.textContent = texto;
    divStatus.className = classe;
}

// ---- botão Analisar ----
function analisar() {
    const texto = entrada.value;
    const { tokens, erros, linhaFinal } = analisarLexico(texto);

    mostrarTokens(tokens);
    saida.textContent = "";

    // Ordem das fases: com erro léxico, o sintático nem roda.
    if (erros.length > 0) {
        mostrarStatus("erro", "Erros léxicos (a análise sintática não foi executada):");
        saida.textContent = erros
            .map((e) => 'Erro léxico na linha ' + e.linha + ': "' + e.lexema + '" não forma nenhum token')
            .join("\n");
        return;
    }

    try {
        const ast = analisarSintatico(tokens, linhaFinal);
        mostrarStatus("ok", "Análise sintática: programa válido. AST:");
        saida.textContent = JSON.stringify(ast, null, 2);
    } catch (falha) {
        mostrarStatus("erro", "Erro sintático (a AST só é gerada quando não há erros):");
        saida.textContent = falha.message;
    }
}

document.getElementById("botao").addEventListener("click", analisar);
