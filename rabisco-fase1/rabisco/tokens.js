// tokens.js — vocabulário da linguagem Rabisco.
//
// Cada regra tem: tipo (nome do token), padrao (expressão regular com a flag y,
// como no tutorial do Robô) e, opcionalmente, ignorar (reconhece mas não guarda).
//
// FIM_DE_PALAVRA: toda palavra (palavra-chave, número ou cor) só é aceita se
// terminar ali: antes de espaço, de { ou }, de um comentário (//) ou do fim do
// texto. Isso resolve dois problemas de uma vez:
//   - "circulo2" ou "linhas" NÃO são quebrados em "circulo" + "2" (palavra-chave
//     colada no começo de uma palavra maior);
//   - "05" NÃO vira NUM("0") + NUM("5"): vira um erro léxico, "05" inteiro.
const FIM_DE_PALAVRA = String.raw`(?=\s|$|[{}]|\/\/)`;

function palavra(fonte) {
  return new RegExp(`(?:${fonte})${FIM_DE_PALAVRA}`, "y");
}

export const regras = [
  // ---- ignorados ----
  { tipo: "ESPACO",     padrao: /\s+/y, ignorar: true },
  { tipo: "COMENTARIO", padrao: /\/\/[^\n]*/y, ignorar: true },

  // ---- palavras-chave ----
  { tipo: "TELA",       padrao: palavra("tela") },
  { tipo: "RETA",       padrao: palavra("reta") },
  { tipo: "CIRCULO",    padrao: palavra("circulo") },
  { tipo: "RETANGULO",  padrao: palavra("retangulo") },
  { tipo: "GRUPO",      padrao: palavra("grupo") },
  { tipo: "BORDA",      padrao: palavra("borda") },
  { tipo: "FUNDO",      padrao: palavra("fundo") },
  { tipo: "ESPESSURA",  padrao: palavra("espessura") },
  { tipo: "GIRA",       padrao: palavra("gira") },
  { tipo: "MOVE",       padrao: palavra("move") },

  // ---- valores ----
  { tipo: "COR", padrao: palavra("preto|branco|vermelho|verde|azul|amarelo|laranja|roxo|#[0-9A-Fa-f]{6}") },
  { tipo: "NUM", padrao: palavra("0|[1-9][0-9]*") },

  // ---- delimitadores do grupo ----
  { tipo: "ABRE",  padrao: /\{/y },
  { tipo: "FECHA", padrao: /\}/y },
];
