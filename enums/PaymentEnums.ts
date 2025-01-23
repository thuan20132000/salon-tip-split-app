export enum PaymentMethodsEnums {
  NO_TAX = 'no_tax',
  DEBIT = 'debit',
  CASH = 'cash',
  DISC_5_PERCENT_CASH = 'disc_5_percent_cash',
  DISC_5_PERCENT_DEBIT = 'disc_5_percent_debit',
  LOYALTY = 'loyalty',
  HAPPY_HOUR = 'happy_hour',
  COMBINATION_CASH_DEBIT = 'combination_cash_debit',
  GIFT_CARD = 'gift_card',
  GIFT_CARD_CASH = 'gift_card_cash',
  GIFT_CARD_DEBIT = 'gift_card_debit',
}

export enum PaymentRatesEnums {
  TAX_RATE = 0.13,
  CASH_OFF = 0.10,
  HAPPY_HOUR = 0.15,
  LOYALTY = 0.25,
  DISCOUNT = 0.05,
}

export enum PaymentReceiptStatusEnums {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentDiscountRateEnums {
  DISC_5_PERCENT = 0.05,
  DISC_10_PERCENT = 0.10,
  DISC_15_PERCENT = 0.15,
  DISC_20_PERCENT = 0.20,
  DISC_25_PERCENT = 0.25,
  DISC_30_PERCENT = 0.30,
  DISC_0_PERCENT = 0,
}


