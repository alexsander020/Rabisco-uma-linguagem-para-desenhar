// parser.js — analisador sintático descendente recursivo (LL(1)) da linguagem Rabisco.
// Gramática (sem recursão à esquerda; a alternativa depende só do próximo token):
//
//   programa → tela itens FIM
//   tela     → TELA NUM NUM
//   itens    → item itens | ε
//   item     → forma | grupo
//   forma    → RETA NUM NUM NUM NUM estilo
//            | CIRCULO NUM NUM NUM estilo
//            | RETANGULO NUM NUM NUM NUM estilo
//   estilo   → BORDA COR estilo | FUNDO COR estilo | ESPESSURA NUM estilo | ε
//   grupo    → GRUPO mods ABRE itens FECHA
//   mods     → GIRA NUM mods | MOVE NUM NUM mods | ε
//
// Para no primeiro erro, lançando ErroSintatico (linha, esperado, encontrado).

const PRIMEIRO_ITEM = ["RETA", "CIRCULO", "RETANGULO", "GRUPO"];
const ATRIBUTOS = ["BORDA", "FUNDO", "ESPESSURA"];
const MODIFICADORES = ["GIRA", "MOVE"];

function descrever(tipo) {
    return tipo === "FIM" ? "fim do programa" : tipo;
}

function listar(nomes) {
    if (nomes.length === 1) return nomes[0];
    return nomes.slice(0, -1).join(", ") + " ou " + nomes[nomes.length - 1];
}

export class ErroSintatico extends Error {
    constructor(token, esperados) {
        const encontrado = token.tipo === "FIM"
            ? "fim do programa"
            : token.tipo + ' ("' + token.lexema + '")';
        const esperado = listar(esperados.map(descrever));
        super("Erro sintático na linha " + token.linha +
              ": esperado " + esperado + ", encontrado " + encontrado);
        this.linha = token.linha;
        this.esperados = esperados;
        this.encontrado = encontrado;
    }
}

export function analisarSintatico(tokens, linhaFinal = 1) {
    let i = 0;      // ponteiro: posição do token atual
    const FIM = { tipo: "FIM", lexema: "", linha: linhaFinal };   // token virtual de fim

    function atual() {
        return i < tokens.length ? tokens[i] : FIM;
    }

    function erro(esperados) {
        throw new ErroSintatico(atual(), esperados);
    }

    function esperar(tipo) {                // confere o tipo, consome e devolve o token
        const token = atual();
        if (token.tipo !== tipo) erro([tipo]);
        i = i + 1;
        return token;
    }

    function numero() {                     // NUM vira número de verdade na AST
        return Number(esperar("NUM").lexema);
    }

    // programa → tela itens FIM
    function programa() {
        const t = tela();
        const filhos = itens(false, []);
        return { tipo: "Programa", tela: t, filhos };
    }

    // tela → TELA NUM NUM
    function tela() {
        esperar("TELA");
        const largura = numero();
        const altura = numero();
        return { tipo: "Tela", largura, altura };
    }

    // itens → item itens | ε        (ε quando o próximo token é FECHA ou FIM)
    // "extras" = tokens que também seriam válidos aqui (só para a mensagem de erro)
    function itens(dentroDeGrupo, extras) {
        const lista = [];
        let extra = extras;

        while (PRIMEIRO_ITEM.includes(atual().tipo)) {
            const no = item();
            lista.push(no);
            extra = no.tipo === "Grupo" ? [] : ATRIBUTOS;
        }

        const terminador = dentroDeGrupo ? "FECHA" : "FIM";
        if (atual().tipo !== terminador) {
            erro([...extra, ...PRIMEIRO_ITEM, terminador]);
        }
        return lista;
    }

    // item → forma | grupo
    function item() {
        switch (atual().tipo) {
            case "RETA":      return reta();
            case "CIRCULO":   return circulo();
            case "RETANGULO": return retangulo();
            case "GRUPO":     return grupo();
        }
        erro(PRIMEIRO_ITEM);
    }

    // forma → RETA NUM NUM NUM NUM estilo
    function reta() {
        esperar("RETA");
        const x1 = numero(), y1 = numero(), x2 = numero(), y2 = numero();
        return { tipo: "Reta", x1, y1, x2, y2, estilo: estilo() };
    }

    // forma → CIRCULO NUM NUM NUM estilo
    function circulo() {
        esperar("CIRCULO");
        const cx = numero(), cy = numero(), raio = numero();
        return { tipo: "Circulo", cx, cy, raio, estilo: estilo() };
    }

    // forma → RETANGULO NUM NUM NUM NUM estilo
    function retangulo() {
        esperar("RETANGULO");
        const x = numero(), y = numero(), largura = numero(), altura = numero();
        return { tipo: "Retangulo", x, y, largura, altura, estilo: estilo() };
    }

    // estilo → BORDA COR estilo | FUNDO COR estilo | ESPESSURA NUM estilo | ε
    // Atributos em qualquer ordem; se repetir, o último vale.
    function estilo() {
        const e = {};
        while (ATRIBUTOS.includes(atual().tipo)) {
            const t = esperar(atual().tipo);
            if (t.tipo === "BORDA") e.borda = esperar("COR").lexema;
            else if (t.tipo === "FUNDO") e.fundo = esperar("COR").lexema;
            else e.espessura = numero();
        }
        return e;
    }

    // grupo → GRUPO mods ABRE itens FECHA
    // mods  → GIRA NUM mods | MOVE NUM NUM mods | ε   (ordem escrita é preservada)
    function grupo() {
        esperar("GRUPO");
        const modificadores = [];

        while (MODIFICADORES.includes(atual().tipo)) {
            if (esperar(atual().tipo).tipo === "GIRA") {
                modificadores.push({ tipo: "Rotacao", graus: numero() });
            } else {
                const dx = numero();
                const dy = numero();
                modificadores.push({ tipo: "Deslocamento", dx, dy });
            }
        }

        if (atual().tipo !== "ABRE") erro([...MODIFICADORES, "ABRE"]);
        esperar("ABRE");
        const filhos = itens(true, []);
        esperar("FECHA");
        return { tipo: "Grupo", modificadores, filhos };
    }

    return programa();
}
