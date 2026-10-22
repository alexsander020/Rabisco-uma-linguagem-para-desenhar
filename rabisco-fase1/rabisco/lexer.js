// lexer.js — analisador léxico da linguagem Rabisco.
// Devolve { tokens, erros, linhaFinal }.
//   tokens: [{ tipo, lexema, linha }]
//   erros:  [{ linha, lexema }]  (lexema = a palavra inteira, até o próximo espaço)
//   linhaFinal: linha em que o texto termina (usada pelo parser no erro "fim do programa")
import { regras } from "./tokens.js";

export function analisarLexico(texto) {
    const tokens = [];
    const erros = [];
    let pos = 0;        // ponteiro: posição atual no texto
    let linha = 1;      // linha atual

    while (pos < texto.length) {
        let achou = false;

        for (const regra of regras) {
            regra.padrao.lastIndex = pos;                 // posiciona o ponteiro
            const m = regra.padrao.exec(texto);           // casa exatamente ali (flag y)
            if (m) {
                if (!regra.ignorar) {
                    tokens.push({ tipo: regra.tipo, lexema: m[0], linha });
                }

                for (const caractere of m[0]) {           // conta quebras de linha do trecho casado
                    if (caractere === "\n") {
                        linha = linha + 1;
                    }
                }

                pos = regra.padrao.lastIndex;
                achou = true;
                break;
            }
        }

        if (!achou) {                                     // nenhuma regra casou: erro léxico
            let fim = pos;
            while (fim < texto.length && !/\s/.test(texto[fim])) {
                fim = fim + 1;                            // a palavra inteira, até o próximo espaço
            }
            erros.push({ linha, lexema: texto.slice(pos, fim) });
            pos = fim;                                    // pula o trecho inválido (sempre avança)
        }
    }

    return { tokens, erros, linhaFinal: linha };
}
