-- AlterTable
ALTER TABLE "DropQueueTicket" ADD COLUMN     "clientFingerprint" TEXT,
ADD COLUMN     "ipHash" TEXT,
ADD COLUMN     "riskReason" TEXT,
ADD COLUMN     "riskScore" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "userAgentHash" TEXT;

-- CreateIndex
CREATE INDEX "DropQueueTicket_clientFingerprint_idx" ON "DropQueueTicket"("clientFingerprint");

-- CreateIndex
CREATE INDEX "DropQueueTicket_ipHash_idx" ON "DropQueueTicket"("ipHash");
