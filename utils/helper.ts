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

export const helper = {
  handlePercentToDecimal,
  formatCurrency,
  formatDays,
  showAlertErrorMessage
}