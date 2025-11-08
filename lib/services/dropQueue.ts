import { Drop, DropQueueTicket, QueueTicketStatus } from '@prisma/client';
import crypto from 'node:crypto';

import { DomainError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { PrismaTransactionClient, upsertCustomer } from '@/lib/services/customers';
import { CustomerInput } from '@/lib/types/customer';

const ACTIVE_TICKET_STATUSES = [QueueTicketStatus.QUEUED, QueueTicketStatus.RELEASED];
const FINGERPRINT_WINDOW_MINUTES = 10;
const IP_WINDOW_MINUTES = 30;
const RISK_REJECTION_THRESHOLD = 0.85;

const hashValue = (value?: string | null) =>
  value ? crypto.createHash('sha1').update(value).digest('hex') : null;

type DropSummary = Pick<Drop, 'id' | 'startAt' | 'endAt' | 'reserveMinutes'>;

export type QueueTicketDTO = {
  ticketId: string;
  status: QueueTicketStatus;
  position: number | null;
  estimatedWaitMinutes: number | null;
  releasedAt: string | null;
  expiresAt: string | null;
  riskScore: number | null;
  riskReason: string | null;
  drop: {
    id: string;
    startAt: string;
    endAt: string | null;
    reserveMinutes: number;
  };
};

const toDTO = (ticket: DropQueueTicket, drop: DropSummary): QueueTicketDTO => {
  const estimatedWait =
    ticket.position && ticket.position > 0
      ? Math.max(1, (ticket.position - 1) * Math.max(drop.reserveMinutes, 1))
      : null;

  return {
    ticketId: ticket.id,
    status: ticket.status,
    position: ticket.position ?? null,
    estimatedWaitMinutes: estimatedWait,
    releasedAt: ticket.releasedAt ? ticket.releasedAt.toISOString() : null,
    expiresAt: ticket.expiresAt ? ticket.expiresAt.toISOString() : null,
    riskScore: typeof ticket.riskScore === 'number' ? ticket.riskScore : null,
    riskReason: ticket.riskReason ?? null,
    drop: {
      id: drop.id,
      startAt: drop.startAt.toISOString(),
      endAt: drop.endAt ? drop.endAt.toISOString() : null,
      reserveMinutes: drop.reserveMinutes,
    },
  };
};

const computeRiskAssessment = async (
  tx: PrismaTransactionClient,
  dropId: string,
  clientFingerprint?: string | null,
  ipHash?: string | null,
) => {
  const now = Date.now();
  let riskScore = 0;
  let riskReason: string | null = null;

  if (clientFingerprint) {
    const recentFingerprint = await tx.dropQueueTicket.count({
      where: {
        dropId,
        clientFingerprint,
        createdAt: { gte: new Date(now - FINGERPRINT_WINDOW_MINUTES * 60 * 1000) },
      },
    });

    if (recentFingerprint > 0) {
      riskScore = 0.9;
      riskReason = 'duplicate_fingerprint';
    }
  }

  if (ipHash) {
    const recentIp = await tx.dropQueueTicket.count({
      where: {
        dropId,
        ipHash,
        createdAt: { gte: new Date(now - IP_WINDOW_MINUTES * 60 * 1000) },
      },
    });

    if (recentIp > 5) {
      riskScore = Math.max(riskScore, 0.95);
      riskReason = 'ip_rate_limit';
    }
  }

  return { riskScore, riskReason };
};

export async function joinDropQueue(params: {
  dropId: string;
  customer: CustomerInput;
  fingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<QueueTicketDTO> {
  const { dropId, customer, fingerprint, ipAddress, userAgent } = params;

  return prisma.$transaction(async (tx) => {
    const drop = await tx.drop.findUnique({
      where: { id: dropId },
    });

    if (!drop) {
      throw new DomainError('Drop não encontrado', 404);
    }

    if (!drop.queueEnabled) {
      throw new DomainError('Fila desativada para este drop', 403);
    }

    if (drop.endAt && drop.endAt < new Date()) {
      throw new DomainError('Drop encerrado', 403);
    }

    const customerRecord = await upsertCustomer(tx, customer);

    const existingTicket = await tx.dropQueueTicket.findFirst({
      where: {
        dropId,
        customerId: customerRecord.id,
        status: { in: ACTIVE_TICKET_STATUSES },
      },
    });

    if (existingTicket) {
      return toDTO(existingTicket, drop);
    }

    const fingerprintHash = hashValue(fingerprint);
    const ipHash = hashValue(ipAddress);
    const userAgentHash = hashValue(userAgent);

    const { riskScore, riskReason } = await computeRiskAssessment(
      tx,
      dropId,
      fingerprintHash,
      ipHash,
    );

    const status =
      riskScore >= RISK_REJECTION_THRESHOLD
        ? QueueTicketStatus.REJECTED
        : QueueTicketStatus.QUEUED;

    let position: number | null = null;
    if (status === QueueTicketStatus.QUEUED) {
      const lastTicket = await tx.dropQueueTicket.findFirst({
        where: {
          dropId,
          position: { not: null },
        },
        orderBy: { position: 'desc' },
        select: { position: true },
      });
      position = (lastTicket?.position ?? 0) + 1;
    }

    const ticket = await tx.dropQueueTicket.create({
      data: {
        dropId,
        customerId: customerRecord.id,
        status,
        position,
        ipHash,
        userAgentHash,
        clientFingerprint: fingerprintHash,
        riskScore,
        riskReason,
      },
    });

    return toDTO(ticket, drop);
  });
}

export async function getQueueTicket(params: {
  dropId: string;
  ticketId: string;
}): Promise<QueueTicketDTO | null> {
  const { dropId, ticketId } = params;

  const ticket = await prisma.dropQueueTicket.findFirst({
    where: { id: ticketId, dropId },
    include: {
      drop: {
        select: {
          id: true,
          startAt: true,
          endAt: true,
          reserveMinutes: true,
        },
      },
    },
  });

  if (!ticket) {
    return null;
  }

  return toDTO(ticket, ticket.drop);
}
