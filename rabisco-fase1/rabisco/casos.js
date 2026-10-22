// casos.js — 5 programas válidos e 3 inválidos, com o resultado esperado de cada um.
// Usado pela página (lista "carregar um caso de teste") e por testes.mjs.
export const casos = [
  {
    "id": "V1",
    "nome": "Programa mínimo (só a tela)",
    "cobre": "tela obrigatória, comentário, programa sem nenhuma forma",
    "programa": "tela 800 600\n// programa mínimo: só a tela, nenhuma forma\n",
    "esperado": {
      "resultado": "valido",
      "resumo": "Programa\n  Tela 800x600"
    }
  },
  {
    "id": "V2",
    "nome": "Três formas e todos os atributos",
    "cobre": "reta, círculo, retângulo; borda, fundo e espessura em ordens diferentes; cores por nome e hexadecimal; zero; atributo repetido (vale o último)",
    "programa": "tela 300 200\n// as três formas, com atributos em ordens diferentes\nreta 10 10 290 10\nreta 10 20 290 20 borda vermelho\nreta 10 30 290 30 espessura 4 borda #00FF7F\ncirculo 60 100 40 fundo amarelo borda preto espessura 3\ncirculo 150 100 0\nretangulo 200 80 80 60 fundo roxo\nretangulo 0 0 300 200 espessura 0 fundo azul fundo verde\n",
    "esperado": {
      "resultado": "valido",
      "resumo": "Programa\n  Tela 300x200\n  Reta (10,10)->(290,10)\n  Reta (10,20)->(290,20) borda=vermelho\n  Reta (10,30)->(290,30) espessura=4 borda=#00FF7F\n  Circulo centro=(60,100) raio=40 fundo=amarelo borda=preto espessura=3\n  Circulo centro=(150,100) raio=0\n  Retangulo (200,80) 80x60 fundo=roxo\n  Retangulo (0,0) 300x200 espessura=0 fundo=verde"
    }
  },
  {
    "id": "V3",
    "nome": "Grupos e modificadores",
    "cobre": "grupo sem modificador, com gira, com move, com os dois em ordens misturadas, modificador repetido e grupo vazio",
    "programa": "tela 200 200\ngrupo {\n  circulo 100 100 50\n}\ngrupo gira 90 {\n  reta 0 0 100 0 borda azul\n}\ngrupo move 10 20 {\n  retangulo 0 0 30 30 fundo laranja\n}\ngrupo gira 30 move 50 60 gira 15 {\n}\n",
    "esperado": {
      "resultado": "valido",
      "resumo": "Programa\n  Tela 200x200\n  Grupo []\n    Circulo centro=(100,100) raio=50\n  Grupo [Rotacao(90)]\n    Reta (0,0)->(100,0) borda=azul\n  Grupo [Deslocamento(10,20)]\n    Retangulo (0,0) 30x30 fundo=laranja\n  Grupo [Rotacao(30), Deslocamento(50,60), Rotacao(15)]"
    }
  },
  {
    "id": "V4",
    "nome": "Carro (grupos aninhados em 3 níveis)",
    "cobre": "grupo dentro de grupo dentro de grupo; forma dentro de grupo; comentário; cores branco e preto",
    "programa": "tela 400 300\n// um carro simples\nretangulo 50 150 200 60 fundo azul\ngrupo move 70 190 {\n  circulo 0 0 25 fundo preto\n  grupo gira 45 {\n    reta 0 0 20 0 borda branco espessura 2\n    grupo move 5 0 {\n      circulo 0 0 3 fundo branco\n    }\n  }\n}\ngrupo move 200 190 {\n  circulo 0 0 25 fundo preto\n}\n",
    "esperado": {
      "resultado": "valido",
      "resumo": "Programa\n  Tela 400x300\n  Retangulo (50,150) 200x60 fundo=azul\n  Grupo [Deslocamento(70,190)]\n    Circulo centro=(0,0) raio=25 fundo=preto\n    Grupo [Rotacao(45)]\n      Reta (0,0)->(20,0) borda=branco espessura=2\n      Grupo [Deslocamento(5,0)]\n        Circulo centro=(0,0) raio=3 fundo=branco\n  Grupo [Deslocamento(200,190)]\n    Circulo centro=(0,0) raio=25 fundo=preto"
    }
  },
  {
    "id": "V5",
    "nome": "Casa e sol (cenário completo)",
    "cobre": "tudo junto: hexadecimal, comentários no fim da linha e em linha própria, linhas em branco, grupo com gira e move, grupo interno",
    "programa": "tela 320 240 // largura e altura\n// céu e chão\nretangulo 0 0 320 160 fundo #87CEEB\nretangulo 0 160 320 80 fundo verde borda #006400 espessura 3\n\n// casa: telhado e paredes em um grupo, porta em um grupo interno\ngrupo move 40 60 {\n  reta 0 40 50 0 borda vermelho espessura 3\n  reta 50 0 100 40 borda vermelho espessura 3\n  retangulo 0 40 100 60 fundo amarelo borda preto\n  grupo move 40 60 {\n    retangulo 0 0 20 40 fundo #8B4513\n  }\n}\n\n// sol com raios (rotação e deslocamento no mesmo grupo)\ngrupo move 260 50 {\n  circulo 0 0 20 fundo amarelo borda laranja\n  grupo gira 45 move 0 0 {\n    reta 25 0 40 0 borda laranja espessura 2\n  }\n}\n",
    "esperado": {
      "resultado": "valido",
      "resumo": "Programa\n  Tela 320x240\n  Retangulo (0,0) 320x160 fundo=#87CEEB\n  Retangulo (0,160) 320x80 fundo=verde borda=#006400 espessura=3\n  Grupo [Deslocamento(40,60)]\n    Reta (0,40)->(50,0) borda=vermelho espessura=3\n    Reta (50,0)->(100,40) borda=vermelho espessura=3\n    Retangulo (0,40) 100x60 fundo=amarelo borda=preto\n    Grupo [Deslocamento(40,60)]\n      Retangulo (0,0) 20x40 fundo=#8B4513\n  Grupo [Deslocamento(260,50)]\n    Circulo centro=(0,0) raio=20 fundo=amarelo borda=laranja\n    Grupo [Rotacao(45), Deslocamento(0,0)]\n      Reta (25,0)->(40,0) borda=laranja espessura=2"
    }
  },
  {
    "id": "I1",
    "nome": "Erros léxicos (zero à esquerda, hexadecimal curto, palavra colada)",
    "cobre": "05; #12345; azulejo (começa com a cor azul, mas é outra palavra)",
    "programa": "tela 200 200\ncirculo 100 100 05 fundo azul\nretangulo 10 10 50 50 fundo #12345\nreta 0 0 10 10 borda azulejo\n",
    "esperado": {
      "resultado": "erro-lexico",
      "erros": [
        "linha 2: \"05\"",
        "linha 3: \"#12345\"",
        "linha 4: \"azulejo\""
      ]
    }
  },
  {
    "id": "I2",
    "nome": "Erro sintático: programa sem tela",
    "cobre": "a declaração tela é obrigatória e deve ser a primeira",
    "programa": "// esqueci da tela\ncirculo 100 100 50 fundo azul\n",
    "esperado": {
      "resultado": "erro-sintatico",
      "erros": [
        "Erro sintático na linha 2: esperado TELA, encontrado CIRCULO (\"circulo\")"
      ]
    }
  },
  {
    "id": "I3",
    "nome": "Erro sintático: argumento faltando dentro de um grupo",
    "cobre": "o retângulo precisa de 4 números; o analisador percebe ao ler 'fundo'",
    "programa": "tela 200 200\ngrupo move 10 20 {\n  retangulo 10 10 50 fundo azul\n}\n",
    "esperado": {
      "resultado": "erro-sintatico",
      "erros": [
        "Erro sintático na linha 3: esperado NUM, encontrado FUNDO (\"fundo\")"
      ]
    }
  }
];
