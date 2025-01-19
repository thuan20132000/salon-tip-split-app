import dayjs from "dayjs";

const handlePercentToDecimal = (percent?: number): number => {
  if(!percent) {
    return 0;
  }
  
  return Number((percent / 100).toFixed(2));
}

const formatCurrency = (amount: number): string => {
  if(!amount) {
    return '';
  }
  return `$${amount.toFixed(2)}`;
};

const formatDays = (timestamp?: string): string => {
  if (!timestamp) {
    return '';
  }
  const dt = dayjs(timestamp).format("dddd, DD MMM, YYYY");
  return dt;
}

export const helper = {
  handlePercentToDecimal,
  formatCurrency,
  formatDays
}