'use client';

import { OrderStatus } from '@prisma/client';

import { formatCurrency, formatDate } from '@/lib/utils/format';

type RecentOrdersTableProps = {
  orders: {
    id: string;
    customerName: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
  }[];
};

const statusClasses: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-amber-500/20 text-amber-200',
  PAID: 'bg-emerald-500/20 text-emerald-200',
  FULFILLED: 'bg-emerald-500/20 text-emerald-200',
  PARTIALLY_REFUNDED: 'bg-amber-500/20 text-amber-200',
  REFUNDED: 'bg-white/10 text-white/60',
  CANCELLED: 'bg-red-500/20 text-red-200',
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Pedidos recentes</p>
          <h3 className="text-2xl font-semibold text-white">Últimas transações</h3>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.3em] text-white/50">
            <tr>
              <th className="pb-2">Pedido</th>
              <th className="pb-2">Cliente</th>
              <th className="pb-2">Data</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 font-mono text-xs text-white/70">{order.id.slice(0, 8)}</td>
                <td className="py-3 text-white">{order.customerName}</td>
                <td className="py-3 text-white/70">{formatDate(order.createdAt)}</td>
                <td className="py-3 font-semibold text-white">{formatCurrency(order.total)}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${statusClasses[order.status] ?? 'bg-white/10 text-white/60'}`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-white/60">
                  Sem pedidos registados nesta janela.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
