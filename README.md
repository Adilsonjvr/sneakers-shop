# Sneakers — Air Lab

Plataforma Next.js (App Router) para um e-commerce premium de Air Jordans com foco em experiências interativas de showroom, drops e storytelling para portfolio.

## Funcionalidades implementadas
- **Catálogo dinâmico** alimentado por Prisma/PostgreSQL (Supabase) com 30 SKUs, variantes EU 38‑45, heatmap de tamanhos e quick-add.
- **PDP avançada** com galleries transparentes, troca de colorway, reserva de stock (conceitual) e integração com o carrinho em tempo real.
- **Sacola (bag)** com remoção de itens, resumo com IVA/expedição simulados e CTA para checkout fictício.
- **Checkout conceitual** com formulários completos, seleção de métodos (cartão, MB Way, Klarna) e alerta confirmando que não há transação real.
- **Área do usuário** com login opcional, perfil, pedidos de demonstração, wishlist e preferências.
- **Microinterações**: holofote + áudio nos cards, colorways inline e spotlight responsivo.
- **Infra pronta** para Stripe (Payment Intents + webhooks) e filas de drop; endpoints esqueléticos já existem em `app/api`.

## Como rodar localmente
```bash
cp .env.example .env       # preencher DATABASE_URL do Supabase e chaves Stripe conforme necessário
npm install
npx prisma generate
npx prisma migrate deploy  # ou migrate dev em ambientes de desenvolvimento
npm run prisma:seed        # popula ~30 SKUs (AJ1/AJ4/AJ11) com variantes e inventário
npm run dev
```

## Deploy
- Produção em Vercel: `https://sneakers-shop-jnnumqi5u-adilsonjvrs-projects.vercel.app`
- Commits principais:
  - `c5fa281` – Suspense no header para destravar typed routes.
  - `bc93244` – Novas páginas bag/checkout/account e melhorias nas PDPs.

## Próximos passos sugeridos
1. Conectar checkout fictício ao fluxo Stripe (Payment Intent + webhooks) e baixar stock real.
2. Implementar paginação/filtragem na API de produtos e dashboard com KPIs de vendas/abandonos.
3. Adicionar testes end-to-end (Playwright) cobrindo quick-add → checkout conceptual.
4. Evoluir RBAC/Admin e fila anti-bot para drops, seguindo o PRD em `docs/PRD.md`.

