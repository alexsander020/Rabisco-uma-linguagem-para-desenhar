# Casos de teste — Rabisco (Fase 1)

Cinco programas válidos e três inválidos. O resultado esperado de cada um é o que a página de teste mostra. Para conferir tudo de uma vez: `node testes.mjs`.

Nos válidos, a AST aparece resumida (um nó por linha; a indentação mostra o aninhamento; os modificadores de grupo ficam na ordem escrita). O JSON completo é o que a página exibe.

## V1 — Programa mínimo (só a tela)

**Cobre:** tela obrigatória, comentário, programa sem nenhuma forma.

**Programa:**

```
tela 800 600
// programa mínimo: só a tela, nenhuma forma
```

**Resultado esperado:** programa válido (nenhum erro léxico ou sintático). AST:

```
Programa
  Tela 800x600
```

## V2 — Três formas e todos os atributos

**Cobre:** reta, círculo, retângulo; borda, fundo e espessura em ordens diferentes; cores por nome e hexadecimal; zero; atributo repetido (vale o último).

**Programa:**

```
tela 300 200
// as três formas, com atributos em ordens diferentes
reta 10 10 290 10
reta 10 20 290 20 borda vermelho
reta 10 30 290 30 espessura 4 borda #00FF7F
circulo 60 100 40 fundo amarelo borda preto espessura 3
circulo 150 100 0
retangulo 200 80 80 60 fundo roxo
retangulo 0 0 300 200 espessura 0 fundo azul fundo verde
```

**Resultado esperado:** programa válido (nenhum erro léxico ou sintático). AST:

```
Programa
  Tela 300x200
  Reta (10,10)->(290,10)
  Reta (10,20)->(290,20) borda=vermelho
  Reta (10,30)->(290,30) espessura=4 borda=#00FF7F
  Circulo centro=(60,100) raio=40 fundo=amarelo borda=preto espessura=3
  Circulo centro=(150,100) raio=0
  Retangulo (200,80) 80x60 fundo=roxo
  Retangulo (0,0) 300x200 espessura=0 fundo=verde
```

## V3 — Grupos e modificadores

**Cobre:** grupo sem modificador, com gira, com move, com os dois em ordens misturadas, modificador repetido e grupo vazio.

**Programa:**

```
tela 200 200
grupo {
  circulo 100 100 50
}
grupo gira 90 {
  reta 0 0 100 0 borda azul
}
grupo move 10 20 {
  retangulo 0 0 30 30 fundo laranja
}
grupo gira 30 move 50 60 gira 15 {
}
```

**Resultado esperado:** programa válido (nenhum erro léxico ou sintático). AST:

```
Programa
  Tela 200x200
  Grupo []
    Circulo centro=(100,100) raio=50
  Grupo [Rotacao(90)]
    Reta (0,0)->(100,0) borda=azul
  Grupo [Deslocamento(10,20)]
    Retangulo (0,0) 30x30 fundo=laranja
  Grupo [Rotacao(30), Deslocamento(50,60), Rotacao(15)]
```

## V4 — Carro (grupos aninhados em 3 níveis)

**Cobre:** grupo dentro de grupo dentro de grupo; forma dentro de grupo; comentário; cores branco e preto.

**Programa:**

```
tela 400 300
// um carro simples
retangulo 50 150 200 60 fundo azul
grupo move 70 190 {
  circulo 0 0 25 fundo preto
  grupo gira 45 {
    reta 0 0 20 0 borda branco espessura 2
    grupo move 5 0 {
      circulo 0 0 3 fundo branco
    }
  }
}
grupo move 200 190 {
  circulo 0 0 25 fundo preto
}
```

**Resultado esperado:** programa válido (nenhum erro léxico ou sintático). AST:

```
Programa
  Tela 400x300
  Retangulo (50,150) 200x60 fundo=azul
  Grupo [Deslocamento(70,190)]
    Circulo centro=(0,0) raio=25 fundo=preto
    Grupo [Rotacao(45)]
      Reta (0,0)->(20,0) borda=branco espessura=2
      Grupo [Deslocamento(5,0)]
        Circulo centro=(0,0) raio=3 fundo=branco
  Grupo [Deslocamento(200,190)]
    Circulo centro=(0,0) raio=25 fundo=preto
```

## V5 — Casa e sol (cenário completo)

**Cobre:** tudo junto: hexadecimal, comentários no fim da linha e em linha própria, linhas em branco, grupo com gira e move, grupo interno.

**Programa:**

```
tela 320 240 // largura e altura
// céu e chão
retangulo 0 0 320 160 fundo #87CEEB
retangulo 0 160 320 80 fundo verde borda #006400 espessura 3

// casa: telhado e paredes em um grupo, porta em um grupo interno
grupo move 40 60 {
  reta 0 40 50 0 borda vermelho espessura 3
  reta 50 0 100 40 borda vermelho espessura 3
  retangulo 0 40 100 60 fundo amarelo borda preto
  grupo move 40 60 {
    retangulo 0 0 20 40 fundo #8B4513
  }
}

// sol com raios (rotação e deslocamento no mesmo grupo)
grupo move 260 50 {
  circulo 0 0 20 fundo amarelo borda laranja
  grupo gira 45 move 0 0 {
    reta 25 0 40 0 borda laranja espessura 2
  }
}
```

**Resultado esperado:** programa válido (nenhum erro léxico ou sintático). AST:

```
Programa
  Tela 320x240
  Retangulo (0,0) 320x160 fundo=#87CEEB
  Retangulo (0,160) 320x80 fundo=verde borda=#006400 espessura=3
  Grupo [Deslocamento(40,60)]
    Reta (0,40)->(50,0) borda=vermelho espessura=3
    Reta (50,0)->(100,40) borda=vermelho espessura=3
    Retangulo (0,40) 100x60 fundo=amarelo borda=preto
    Grupo [Deslocamento(40,60)]
      Retangulo (0,0) 20x40 fundo=#8B4513
  Grupo [Deslocamento(260,50)]
    Circulo centro=(0,0) raio=20 fundo=amarelo borda=laranja
    Grupo [Rotacao(45), Deslocamento(0,0)]
      Reta (25,0)->(40,0) borda=laranja espessura=2
```

## I1 — Erros léxicos (zero à esquerda, hexadecimal curto, palavra colada)

**Cobre:** 05; #12345; azulejo (começa com a cor azul, mas é outra palavra).

**Programa:**

```
tela 200 200
circulo 100 100 05 fundo azul
retangulo 10 10 50 50 fundo #12345
reta 0 0 10 10 borda azulejo
```

**Resultado esperado:** erro léxico (a análise sintática não roda; não há AST). Erros, na ordem:

- linha 2: "05"
- linha 3: "#12345"
- linha 4: "azulejo"

## I2 — Erro sintático: programa sem tela

**Cobre:** a declaração tela é obrigatória e deve ser a primeira.

**Programa:**

```
// esqueci da tela
circulo 100 100 50 fundo azul
```

**Resultado esperado:** erro sintático (sem AST). Mensagem:

```
Erro sintático na linha 2: esperado TELA, encontrado CIRCULO ("circulo")
```

## I3 — Erro sintático: argumento faltando dentro de um grupo

**Cobre:** o retângulo precisa de 4 números; o analisador percebe ao ler 'fundo'.

**Programa:**

```
tela 200 200
grupo move 10 20 {
  retangulo 10 10 50 fundo azul
}
```

**Resultado esperado:** erro sintático (sem AST). Mensagem:

```
Erro sintático na linha 3: esperado NUM, encontrado FUNDO ("fundo")
```

