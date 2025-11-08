export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OutOfStockError extends DomainError {
  constructor(public readonly variantId: string) {
    super(`Variant ${variantId} is out of stock`, 409);
  }
}

export class VariantUnavailableError extends DomainError {
  constructor(public readonly variantId: string) {
    super(`Variant ${variantId} not found`, 404);
  }
}

export class IdempotencyConflictError extends DomainError {
  constructor() {
    super('Duplicate checkout request', 409);
  }
}
