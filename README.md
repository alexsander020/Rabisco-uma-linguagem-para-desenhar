Rabisco — uma linguagem para desenhar (Fase 1: do texto à AST)
Atividade da disciplina Laboratório de Programação Avançada II · Compiladores.
Rabisco é uma pequena linguagem de comandos para descrever desenhos. Esta fase implementa, em JavaScript puro e sem bibliotecas de análise, o analisador léxico, o analisador sintático descendente recursivo e a geração da AST. A Fase 2 converterá a AST em SVG.
Partimos da estrutura do tutorial do Robô (mmamorim/tutorial-robox-parser) e a adaptamos à nossa linguagem.
Integrantes
Nome	RA
Alexsander	20010480
Bruno Costa Dourado	20010547
João Vitor Leão Bonifácio	23024758
Vinicius Binda	23024415
Vitor Hideki Tokunaga	23024862
Felipe Martins Dos Santos	23024894
A linguagem em um olhar
```
tela 400 300
// um carro simples
retangulo 50 150 200 60 fundo azul
grupo move 70 190 {
  circulo 0 0 25 fundo preto
  grupo gira 45 {
    reta 0 0 20 0 borda branco espessura 2
  }
}
grupo move 200 190 {
  circulo 0 0 25 fundo preto
}
```
Elemento	Sintaxe
Tela (obrigatória, primeira)	`tela LARGURA ALTURA`
Formas	`reta X1 Y1 X2 Y2` · `circulo CX CY RAIO` · `retangulo X Y LARGURA ALTURA`
Estilo (opcional, qualquer ordem)	`borda COR` · `fundo COR` · `espessura N`
Grupo (aninhável)	`grupo MODIFICADORES { ... }`
Modificadores de grupo	`gira N` · `move DX DY`
Comentário	`//` até o fim da linha
Cores	`preto`, `branco`, `vermelho`, `verde`, `azul`, `amarelo`, `laranja`, `roxo` ou `#RRGGBB`
Números	inteiros sem sinal (`0` é aceito; `05` é erro léxico)
A especificação completa (tokens e expressões regulares, gramática, tabela da AST e decisões de projeto) está em `docs/Rabisco_Especificacao_Fase1.docx`.
Gramática
```
programa → tela itens FIM
tela     → TELA NUM NUM
itens    → item itens | ε
item     → forma | grupo
forma    → RETA NUM NUM NUM NUM estilo
         | CIRCULO NUM NUM NUM estilo
         | RETANGULO NUM NUM NUM NUM estilo
estilo   → BORDA COR estilo | FUNDO COR estilo | ESPESSURA NUM estilo | ε
grupo    → GRUPO mods ABRE itens FECHA
mods     → GIRA NUM mods | MOVE NUM NUM mods | ε
```
Como executar
A página usa módulos de JavaScript, então precisa de um servidor local (não abre com duplo clique no `index.html`).
VS Code: instale a extensão Live Server, clique com o botão direito em `index.html` e escolha Open with Live Server.
Terminal, dentro da pasta do projeto:
```
python3 -m http.server 8000
```
e abra `http://localhost:8000`.
Na página: digite um programa (ou escolha um caso de teste na lista) e clique em Analisar. A página mostra os tokens (linha, tipo e lexema) e, conforme o caso, os erros léxicos, o erro sintático ou a AST em JSON.
Testes
Os 5 programas válidos e os 3 inválidos, com o resultado esperado de cada um, estão em `casos-teste.md` (dados em `casos.js`). Para conferir todos de uma vez (requer Node.js):
```
node testes.mjs
```
Estrutura
Arquivo	Para que serve
`index.html`	página de teste
`main.js`	liga a página aos analisadores
`tokens.js`	lista de tokens (expressões regulares)
`lexer.js`	analisador léxico
`parser.js`	analisador sintático e geração da AST
`casos.js`, `casos-teste.md`	casos de teste
`testes.mjs`	verificador dos casos de teste (Node)
`docs/`	especificação da linguagem (Word)
