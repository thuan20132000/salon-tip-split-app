// utils/receiptUtils.ts
import { Receipt, GroupedReceipts, FirebaseTimestamp } from '../types/receipt';

export const formatCurrency = (amount?: number): string => {
  if(!amount) {
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
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (timestamp?: string): string => {
  if(!timestamp) {
    return '';
  }
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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