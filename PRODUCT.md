# Product

## Register

product

## Users

**Usuário primário:** cliente da pizzaria Quintal 333, pós-refeição, no salão, com o celular na mão.

Contexto típico: adulto sentado à mesa após terminar a pizza, em ambiente social (com amigos, família, parceiro), descontraído mas com paciência curta — provavelmente entre 30 e 90 segundos antes de o grupo decidir ir embora. O fluxo precisa caber nesse intervalo sem que ninguém perceba que "está respondendo uma pesquisa".

Job-to-be-done: o cliente quer girar a roleta e levar alguma recompensa para a próxima visita. A avaliação e o cadastro são o pedágio — não podem parecer pedágio.

**Usuário secundário:** Marina e Tomás (gestores do Quintal 333) operando o painel admin para ler avaliações, ajustar prêmios e acompanhar a base de clientes. O admin não pauta o design do fluxo do cliente; ele herda a linguagem visual e relaxa para o lado operacional.

## Product Purpose

Sistema digital de pós-vendas gamificado para pizzaria artesanal: o cliente escaneia um QR Code na mesa, avalia em 3 dimensões (pizza, atendimento, ambiente), faz cadastro mínimo (nome + WhatsApp + aniversário opcional), gira a roleta e recebe um cupom para a próxima visita via WhatsApp.

**Por que existe:** o Quintal 333 não tinha cadastro sistemático de clientes nem feedback estruturado. Sem isso, é impossível fazer pós-venda, reativação ou campanhas segmentadas. Este produto resolve os dois problemas em um único fluxo de menos de 60 segundos, usando a roleta como mecanismo de troca justa (cliente entrega dado + avaliação, recebe valor real de volta).

**Sucesso parece:**
- 60%+ das mesas atendidas concluem o fluxo
- O cliente sai com a sensação de "que legal essa pizzaria", não com a sensação de "respondi uma pesquisa de satisfação"
- Avaliações negativas (<3 estrelas) chegam em tempo real aos sócios para ação imediata
- O painel admin é usado diariamente sem treinamento

## Brand Personality

**Três palavras:** premium, acolhedor, confiante.

**Tom:** ar de fine dining casual. Refinado mas não distante. Pensa em Eataly, restaurantes de chef de bairro, casas que cuidam do detalhe sem cobrar fivela de gravata. Tipografia editorial, dourado fechado (não amarelo brilhante), pouco emoji, copy curta e bem escolhida.

**Resultado emocional desejado:** o cliente termina o fluxo com a impressão de que o Quintal 333 é um lugar cuidadoso, que pensa nos detalhes mesmo nos "pequenos formulários". A digitalização precisa carregar a mesma curadoria que tem na pizza.

**Outcome estratégico priorizado:** maximizar percepção de marca / encantar, mesmo que isso custe alguma conversão. Não é um funil de captura — é uma extensão da experiência gastronômica.

## Anti-references

O que esse fluxo NUNCA pode parecer:

- **Formulário corporativo / pesquisa de satisfação genérica.** Nada de SurveyMonkey, Typeform com cara de RH, "Como você avalia nosso atendimento de 1 a 10". A avaliação é um gesto curto, não uma matriz de perguntas. Sem barras de progresso burocráticas, sem títulos como "Pesquisa de satisfação".
- **Cassino / promoção duvidosa estilo bet.** A roleta é o componente mais frágil deste produto. Não pode ter neon, emojis de dinheiro, "VOCÊ GANHOU!!!" com exclamações múltiplas, cores saturadas piscando, copy de urgência fake. A roleta precisa parecer um pequeno objeto de luxo girando, não uma slot machine. Essa é a armadilha número um — todo componente novo deve ser checado contra ela.

## Design Principles

1. **Sussurre com confiança, não grite.** Premium não pede urgência. Tipografia, espaçamento e cor precisam afirmar valor sem precisar de "destaque" — se algo está bonito e bem posicionado, não precisa de gradiente, borda neon ou animação extra para ser notado.
2. **A roleta é o ponto de cuidado obsessivo.** É o componente que mais facilmente vira a antimarca. Cada detalhe — segmentos, ponteiro, cantos, easing, som (se houver), revelação — precisa de craft incomum. Trate como peça única, não como widget.
3. **Avaliar é um gesto, não um formulário.** As três estrelas e o comentário devem fluir como um carinho, não como um campo de input. Microinterações suaves, hierarquia generosa, transições rápidas e respeitosas (~200ms, ease-out exponencial).
4. **Marca em cada microinteração.** Como o outcome é percepção de marca, não conversão, cada momento de espera, transição e revelação carrega responsabilidade. Não há "loading neutro"; o ato de carregar é parte da experiência.
5. **Mobile-first com toque generoso.** Cliente está em mesa, ambiente social, luz variável, celular sujo de azeite. Áreas de toque ≥44px, contraste forte mesmo em telas com brilho baixo, sem hover-onlys, sem dependência de gestos sofisticados.

## Accessibility & Inclusion

- **WCAG AA** como linha de base (contraste de texto, foco visível, alt text em todo elemento gráfico significativo).
- **Público geral** sem persona específica de acessibilidade conhecida.
- **Compatibilidade com `prefers-reduced-motion`** mesmo sem ser requisito explícito: a roleta deve ter um caminho que respeite a preferência do usuário (revelação direta ou animação reduzida) — não bloquear a recompensa.
- **Pt-BR** como idioma único da interface. Copy em português brasileiro coloquial, mas elegante.
- **Touch-first**: todas as áreas interativas com ≥44px de alvo, sem depender de hover.
