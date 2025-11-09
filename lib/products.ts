import { AvailabilityState, Currency, ModelLine, Prisma, ProductStatus } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type ProductMode = 'showroom' | 'drop' | 'collector';

const inventorySelect = Prisma.validator<Prisma.InventorySelect>()({
  qtyOnHand: true,
  qtyReserved: true,
});

const variantSelect = Prisma.validator<Prisma.VariantSelect>()({
  id: true,
  sku: true,
  sizeEu: true,
  sizeUs: true,
  sizeCm: true,
  price: true,
  currency: true,
  availabilityState: true,
  inventory: { select: inventorySelect },
});

const dropSelect = Prisma.validator<Prisma.DropSelect>()({
  id: true,
  startAt: true,
  endAt: true,
  queueEnabled: true,
  perCustomerLimit: true,
  reserveMinutes: true,
  captchaRequired: true,
});

const productSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  name: true,
  brand: true,
  modelLine: true,
  colorway: true,
  description: true,
  storyHtml: true,
  materials: true,
  heroImageUrl: true,
  galleryImages: true,
  status: true,
  isDrop: true,
  createdAt: true,
  updatedAt: true,
  variants: { select: variantSelect, orderBy: { sizeEu: 'asc' } },
  drops: {
    select: dropSelect,
    orderBy: { startAt: 'desc' },
    take: 3,
  },
});

export type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

export type ProductResponse = {
  id: string;
  name: string;
  brand: string;
  modelLine: ModelLine;
  colorway: string;
  description: string | null;
  storyHtml: string | null;
  materials: string | null;
  heroImageUrl: string | null;
  galleryImages: string[];
  status: ProductStatus;
  isDrop: boolean;
  priceRange: { min: number; max: number };
  variants: Array<{
    id: string;
    sku: string;
    sizeEu: number | null;
    sizeUs: number | null;
    sizeCm: number | null;
    price: number;
    currency: Currency;
    availabilityState: AvailabilityState;
    qtyAvailable: number;
  }>;
  sizeHeatmap: Record<
    string,
    {
      availability: AvailabilityState;
      qtyAvailable: number;
    }
  >;
  activeDrop?: {
    id: string;
    startAt: string;
    endAt: string | null;
    queueEnabled: boolean;
    perCustomerLimit: number;
    reserveMinutes: number;
    captchaRequired: boolean;
  };
};

const collectorLines = [ModelLine.AJ1, ModelLine.AJ3, ModelLine.AJ4, ModelLine.AJ11];

const decimalToNumber = (value?: Prisma.Decimal | null) =>
  typeof value === 'undefined' || value === null ? null : Number(value);

const calculateQtyAvailable = (inventory?: { qtyOnHand: number; qtyReserved: number } | null) =>
  Math.max(0, (inventory?.qtyOnHand ?? 0) - (inventory?.qtyReserved ?? 0));

const serializeProduct = (record: ProductRecord): ProductResponse => {
  const variants = record.variants.map((variant) => {
    const qtyAvailable = calculateQtyAvailable(variant.inventory);
    return {
      id: variant.id,
      sku: variant.sku,
      sizeEu: decimalToNumber(variant.sizeEu),
      sizeUs: decimalToNumber(variant.sizeUs),
      sizeCm: decimalToNumber(variant.sizeCm),
      price: Number(variant.price),
      currency: variant.currency,
      availabilityState: variant.availabilityState,
      qtyAvailable,
    };
  });

  const prices = variants.map((variant) => variant.price);
  const priceRange = {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };

  const sizeHeatmap = variants.reduce<ProductResponse['sizeHeatmap']>((acc, variant) => {
    if (!variant.sizeEu) {
      return acc;
    }

    const key = variant.sizeEu.toFixed(1);
    acc[key] = {
      availability: variant.availabilityState,
      qtyAvailable: variant.qtyAvailable,
    };
    return acc;
  }, {});

  const galleryImagesArray = Array.isArray(record.galleryImages)
    ? (record.galleryImages as string[])
    : [];
  const normalizedGalleryImages = galleryImagesArray.length
    ? galleryImagesArray
    : record.heroImageUrl
    ? [record.heroImageUrl]
    : [];

  const now = new Date();
  const activeDrop = record.drops.find((drop) => drop.startAt <= now && (!drop.endAt || drop.endAt >= now));

  return {
    id: record.id,
    name: record.name,
    brand: record.brand,
    modelLine: record.modelLine,
    colorway: record.colorway,
    description: record.description,
    storyHtml: record.storyHtml,
    materials: record.materials,
    heroImageUrl: record.heroImageUrl,
    galleryImages: normalizedGalleryImages,
    status: record.status,
    isDrop: record.isDrop,
    priceRange,
    variants,
    sizeHeatmap,
    activeDrop: activeDrop
      ? {
          id: activeDrop.id,
          startAt: activeDrop.startAt.toISOString(),
          endAt: activeDrop.endAt ? activeDrop.endAt.toISOString() : null,
          queueEnabled: activeDrop.queueEnabled,
          perCustomerLimit: activeDrop.perCustomerLimit,
          reserveMinutes: activeDrop.reserveMinutes,
          captchaRequired: activeDrop.captchaRequired,
        }
      : undefined,
  };
};

const buildModeFilter = (mode?: ProductMode): Prisma.ProductWhereInput => {
  if (!mode) {
    return { status: ProductStatus.ACTIVE };
  }

  if (mode === 'showroom') {
    return {
      status: ProductStatus.ACTIVE,
      isDrop: false,
    };
  }

  if (mode === 'drop') {
    return {
      status: ProductStatus.ACTIVE,
      isDrop: true,
    };
  }

  // collector mode enfatiza linhas chave
  return {
    status: ProductStatus.ACTIVE,
    modelLine: { in: collectorLines },
  };
};

export async function fetchProducts(params: {
  limit: number;
  cursor?: string;
  mode?: ProductMode;
  search?: string;
  modelLine?: ModelLine;
}): Promise<{
  data: ProductResponse[];
  pageInfo: { hasNextPage: boolean; nextCursor?: string };
}> {
  const { limit, cursor, mode, search, modelLine } = params;

  const where: Prisma.ProductWhereInput = {
    AND: [
      buildModeFilter(mode),
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { colorway: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      modelLine ? { modelLine } : {},
    ],
  };

  const products = await prisma.product.findMany({
    where,
    select: productSelect,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: [
      { isDrop: 'desc' },
      { updatedAt: 'desc' },
    ],
  });

  const hasNextPage = products.length > limit;
  const items = hasNextPage ? products.slice(0, -1) : products;

  return {
    data: items.map(serializeProduct),
    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage ? items.at(-1)?.id : undefined,
    },
  };
}

export async function fetchProductById(id: string): Promise<ProductResponse | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) {
    return null;
  }

  return serializeProduct(product);
}
