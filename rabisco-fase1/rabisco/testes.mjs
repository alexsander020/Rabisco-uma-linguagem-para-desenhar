// testes.mjs — roda os casos de casos.js no Node (opcional, só para conferir):
//   node testes.mjs
import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";

// Resumo da AST em texto indentado (usado no resultado esperado dos casos válidos).
export function resumir(no, nivel = 0) {
    const r = (s) => "  ".repeat(nivel) + s;
    const estilo = (e) => Object.entries(e).map(([k, v]) => " " + k + "=" + v).join("");
    switch (no.tipo) {
        case "Programa":
            return [r("Programa"), resumir(no.tela, nivel + 1),
                    ...no.filhos.map((f) => resumir(f, nivel + 1))].join("\n");
        case "Tela":
            return r("Tela " + no.largura + "x" + no.altura);
        case "Reta":
            return r("Reta (" + no.x1 + "," + no.y1 + ")->(" + no.x2 + "," + no.y2 + ")" + estilo(no.estilo));
        case "Circulo":
            return r("Circulo centro=(" + no.cx + "," + no.cy + ") raio=" + no.raio + estilo(no.estilo));
        case "Retangulo":
            return r("Retangulo (" + no.x + "," + no.y + ") " + no.largura + "x" + no.altura + estilo(no.estilo));
        case "Grupo": {
            const mods = no.modificadores.map((m) =>
                m.tipo === "Rotacao" ? "Rotacao(" + m.graus + ")" : "Deslocamento(" + m.dx + "," + m.dy + ")");
            return [r("Grupo [" + mods.join(", ") + "]"),
                    ...no.filhos.map((f) => resumir(f, nivel + 1))].join("\n");
        }
    }
}

// Roda um programa e devolve { resultado, erros, resumo }.
export function executar(programa) {
    const { tokens, erros, linhaFinal } = analisarLexico(programa);
    if (erros.length > 0) {
        return { resultado: "erro-lexico",
                 erros: erros.map((e) => "linha " + e.linha + ': "' + e.lexema + '"') };
    }
    try {
        const ast = analisarSintatico(tokens, linhaFinal);
        return { resultado: "valido", erros: [], resumo: resumir(ast) };
    } catch (falha) {
        return { resultado: "erro-sintatico", erros: [falha.message] };
    }
}

// ---- execução direta: node testes.mjs ----
const rodandoDireto = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (rodandoDireto) {
    const { casos } = await import("./casos.js");
    let falhas = 0;
    for (const c of casos) {
        const r = executar(c.programa);
        let ok = r.resultado === c.esperado.resultado;
        if (ok && c.esperado.resultado === "valido") ok = r.resumo === c.esperado.resumo;
        if (ok && c.esperado.resultado !== "valido") {
            ok = JSON.stringify(r.erros) === JSON.stringify(c.esperado.erros);
        }
        console.log((ok ? "OK    " : "FALHOU") + "  " + c.id + " — " + c.nome);
        if (!ok) { falhas++; console.log("  obtido:", JSON.stringify(r, null, 2)); }
    }
    console.log(falhas === 0 ? "\nTodos os " + casos.length + " casos passaram." : "\n" + falhas + " caso(s) falharam.");
    process.exit(falhas === 0 ? 0 : 1);
}
