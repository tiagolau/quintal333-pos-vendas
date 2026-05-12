# 007 — Redesign Editorial do Fluxo do Cliente (Impeccable)

**Data:** 2026-05-12
**Status:** aceito

## Contexto

A primeira versão do fluxo gamificado de pós-vendas (rating → register → roulette → result) foi implementada em março/2026 como MVP para validar o conceito. O resultado funciona, mas o tratamento visual herdado de templates SaaS-padrão entrava em conflito direto com o posicionamento estratégico do Quintal 333 como pizzaria artesanal premium.

Após o `/impeccable teach` (que gerou o [PRODUCT.md](../../PRODUCT.md)), ficaram explícitas duas anti-referências críticas:

1. **Formulário corporativo / pesquisa de satisfação genérica** (a tela de rating com cara de Typeform/SurveyMonkey).
2. **Cassino / promoção duvidosa estilo bet** (a roleta com segmentos vermelhos/verdes, confete saturado, CTAs maiúsculos pulsando).

A versão anterior caía em ambas. O outcome estratégico do produto é **maximizar percepção de marca** (não conversão), tornando inadmissível qualquer microinteração que rebaixasse a marca.

## Decisão

Redesign completo das 4 telas do fluxo do cliente, mantendo backend, API, schema e tipos inalterados. Apenas a camada de apresentação foi reescrita, com nova direção visual ancorada em referências editoriais gastronômicas.

### Direção visual confirmada (via `/impeccable shape`)

- **Register:** product (com outcome de brand-perception, combinação rara)
- **Color strategy:** Committed (dark domina 60-70%, cream estrutura 20-30%, gold ≤10%)
- **Tema:** dark, forçado pela scene sentence "cliente recém-saciado depois das 21h em mesa com luz quente baixa"
- **Âncoras:** NYT Cooking, Apartamento Magazine, branding Massimo Bottura / Carlo Cracco
- **Tipografia:** sérifa editorial Fraunces Variable (headings + valor do prêmio + código do cupom) + Geist (UI/labels/body)
- **Personalidade:** premium, acolhedor, confiante; fine dining casual sem firulas

### Mudanças concretas implementadas

| Camada | Antes | Depois |
|---|---|---|
| Tokens cor | HEX (`#1a1a1a`, `#c9a84c`...) | OKLCH com chroma reduzida nos extremos, tinted toward gold hue |
| Fontes | só Geist | Geist + Fraunces Variable (axes `opsz`, `SOFT`) |
| Header | Brand-block centrado | Wordmark editorial (PIZZARIA / Quintal 333) com underline gold reveal |
| Indicador de progresso | 4 dots circulares | Algarismos romanos I / II / III / IV em Fraunces italic |
| Tela Rating | Card com box-shadow + 3 linhas de stars | Layout cardápio com dotted-leader entre label e estrelas |
| Estrelas | Lucide cartoon arredondada com `scale-125` ao tap | SVG custom 5-pontas thin com transição suave de fill |
| Comment field | Textarea com background charcoal e borda rounded | Bilhete editorial com bottom-line gold no focus |
| CTA primário | Botão pill `bg-q-gold uppercase tracking-wider animate-pulse-gold` | Texto smallcaps Fraunces entre duas linhas horizontais gold |
| Tela Register | Box inputs com bordas rounded | Inputs underline-only, labels smallcaps, hint italic gold lowercase |
| Checkbox | Default browser com `accent-color` | Custom SVG check em gold com animação opacity |
| Roleta segmentos | 8 cores saturadas (vermelho `#c0392b`, verde `#27ae60`...) | Monocromático: alternância sutil coal/charcoal com hairline gold dividers |
| Roleta hub | Center disc rotacionando junto | Overlay separado, hub "333" permanece fixo durante o giro |
| Roleta CTA | Botão externo `GIRAR ROLETA!` uppercase pulsante | Tap target invisível centrado no hub (44px); instrução `toque o disco para girar` italic |
| Roleta easing | `cubic-bezier(0.17, 0.67, 0.12, 0.99)` 5×360° | `cubic-bezier(0.12, 0.85, 0.18, 1)` 6×360° + jitter de parada |
| Reduced motion | Não respeitado | Path completo: sem rotação, segmentos não-vencedores fadem para opacity 0.32, ~700ms |
| Áudio | Nenhum | Tom sutil via Web Audio API (880→620Hz sine, 60ms decay) na parada |
| Confete | 40 partículas saturadas multicor caindo na vitória | Removido totalmente (`confetti.tsx` deletado) |
| Result heading | "Você ganhou!" / "Quase!" com ! duplo | "Parabéns." / "Da próxima." Fraunces grande, ponto final |
| Result prize | Card bordado com ícone Gift centrado | Layout diploma sem card, eyebrow smallcaps + serif scale-tracking no código |
| Result código | Mono code dourado no centro de uma caixa preta | Fraunces large gold com letter-spacing animation (reveal-code 720ms) |
| Result share | "Compartilhar" + ícone Share2 + restart icon redondo | "Mostrar no Instagram" full-width entre linhas + link discreto "outro avaliador?" para o garçom |
| Result Quase! | Mostrava literal "Quase!" como prize name | Mascara para "Cinco por cento pela noite" quando isWin = false |
| Focus ring | `*:focus-visible { outline 1px gold }` aplicava caixa em inputs | Confinado a `button, a, [role=button], [role=radio]`; inputs usam underline-focus |

### Copy revisado (extrato)

- "Como foi sua experiência?" → "Conta pra gente"
- "Próximo" → "Continuar"
- "Agora seus dados para girar a roleta!" → "Quase lá."
- "(ganhe um presente especial!)" → "presente de aniversário, se quiser dividir"
- "Girar Roleta!" → "Pronto"
- "Você ganhou!" → "Parabéns."
- "Quase!" → "Da próxima."
- "Seu código" → "Código"
- "Apresente este código na sua próxima visita." → "Apresente quando voltar."
- "Compartilhar" → "Mostrar no Instagram"

Regras gerais: zero emojis no fluxo do cliente, máximo uma exclamação por tela, sem em-dashes.

### Acessibilidade

- WCAG AA preservada (contraste cream/gold sobre dark, foco visível em todos os interativos)
- `prefers-reduced-motion: reduce` totalmente respeitado, inclusive na roleta (que tem path completo de revelação sem rotação)
- Touch targets ≥ 44px (estrelas, hub da roleta, CTAs)
- Roleta acessível por teclado (botão central focável)
- Live region em `aria-label` no chapter indicator

## Alternativas Consideradas

- **Hi-fi exploratório em vez de production-ready:** descartado porque o atual já tinha 6+ violações claras das anti-referências do PRODUCT.md; valeu refazer com intenção.
- **Hospitalidade contemporânea (Hotel Fasano, Aesop, Le Pigeon):** descartado em favor de editorial gastronômico, que carrega mais identidade tipográfica e melhor pareia com a herança de pizzaria artesanal.
- **Caseiro-refinado com textura de papel:** descartado por risco de cair no cliché Brooklyn-vintage (uma das anti-referências do PRODUCT.md).
- **Apple/Linear-restrained com 1 momento dourado:** descartado por ser product demais para uma marca cuja superfície digital é a extensão da experiência gastronômica.
- **Fluxo paralelo para nota baixa (média ≤2 estrelas):** descartado em favor de tratamento idêntico, mantendo simplicidade; alerta no admin permanece a forma de detectar e agir manualmente.
- **Adicionar logo gráfico/ornamento:** descartado em favor de maximum restraint (wordmark tipográfica pura) por decisão explícita do usuário.

## Consequências

**Positivas:**
- Fluxo deixa de cair nas duas anti-referências críticas do PRODUCT.md
- Brand-perception fortemente alinhada com posicionamento "pizzaria artesanal premium"
- Roleta deixa de parecer slot machine e vira "pequeno objeto de luxo girando"
- Result screen como diploma/boletim funciona como peça compartilhável no Instagram
- Componentes mais coesos e fáceis de iterar (sistema de tokens OKLCH centralizado)
- Reduced-motion suportado de ponta a ponta (ganho de acessibilidade real)

**Negativas / a observar:**
- Tipografia serif depende de carregar Fraunces Variable via Google Fonts (custo de bandwidth pequeno, mas existe FOUT durante o load — mitigado via `display: swap`)
- Web Audio click no fim da roleta pode falhar silenciosamente em iOS antigo (acceptable: o áudio é decoração, não funcionalidade)
- Schema do banco ainda tem o prize com nome literal "Quase!" — o display é mascarado no client; eventual mudança no banco requer atualização do guard `name !== "Quase!"`
- Confetti.tsx removido: se algum futuro design quiser celebração, redesenhar com restraint (não recuperar o arquivo)

## Verificação

Validado em iPhone (390x844), tablet (768x1024) e desktop (1280x800) via Playwright. Capturadas screenshots das 4 telas em estados: empty, filled, focused/blurred, spinning, mid-spin, reveal, win, near-miss (via mask). Reduced-motion validado em viewport mobile.

Build limpo: `npx tsc --noEmit` sem erros; ESLint sem warnings nos arquivos tocados (warnings remanescentes em admin são pré-existentes e fora do escopo deste redesign).

Arquivos modificados:
- `app/src/app/globals.css`
- `app/src/app/layout.tsx`
- `app/src/app/page.tsx`
- `app/src/app/steps/rating.tsx`
- `app/src/app/steps/register.tsx`
- `app/src/app/steps/roulette.tsx`
- `app/src/app/steps/result.tsx`
- `app/src/components/star-rating.tsx`
- `app/src/components/phone-input.tsx`
- `app/src/components/roulette-wheel.tsx`
- `app/src/components/chapter-indicator.tsx` (novo)
- `app/src/components/confetti.tsx` (deletado)
