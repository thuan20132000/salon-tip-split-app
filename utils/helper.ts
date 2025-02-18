import { APIErrorType } from "@/types/api.types";
import dayjs from "dayjs";
import { Alert } from "react-native";

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

const showAlertErrorMessage = (message:APIErrorType ) => {
  Alert.alert('Error', message.message);
}

// get 2 first letters from string then capitalize them
const getInitialsText = (text?: string): string => {
  if(!text) {
    return '';
  }
  const initials = text.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

const percentageToDecimal = (percentage?: number): number => {
  if(!percentage) {
    return 0;
  }
  let decimal = Number(percentage) / 100;

  return Number(decimal.toFixed(2));
}

const decimalToPercentage = (decimal?: number): number => {
  if(!decimal) {
    return 0;
  }
  
  let percentage = Number(decimal) * 100;
  return Number(percentage.toFixed(0));
}

export const helper = {
  handlePercentToDecimal,
  formatCurrency,
  formatDays,
  showAlertErrorMessage,
  getInitialsText,
  percentageToDecimal,
  decimalToPercentage
}