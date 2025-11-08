[![Air Jordan 1 High OG 'Rare Air' (DZ5485-100) release date. Nike SNKRS](https://tse1.mm.bing.net/th/id/OIP.eA02AEROv144-1aAVp1-EQHaJQ?cb=ucfimgc2\&pid=Api)](https://www.nike.com/in/launch/t/air-jordan-1-high-og-rare-air?utm_source=chatgpt.com)

# PRD — Página de Vendas “High-Cost Sneakers” (Air Jordans) com Stripe, BD e Dashboard

## 1) Visão e objetivos

**Visão.** Vender modelos premium/edições limitadas de Air Jordan com experiência visual de alto padrão, performance excelente e checkout seguro.
**Objetivos de negócio.**

* Conversão ≥ **2,5%** no trimestre 1.
* Ticket médio (AOV) ≥ **€220**.
* Taxa de autorização de pagamento ≥ **95%** (com SCA). ([docs.stripe.com][1])
* Tempo de carregamento LCP ≤ **2,5s** (desktop/móvel).

**KPIs.** Conversão, AOV, abandono de carrinho, autorização/3DS, reembolsos, “sell-through” de drops em 24h, NPS pós-compra.

---

## 2) Escopo

### MVP (0–1)

* Catálogo com filtros (modelo, cor, tamanho EU, faixa de preço, ano/“drop”).
* PDP (Product Detail Page) com fotos HD, “colorway”, tabela de tamanhos, disponibilidade em tempo real.
* Carrinho e checkout Stripe (Payment Element/Checkout), SCA/3DS e Radar. ([docs.stripe.com][1])
* BD relacional (clientes, produtos, variantes, stock, pedidos, pagamentos).
* Dashboard admin (CRUD de produtos/variantes, stock, pedidos, clientes, cupons).
* Fiscalidade UE/Portugal: cálculo de IVA padrão **23%** no continente. ([Gov.pt][2])
* Privacidade/GDPR (consentimento cookies/analytics, política de dados). ([European Commission][3])

### V2 (1–3)

* “Drop calendar” + fila/raffle anti-bot.
* Lista de espera, notificações, wishlist.
* Auth com MFA para administradores.
* Conciliação automática de pagamentos/reembolsos via webhooks.
* Integração de expedição (CTT/DHL) e RMA.

---

## 3) Personas resumidas

* **Colecionador “OG”** (25–45): busca lançamentos e OGs (AJ1, AJ4, AJ11), aceita pagar premium.
* **Fashion buyer** (18–35): decide por estética e hype; sensível a UX e parcelamento.
* **Revendedor curador** (20–40): compra múltiplos pares, precisa de stock rápido e faturas corretas.

---

## 4) Catálogo inicial (seed) — modelos e preços de referência

> Usado para povoar BD com SKUs e guiar UI de filtros

| Modelo                                           | Colorway / Nota                                           | Preço Nike (ref.)                                |
| ------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------ |
| **Air Jordan 1 High OG “Rare Air”** (DZ5485-100) | Lançamento recente; base para filtro “High OG”            | **€189,99** (Nike PT). ([Nike.com][4])           |
| **Air Jordan 4 Retro “Cave Stone and Black”**    | “Worn Blue” e “Cave Stone” têm versões M/W/Kids           | **€209,99** (Nike PT, adulto). ([Nike.com][5])   |
| **Air Jordan 11 Retro “Pearl”** (W)              | Linha AJ11 mantém lançamentos sazonais                    | **€209,99** (Nike PT W). ([Nike.com][6])         |
| **Air Jordan 1 High OG “Black Toe Reimagined”**  | Edição limitada; preço de lançamento **$180** (histórico) | Lançamento noticiado. ([GQ][7])                  |
| **Air Jordan 11 “H-Town”** (2025)                | Parte da coleção 30 anos AJ11, PVP **$250**               | Contexto de lançamento. ([Houston Chronicle][8]) |
| **Arquivos AJ4/AJ11**                            | Páginas de arquivo Nike para storytelling de PDP          | História oficial AJ4/AJ11. ([Nike.com][9])       |

---

## 5) Requisitos funcionais

### 5.1 Catálogo e busca

* Filtros: **Modelo (AJ1, AJ3, AJ4, AJ11…)**, tamanho EU/US/CM, cor, preço, ano/drop, condição (novo “deadstock”).
* Ordenações: novidade, preço, “sell-through”, mais vistos.
* URL “shareable” com estado de filtros.

**Aceite.** Filtro múltiplo em ≤200 ms do lado do cliente; URL reflete filtros; paginação infinita/servidor.

### 5.2 PDP

* Fotos 1:1 e 4:5, zoom, galeria; ficha técnica (materiais, peso, “colorway”), grade de tamanhos com alerta de **últimas unidades**.
* Área “História do modelo” (pull de conteúdo de arquivo AJ4/AJ11). ([Nike.com][9])
* Recomendações (“compre também”, “outros drops”).
  **Aceite.** Seleção de tamanho habilita CTA “Comprar”; stock em tempo real.

### 5.3 Carrinho e checkout

* **Stripe** Payment Element ou Checkout hospedado (mais simples) com **SCA/3DS** sob PSD2. ([docs.stripe.com][1])
* Métodos: cartão (3DS), Apple Pay/Google Pay, e SEPA (quando aplicável).
* Cálculo de **IVA 23%** (Portugal continental), frete e descontos. ([Gov.pt][2])
* **Stripe Radar** (regras e pontuação de risco). ([docs.stripe.com][10])
  **Aceite.** Autorização ≥95%; webhooks confirmam `payment_intent.succeeded` antes de reduzir stock.

### 5.4 Pós-compra

* Email de confirmação + fatura com IVA discriminado; tracking.
* Portal de pedidos (download fatura, devolução, nota de crédito).

### 5.5 Dashboard admin

* **Produtos/Variantes**: CRUD, imagens, “colorway”, tags, **SKU por tamanho**.
* **Stock**: entrada/saída, mínimo, auditoria.
* **Pedidos**: status, reembolsos parciais/totais via Stripe, exportação CSV.
* **Clientes**: histórico, taxa de devolução, LTV.
* **Promo**: cupons, bundles, drops programados.
* **Relatórios**: vendas/dia, taxa de autorização, fraude bloqueada (Radar), abandono.

---

## 6) Requisitos não funcionais

* **Performance.** Core Web Vitals: LCP ≤2,5 s; TTI ≤3 s; imagens otimizadas (Next/Image).
* **Acessibilidade.** WCAG 2.2 AA (foco visível, contraste, teclas).
* **Segurança.** OWASP ASVS L2, CSP rígida, SameSite cookies, **idempotency-key** nas chamadas Stripe, validação de **`Stripe-Signature`** em webhooks. ([docs.stripe.com][1])
* **Privacidade.** GDPR (minimização, finalidade, retenção, DSR). ([European Commission][3])
* **Conformidade pagamentos.** PSD2/SCA Portugal. ([bportugal.pt][11])

---

## 7) Arquitetura de solução

### 7.1 Frontend

* **Next.js** + React, App Router, Server Components; UI kit consistente (tailwind/shadcn opcional).
* **CDN** + cache de página/edge; fallback SSR para PDP/PLP.
* Anti-bot: **Turnstile/reCAPTCHA**, “queue” em drops.

### 7.2 Backend/API

* **Node.js** (Next API routes / server actions)
* **Stripe** (Payment Intents + Webhooks):

  * `POST /api/checkout` → cria PaymentIntent/Session.
  * `POST /api/webhooks/stripe` → confirma pagamento, emite fatura, reduz stock.
  * Radar com regras (bloquear país/tarifa alta de risco, velocity). ([docs.stripe.com][12])

### 7.3 Banco de dados (PostgreSQL)

**Tabelas principais.**

* `customers` (id, nome, email, telefone, marketing_opt_in, created_at)
* `addresses` (customer_id, tipo, país, NIF/VAT opcional)
* `products` (id, nome, modelo: AJ1/AJ4/AJ11…, descrição, brand, status)
* `variants` (id, product_id, **sku**, **size_eu/us/cm**, colorway, preço, **gtin** opc.)
* `inventory` (variant_id, **qty_on_hand**, **qty_reserved**, min_threshold)
* `orders` (id, customer_id, total_bruto, iva, frete, total_liq, status)
* `order_items` (order_id, variant_id, qty, preço_unit)
* `payments` (order_id, stripe_payment_intent_id, status, risk_score)
* `refunds` (payment_id, valor, motivo)
* `coupons`, `drops`, `audit_logs`

**ER (simplificado).**

```
customers 1—N orders 1—N order_items N—1 variants N—1 products
variants 1—1 inventory
orders 1—1 payments 1—N refunds
```

---

## 8) Conteúdo e UI/UX

### 8.1 Diretrizes visuais

* **Estilo “editorial premium”** (grid generoso, tipografia forte, fundos neutros que valorizem couro/patent/mesh).
* **PDP hero** com carrossel, callouts de materiais (ex.: patent leather do AJ11), storytelling curto por modelo. ([Nike.com][13])
* **PLP** com cards altos, “quick-add” tamanho, badges (“Drop”, “Últimas 2 unidades”).
* **Confiança:** políticas claras (autenticidade, devolução 14 dias), selos de pagamento Stripe.

### 8.2 Microcópia (exemplos)

* Carrinho vazio: “Ainda dá tempo de garantir seu número no drop de hoje.”
* PDP estoque baixo: “Só **3** pares em **EU 42**.”

---

## 9) Regras fiscais e compliance (Portugal/EU)

* IVA padrão **23%** (continente; taxas distintas para Açores/Madeira). Exibir preço **com IVA** e discriminar na fatura. ([Gov.pt][2])
* **PSD2/SCA** obrigatório em e-commerce com cartões, aplicar 3DS quando solicitado pelo emissor via Stripe. ([bportugal.pt][11])
* **GDPR**: base legal (execução do contrato), consentimento para marketing, DPA com sub-processadores (Stripe, CDNs), DSR (acesso/eliminação/portabilidade). ([European Commission][3])

---

## 10) Integrações

* **Stripe Payments + Radar** (obrigatório). ([docs.stripe.com][1])
* **Envio** (CTT/DHL) — V2.
* **Analytics**: GA4 + consent mode, events de checkout (view_item, add_to_cart, begin_checkout, purchase).
* **Email**: transactional (order placed/shipped/refunded).

---

## 11) API (esqueleto)

### Público

* `GET /api/products?model=AJ1&size_eu=42&sort=new`
* `GET /api/products/{id}` (inclui variantes/stock)

### Checkout

* `POST /api/checkout` → {items[], customer, shipping} → `client_secret`
* `POST /api/webhooks/stripe` (verifica assinatura; atualiza pedido/stock)

### Admin

* `POST /api/admin/products` (JWT + RBAC)
* `PATCH /api/admin/stock` (ajuste em lote)
* `GET /api/admin/reports?range=30d`

---

## 12) Segurança

* **RBAC** (admin/gestor/atendimento), sessões curtas e MFA para admin.
* Rate-limit no `checkout`/`webhooks`.
* Logs de auditoria por ação; retenção mínima necessária (GDPR). ([European Commission][3])

---

## 13) SEO/Performance

* Páginas estáticas com **OG tags** por produto (nome + colorway).
* Sitemaps dinâmicos, schema.org/Product/Offer.
* Imagens **AVIF/WebP**, lazy-load, `srcset` e altura/largura fixas para estabilidade.

---

## 14) Testes e aceite

* **Unit e e2e** (Vitest/Playwright).
* **Fluxo de compra**: do PLP → PDP → checkout Stripe sandbox (test cards) → webhook → pedido **paid** e stock decrementado.
* **SCA**: simular 3DS obrigatório e isento; compra deve **falhar** quando webhook não chega.

---

## 15) Riscos & mitigação

* **Fraude/chargebacks** → Radar + regras (velocity, IP/geo, BIN). ([docs.stripe.com][12])
* **Bots em drops** → fila, verificação humana, limites por cliente/cartão.
* **Volatilidade de stock** → reserva de 10 min no checkout; liberação automática.

---

## 16) Roadmap resumido

* **Semana 1–2**: Design system, IA, modelos de dados, base de catálogo (seed).
* **Semana 3–5**: PLP/PDP, carrinho, Stripe (Checkout), webhooks, IVA.
* **Semana 6–7**: Dashboard v1, relatórios, e-mails.
* **Semana 8**: Testes, segurança, SEO, **go-live**.
* **Trimestre 2**: drops/raffle, expedição e RMA, wishlist, A/B testing.

---

## 17) Anexos (fontes para conteúdo de produto e conformidade)

* Catálogo e preços de **AJ1 High OG**, **AJ4 Retro**, **AJ11** na Nike PT. ([Nike.com][14])
* Página do **AJ1 “Rare Air”** (DZ5485-100) com preço em € (Nike PT). ([Nike.com][4])
* Arquivos oficiais **AJ4** e **AJ11** (história/atributos para PDP). ([Nike.com][9])
* Lançamentos: **AJ1 “Black Toe Reimagined”** e **AJ11 “H-Town”**. ([GQ][7])
* **Stripe SCA/Payment Intents** e **Radar** (fraude). ([docs.stripe.com][1])
* **PSD2/SCA** em Portugal (Banco de Portugal). ([bportugal.pt][11])
* **IVA Portugal** (taxa padrão 23%). ([Gov.pt][2])
* **GDPR** (princípios/estrutura). ([European Commission][3])

---

## 18) Critérios de “pronto para desenvolvimento”

* Protótipo Figma (PLP/PDP/Checkout/Dashboard) aprovado.
* Esquema SQL validado; endpoints definidos; chaves Stripe (.env) de teste ativas.
* Política de privacidade/termos + consent banner revisados (GDPR).
* Planilha de seed com 30 SKUs (incluindo os do quadro acima) pronta para import.

---

### Observação rápida sobre preços e conformidade

* Os preços citados são **de referência** nas páginas oficiais da Nike para PT e podem variar por lançamento/tamanho; use-os para seed e ajuste dinâmico depois. ([Nike.com][4])
* O checkout deve cumprir **SCA** (3DS) e calcular **IVA 23%** quando aplicável a Portugal continental. ([bportugal.pt][11])

Se quiser, eu já preparo a **planilha de seed (CSV)** dos produtos com campos: `name, model, colorway, sku, size_eu, price_eur, stock`.

[1]: https://docs.stripe.com/strong-customer-authentication?utm_source=chatgpt.com "Strong Customer Authentication readiness"
[2]: https://www2.gov.pt/en/cidadaos-europeus-viajar-viver-e-fazer-negocios-em-portugal/impostos-para-atividades-economicas-em-portugal/imposto-sobre-valor-acrescentado-iva-em-portugal?utm_source=chatgpt.com "Value Added Tax (VAT) in Portugal"
[3]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr_en?utm_source=chatgpt.com "Principles of the GDPR - European Commission"
[4]: https://www.nike.com/pt/t/sapatilhas-air-jordan-1-retro-high-og-oSRhapAE?utm_source=chatgpt.com "Sapatilhas Air Jordan 1 High OG \"Rare Air\" para homem"
[5]: https://www.nike.com/pt/en/w/jordan-4-shoes-3go3gzy7ok?utm_source=chatgpt.com "Jordan 4 Trainers & Shoes"
[6]: https://www.nike.com/pt/en/w/jordan-11-shoes-6eg63zy7ok?utm_source=chatgpt.com "Jordan 11 Shoes"
[7]: https://www.gq.com/story/air-jordan-1-black-toe-reimagined?utm_source=chatgpt.com "The Air Jordan 1 High OG 'Black Toe Reimagined' Features a Rare MJ Detail"
[8]: https://www.houstonchronicle.com/news/houston-texas/trending/article/houston-jordan-11-h-town-21099761.php?utm_source=chatgpt.com "Air Jordan 11 'H-Town,' inspired by Houston car culture, drops in November"
[9]: https://www.nike.com/jordan/air-jordan-4?utm_source=chatgpt.com "Air Jordan 4 retro & OG archive collection"
[10]: https://docs.stripe.com/radar?utm_source=chatgpt.com "Radar | Stripe Documentation"
[11]: https://www.bportugal.pt/page/autenticacao-forte?utm_source=chatgpt.com "Autenticação forte"
[12]: https://docs.stripe.com/radar/rules?utm_source=chatgpt.com "Fraud prevention rules"
[13]: https://www.nike.com/jordan/air-jordan-11?utm_source=chatgpt.com "Air Jordan 11 retro & OG archive collection"
[14]: https://www.nike.com/pt/en/w/jordan-1-shoes-4fokyzy7ok?utm_source=chatgpt.com "Air Jordan 1 Trainers. Nike PT"


---

## 1) Novas seções no PRD

### 1.1 Experiência de Apresentação (PLP/PDP)

**Modos disponíveis (alternáveis por aba/toggle):**

* **Showroom (Editorial Premium):** foco visual, storytelling e materiais; “quick-add por tamanho”.
* **Drop (Live):** countdown, fila anti-bot, barra de stock por tamanho, feed “esgotou”.
* **Colecionador:** grelha de colorways; cinza → colorido ao adquirir/salvar; “construtor de coleções”.

**Critérios de aceite (PLP):**

* Loading inicial ≤ **1,5 s** (acima-da-dobra).
* Quick-add de tamanho no card (desktop hover / mobile tap).
* Filtros com múltipla seleção (modelo, cor, tamanho EU/US/CM, faixa de preço, ano/drop).
* URL reflete filtros e ordenação (shareable).

**Critérios de aceite (PDP):**

* Galeria 1:1 e 4:5, zoom natural e preload da próxima imagem.
* Heatmap de tamanhos (verde→laranja→vermelho), tooltip de stock e prazo.
* Blocos de confiança (autenticidade, devolução 14d, Stripe, envio).
* Recomendações e variações por colorway sem recarregar a página.

---

### 1.2 Modo Drop (Live + Anti-bot)

**Regras:**

* Header com **countdown**; estado de fila (“n usuários na fila”).
* Reserva de item por **10 min** ao iniciar checkout; liberação automática ao expirar.
* Limites por cliente/cartão, CAPTCHA invisível e rate-limit no endpoint de checkout.
* Webhook Stripe confirma `payment_intent.succeeded` antes de baixar stock.

**KPIs Drop:** conversão por minuto, % atendidos na fila, chargebacks, tempo médio até esgotar.

---

### 1.3 Modo Colecionador (Exploração + Gamificação Leve)

**Funcionalidades:**

* Grelha de **colorways** por modelo (cinza por padrão; colorido quando “em stock”, “comprado” ou “em wishlist”).
* **Construtor de coleções** (salvar filtros/curadorias).
* Perfil com progresso (ex.: 12/40 AJ1 High OG) e alertas de reposição.

**KPIs Colecionador:** sessões recorrentes/30 dias, tamanho de wishlist, conversão de alertas.

---

### 1.4 Componentes UI (definição rápida)

* **Card de Produto (PLP):** imagem 1:1, nome, colorway, preço (IVA incl.), seletor de tamanho inline, CTA “Adicionar EU 42”.
* **Heatmap de Tamanhos (PDP):** tabela EU/US/CM com estados (Disponível / Poucas / Esgotado).
* **Banner de Drop:** countdown + botão “Entrar na fila”.
* **Feed de Eventos (Drop):** “EU 42 esgotou há 1 min”.
* **Bundle Inteligente:** upsell no carrinho (limpeza, meias), desconto pequeno.

**Micro-interações:**

* Animações de 120–180 ms (Framer Motion).
* Sombra suave ao focar/hover; feedback tátil no mobile.

---

### 1.5 Dados e Modelagem (ajustes)

Novos campos nas tabelas existentes:

* `products`: `story_html`, `materials`, `model_line (AJ1/AJ4/AJ11...)`, `is_drop`, `drop_start_at`.
* `variants`: `size_eu`, `size_us`, `size_cm`, `availability_state` (enum), `last_known_stock`.
* `drops`: `product_id`, `queue_enabled`, `per_customer_limit`, `captcha_required`, `reserve_minutes`.
* `wishlists`: `customer_id`, `variant_id`, `created_at`.
* `collections`: `customer_id`, `name`, `filters_json`.

Eventos de analytics (GA4/Amplitude):

* `view_item_list`, `select_size`, `add_to_cart`, `begin_checkout`, `purchase`,
  **Drop:** `queue_joined`, `queue_left`, `reserve_started`, `reserve_expired`, `drop_sold_out`.

---

### 1.6 Acessibilidade e Performance (reforço)

* **WCAG 2.2 AA**: foco visível, contraste mínimo 4.5:1, alvos ≥44 px.
* **LCP ≤ 2,5 s**: `next/image` com AVIF/WebP, `loading=lazy`, `priority` para hero, CDN/edge caching.
* **SEO**: `schema.org/Product/Offer`, OG tags por colorway, sitemap dinâmico.

---

### 1.7 Testes / A-B Prioritários

1. Quick-add no PLP **vs.** fluxo tradicional via PDP.
2. Heatmap de tamanhos **vs.** dropdown clássico.
3. Hero estático **vs.** vídeo curto (6–8 s) mobile-first.
4. Bundle no carrinho **vs.** na PDP.

---

## 2) Flowchart de UX/UI (consolidado)

> Use este diagrama para organizar as telas no Figma e mapear estados de sistema.

```mermaid
flowchart TD
  %% Home & IA
  A[Home] --> B{Modo}
  B -->|Showroom| C[PLP - Showroom]
  B -->|Drop| D[Drop Live]
  B -->|Colecionador| E[Coleções/Colorways]

  %% PLP Showroom
  C --> C1[Filtrar/Ordenar]
  C --> C2[Card Quick-Add por tamanho]
  C --> C3[PDP]

  %% PDP
  C3 --> C3a[Galeria / Zoom]
  C3 --> C3b[Heatmap de Tamanhos]
  C3 -->|Adicionar| F[Mini-Carrinho]
  C3 -->|Trocar Colorway| C3

  %% Drop Live
  D --> D1[Countdown + Entrar na fila]
  D1 --> D2{Fila/Anti-bot}
  D2 -->|Liberado| D3[PDP (modo Drop)]
  D3 -->|Reserva 10 min| F
  D2 -->|Reprovado| D4[Mensagem + Tentar novamente]

  %% Colecionador
  E --> E1[Grelha de Colorways (cinza→colorido)]
  E --> E2[Salvar Coleção/Filtros]
  E --> E3[PDP]

  %% Checkout
  F --> G[Checkout Stripe]
  G -->|SCA/3DS| H{Pagamento aprovado?}
  H -->|Sim| I[Pedido Confirmado + Webhook]
  H -->|Não| J[Erro/Retentar]
  I --> K[Email + Fatura + Tracking]
  I --> L[Dashboard: Pedido Pago, Stock -1]

  %% Pós-compra
  K --> M[Conta > Pedidos/Devoluções]
```

**Estados e exceções:**

* **Reserva expirada:** volta ao PDP com aviso e recuperação de carrinho.
* **Stock negativo (race condition):** bloquear confirmação e sugerir variantes.
* **Falha webhook:** pedido fica “pending_payment”; job reprocessa.

---

## 3) Backlog imediato (Design → Dev)

**Design (Figma):**

1. Home com toggle de **Modo** (Showroom/Drop/Colecionador).
2. **PLP Showroom** com card moderno (quick-add) e filtros sticky.
3. **PDP** com heatmap e troca de colorway inline.
4. **Drop Live**: countdown, fila, barra de stock, feed “esgotou”.
5. **Coleções**: grelha de colorways (cinza→colorido), salvar coleção.
6. Componentes: card, heatmap, banner drop, mini-carrinho, bundle.

**Dev (Next.js/Stripe/Postgres):**

1. Rotas `/(shop)`, `/(drop)`, `/(collections)`, `/(account)`.
2. Componentes: `ProductCard`, `SizeHeatmap`, `DropBanner`, `MiniCart`.
3. API: `POST /api/checkout`, `POST /api/webhooks/stripe`, `GET /api/products`, `GET /api/collections`.
4. Tabelas novas (`drops`, `wishlists`, `collections`) e migrações.
5. Reserva de stock (TTL 10 min) e liberação automática (cron/queue).
6. Telemetria de eventos (GA4/Amplitude) conforme lista acima.

---

## 4) Critérios “pronto para dev” (desta etapa)

* Wireframes das **6 telas-chave** aprovados.
* Design tokens (cores, tipografia, sombras, espaçamentos, raios).
* ER atualizado e migrações SQL revisadas.
* Especificação de endpoints + contratos JSON (request/response).
* Plano de testes e cenários de exceção documentados.

---

Se preferir o **flowchart como arquivo** (PNG/PDF) ou uma **planilha de seed** com 30 SKUs para importar no BD, eu já gero agora.
