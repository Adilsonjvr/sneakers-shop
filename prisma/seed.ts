import {
  AvailabilityState,
  Currency,
  ModelLine,
  Prisma,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

type SizeRun = {
  eu: number;
  us: number;
  cm: number;
};

type ProductDefinition = {
  name: string;
  colorway: string;
  description: string;
  storyHtml: string;
  materials: string;
  modelLine: ModelLine;
  price: number;
  skuPrefix: string;
  heroImageUrl: string;
  galleryImages: string[];
  isDrop?: boolean;
  drop?: {
    startInHours: number;
    durationHours: number;
    perCustomerLimit?: number;
    reserveMinutes?: number;
    queueEnabled?: boolean;
    captchaRequired?: boolean;
  };
  baseStock: number;
  stockBySize?: Record<number, number>;
};

const sizeRuns: SizeRun[] = [
  { eu: 38, us: 6, cm: 24 },
  { eu: 39, us: 6.5, cm: 24.5 },
  { eu: 40, us: 7, cm: 25 },
  { eu: 41, us: 8, cm: 26 },
  { eu: 42, us: 8.5, cm: 26.5 },
  { eu: 43, us: 9.5, cm: 27.5 },
  { eu: 44, us: 10.5, cm: 28.5 },
  { eu: 45, us: 11.5, cm: 29.5 },
];

const productDefinitions: ProductDefinition[] = [
  {
    name: 'Air Jordan 1 Retro High OG "Chicago 1985"',
    colorway: 'White/Varsity Red/Black',
    description:
      'Reedição fiel do par que apresentou Michael Jordan ao mundo em 1985.',
    storyHtml:
      '<p>O storytelling retoma os detalhes originais da estreia, desde o couro macio até a entressola off-white.</p>',
    materials: 'Couro premium, língua em nylon e sola em borracha.',
    modelLine: ModelLine.AJ1,
    price: 195,
    skuPrefix: 'AJ1-CHICAGO-1985',
    heroImageUrl: '/images/products/aj1-chicago.svg',
    galleryImages: ['/images/products/aj1-chicago.svg'],
    baseStock: 14,
  },
  {
    name: 'Air Jordan 1 Retro High OG "Hyper Royal"',
    colorway: 'Hyper Royal/Light Smoke Grey/White',
    description:
      'Tratamento envelhecido inspirado nas quadras de rua de Los Angeles.',
    storyHtml:
      '<p>Tingimento manual e suede lavado conferem aspecto vintage sem perder performance.</p>',
    materials: 'Suede desgastado, swoosh em couro e forro em malha respirável.',
    modelLine: ModelLine.AJ1,
    price: 205,
    skuPrefix: 'AJ1-HYPER-ROYAL',
    heroImageUrl: '/images/products/aj1-hyper-royal-1.png',
    galleryImages: [
      '/images/products/aj1-hyper-royal-1.png',
      '/images/products/aj1-hyper-royal-2.png',
      '/images/products/aj1-hyper-royal-3.png',
      '/images/products/aj1-hyper-royal-4.png',
      '/images/products/aj1-hyper-royal-5.png',
    ],
    baseStock: 12,
    stockBySize: {
      38: 8,
      39: 8,
      40: 10,
      41: 12,
      42: 12,
      43: 10,
      44: 8,
      45: 6,
    },
  },
  {
    name: 'Air Jordan 4 Retro "Military Black"',
    colorway: 'White/Black/Neutral Grey',
    description:
      'Versão 2024 do clássico Military com tratamento minimalista e grade reforçada.',
    storyHtml:
      '<p>Reengenharia das asas laterais e palmilha Zoom atualizada para suportar drops de alto volume.</p>',
    materials: 'Couro liso, mesh respirável e TPU high-gloss.',
    modelLine: ModelLine.AJ4,
    price: 225,
    skuPrefix: 'AJ4-MILITARY-BLK',
    heroImageUrl: '/images/products/aj4-military-black.svg',
    galleryImages: ['/images/products/aj4-military-black.svg'],
    isDrop: true,
    drop: {
      startInHours: 72,
      durationHours: 6,
      perCustomerLimit: 1,
      reserveMinutes: 10,
      queueEnabled: true,
      captchaRequired: true,
    },
    baseStock: 18,
  },
  {
    name: 'Air Jordan 11 Retro "Jubilee 25th"',
    colorway: 'Black/Clear Metallic Silver',
    description:
      'Edição comemorativa de 25 anos com verniz profundo e detalhes metálicos.',
    storyHtml:
      '<p>Detalhes premium em prata polida celebram a trajetória do AJ11 desde o playoff de 1995.</p>',
    materials: 'Patent leather, malha balística e fibra de carbono na placa.',
    modelLine: ModelLine.AJ11,
    price: 235,
    skuPrefix: 'AJ11-JUBILEE-25',
    heroImageUrl: '/images/products/aj11-jubilee.svg',
    galleryImages: ['/images/products/aj11-jubilee.svg'],
    isDrop: true,
    drop: {
      startInHours: 168,
      durationHours: 12,
      perCustomerLimit: 2,
      reserveMinutes: 15,
      queueEnabled: true,
      captchaRequired: true,
    },
    baseStock: 16,
    stockBySize: {
      38: 6,
      39: 8,
      40: 10,
      41: 12,
      42: 14,
      43: 12,
      44: 10,
      45: 8,
    },
  },
];

const toDecimal = (value: number) => new Prisma.Decimal(value.toFixed(1));

const determineAvailability = (qty: number) =>
  qty <= 3 ? AvailabilityState.LOW_STOCK : AvailabilityState.IN_STOCK;

async function resetCatalogData() {
  // Limpa entidades dependentes para permitir seed idempotente.
  await prisma.dropQueueTicket.deleteMany();
  await prisma.inventoryReservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.product.deleteMany();
}

async function seedProducts() {
  for (const definition of productDefinitions) {
    const now = Date.now();
    const dropConfig = definition.drop
      ? {
          create: {
            startAt: new Date(now + definition.drop.startInHours * 60 * 60 * 1000),
            endAt: new Date(
              now +
                (definition.drop.startInHours + definition.drop.durationHours) *
                  60 *
                  60 *
                  1000,
            ),
            perCustomerLimit: definition.drop.perCustomerLimit ?? 1,
            reserveMinutes: definition.drop.reserveMinutes ?? 10,
            queueEnabled: definition.drop.queueEnabled ?? true,
            captchaRequired: definition.drop.captchaRequired ?? true,
          },
        }
      : undefined;

    await prisma.product.create({
      data: {
        name: definition.name,
        colorway: definition.colorway,
        description: definition.description,
        storyHtml: definition.storyHtml,
        materials: definition.materials,
        heroImageUrl: definition.heroImageUrl,
        galleryImages: definition.galleryImages,
        modelLine: definition.modelLine,
        isDrop: Boolean(definition.isDrop),
        variants: {
          create: sizeRuns.map((size) => {
            const stock = definition.stockBySize?.[size.eu] ?? definition.baseStock;

            return {
              sku: `${definition.skuPrefix}-${size.eu}`,
              sizeEu: toDecimal(size.eu),
              sizeUs: toDecimal(size.us),
              sizeCm: toDecimal(size.cm),
              price: new Prisma.Decimal(definition.price),
              currency: Currency.EUR,
              availabilityState: determineAvailability(stock),
              inventory: {
                create: {
                  qtyOnHand: stock,
                  minThreshold: Math.max(2, Math.floor(stock * 0.15)),
                },
              },
            };
          }),
        },
        drops: dropConfig,
      },
    });
  }
}

async function main() {
  await resetCatalogData();
  await seedProducts();

  const variantCount = sizeRuns.length * productDefinitions.length;
  console.log(
    `Seed concluído: ${productDefinitions.length} produtos e ${variantCount} SKUs.`,
  );
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed Prisma', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
