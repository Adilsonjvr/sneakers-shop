import { PrismaClient, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 200;

async function cleanupExpiredReservations() {
  let totalProcessed = 0;

  while (true) {
    const now = new Date();
    const expired = await prisma.inventoryReservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: { lte: now },
      },
      select: {
        id: true,
        variantId: true,
        quantity: true,
      },
      take: BATCH_SIZE,
    });

    if (!expired.length) {
      break;
    }

    const groupedByVariant = expired.reduce<Map<string, number>>((map, reservation) => {
      map.set(
        reservation.variantId,
        (map.get(reservation.variantId) ?? 0) + reservation.quantity,
      );
      return map;
    }, new Map());

    await prisma.$transaction(async (tx) => {
      await tx.inventoryReservation.updateMany({
        where: { id: { in: expired.map((reservation) => reservation.id) } },
        data: { status: ReservationStatus.EXPIRED },
      });

      for (const [variantId, quantity] of groupedByVariant.entries()) {
        const inventory = await tx.inventory.findUnique({
          where: { variantId },
          select: { qtyReserved: true },
        });

        if (!inventory) continue;

        const newReserved = Math.max(0, inventory.qtyReserved - quantity);

        await tx.inventory.update({
          where: { variantId },
          data: { qtyReserved: newReserved },
        });
      }
    });

    totalProcessed += expired.length;
  }

  if (totalProcessed === 0) {
    console.log('Nenhuma reserva expirada para limpar.');
  } else {
    console.log(`Reservas expiradas liberadas: ${totalProcessed}`);
  }
}

cleanupExpiredReservations()
  .catch((error) => {
    console.error('Erro ao limpar reservas expiradas', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
