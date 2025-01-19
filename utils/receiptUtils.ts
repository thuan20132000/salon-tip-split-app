// utils/receiptUtils.ts
import { PaymentDiscountRateEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';
import { Receipt, GroupedReceipts, FirebaseTimestamp } from '../types/receipt';
import { SalonStaffPriceType } from '@/types/receipt.type';
import dayjs from 'dayjs';

export const formatCurrency = (amount?: number): string => {
  if (!amount) {
    amount = 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (timestamp?: string): string => {
  if (!timestamp) {
    return '';
  }
  const date = dayjs(timestamp).format('MMM DD, YYYY');
  return date;
};

export const formatDateTime = (timestamp?: string): string => {
  if (!timestamp) {
    return '';
  }

  const dt = dayjs(timestamp).format('MMM DD, YYYY hh:mm A');
  return dt;

}

export const formatTime = (timestamp: FirebaseTimestamp): string => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const groupReceiptsByDate = (receipts: Receipt[]): GroupedReceipts[] => {
  return [];
  // const grouped = receipts.reduce((acc: { [key: string]: Receipt[] }, receipt) => {
  //   const date = formatDate(receipt.createdAt);
  //   if (!acc[date]) {
  //     acc[date] = [];
  //   }
  //   acc[date].push(receipt);
  //   return acc;
  // }, {});

  // return Object.entries(grouped).map(([title, data]) => ({
  //   title,
  //   data: data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  // }));
};

export const getDebitPayment = (amount: number): number => {
  let tax = amount * PaymentRatesEnums.TAX_RATE;
  let debitPayment = amount + tax;
  return debitPayment;
}

export const getCashPayment = (amount: number): number => {
  let cashPayment = getDebitPayment(amount) - (getDebitPayment(amount) * PaymentRatesEnums.CASH_OFF);
  return cashPayment;
}

export const getSubtotalDiscountPrice = (staffBills?: SalonStaffPriceType[]): number => {
  if (!staffBills) {
    return 0;
  }
  let subtotalDiscountPrice = staffBills?.reduce((sum, staff) => sum + staff.discount_price, 0);
  return subtotalDiscountPrice;
}

export const getSubtotalWithoutDiscountPrice = (staffBills?: SalonStaffPriceType[]): number => {
  if (!staffBills) {
    return 0;
  }
  let subtotalWithoutDiscountPrice = staffBills?.reduce((sum, staff) => {
    if (staff.discount_price) {
      return sum + 0;
    }
    return sum + staff.price;
  }, 0);
  return subtotalWithoutDiscountPrice;
}

export const handleDiscountPrice = (servicePrice: number, discountRate: PaymentDiscountRateEnums): number => {
  let discountPrice = getDebitPayment(servicePrice) - getDebitPayment(servicePrice * discountRate);
  return discountPrice;
}

export const getTotalServicePrice = (staffBills?: SalonStaffPriceType[]): number => {
  if (!staffBills) {
    return 0;
  }
  let totalServicePrice = staffBills?.reduce((sum, staff) => sum + staff.price, 0);
  return totalServicePrice;
}

export const handleNumberToPercent = (number: number): string => {
  let percent = number * 100;
  return percent.toFixed(0) + '%';
}

export const formatPercentage = (number?: number): string => {
  if (!number) {
    return '';
  }
  return number.toFixed(0) + '%';
}

