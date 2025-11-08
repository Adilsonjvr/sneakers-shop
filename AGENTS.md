# AGENTS.md — High-Cost Sneakers (Air Jordans)

## Objetivo
Implementar um e-commerce premium de ténis (Air Jordans) com UI moderna, Stripe (SCA/3DS), BD relacional (Prisma/Postgres), drops com fila/anti-bot, dashboard e KPIs.

## Contexto
- PRD em `docs/PRD.md` (modos: Showroom, Drop, Colecionador).
- DB: `prisma/schema.prisma` (Products/Variants/Inventory, Drops/Queue/Reservations, Orders/Payments/Coupons, Wishlist/Collections, AuditLog).
- Conformidade: IVA PT (23%), PSD2/SCA, GDPR.

## Stack
Next.js (App Router) + Tailwind + Framer Motion, Prisma/PostgreSQL, Stripe (Payment Intents + Webhooks), GA4/Amplitude.

## Tarefas prioritárias
1) Gerar migrações Prisma e seed inicial (30 SKUs).
2) API:
   - GET /api/products, GET /api/products/:id
   - POST /api/checkout (Stripe Payment Intents)
   - POST /api/webhooks/stripe (confirmar pagamento → baixar stock)
3) Reserva de stock (TTL 10 min) + limpeza automática.
4) PLP/PDP: card quick-add, heatmap de tamanhos, troca de colorway inline.
5) Dashboard v1 (vendas/dia, autorização, abandono, stock, drops).
6) Testes de fluxo de compra (Playwright) + scripts npm.

## Restrições
- Acessibilidade WCAG 2.2 AA.
- Core Web Vitals (LCP ≤ 2,5 s).
- Segurança: validação Stripe-Signature, idempotency-key, RBAC admin.

## Artefatos
- `docs/PRD.md` (fonte da verdade).
- `.env` com DATABASE_URL e chaves Stripe.
