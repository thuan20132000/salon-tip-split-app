import { useState, useEffect } from 'react';
import { PaymentRatesEnums, PaymentMethodsEnums } from '../enums/PaymentEnums';
import {
  getSubtotalWithoutDiscountPrice,
  getTotalServicePrice,
  getDebitPayment,
  getCashPayment,
  getSubtotalDiscountPrice
} from '../utils/receiptUtils';
import { PaymentInvoiceDetailType } from '../types/receipt.type';
import { SalonPaymentState } from '@/store/useSalonPaymentStore';

const usePayment = (state: SalonPaymentState) => {
  const [subtotal, setSubtotal] = useState(0);
  const [totalServicePrice, setTotalServicePrice] = useState(0);
  const [debitPayment, setDebitPayment] = useState(0);
  const [cashPayment, setCashPayment] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [happyHourDiscount, setHappyHourDiscount] = useState(0);
  const [cashGeneralDiscount, setCashGeneralDiscount] = useState(0);
  const [debitGeneralDiscount, setDebitGeneralDiscount] = useState(0);
  const [debitPaymentPrice, setDebitPaymentPrice] = useState(0);
  const [returnAmount, setReturnAmount] = useState('0');
  const [isPayable, setIsPayable] = useState(false);
  const [giftcardAmount, setGiftcardAmount] = useState(0);
  const [giftcardPaymentWithCash, setGiftcardPaymentWithCash] = useState(0);
  const [giftcardPaymentWithDebit, setGiftcardPaymentWithDebit] = useState(0);
  const [isGiftcardPayment, setIsGiftcardPayment] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<PaymentInvoiceDetailType | null>(null);

  useEffect(() => {
    const subtotal = getSubtotalWithoutDiscountPrice(state.paymentReceipt?.staffs);
    setSubtotal(subtotal);

    const totalServicePrice = getTotalServicePrice(state.paymentReceipt?.staffs);
    setTotalServicePrice(totalServicePrice);

    const debitPayment = getDebitPayment(subtotal) + getSubtotalDiscountPrice(state.paymentReceipt?.staffs);
    setDebitPayment(debitPayment);

    const cashPayment = getCashPayment(subtotal) + getSubtotalDiscountPrice(state.paymentReceipt?.staffs);
    setCashPayment(cashPayment);

    setLoyaltyDiscount(debitPayment - (debitPayment * PaymentRatesEnums.LOYALTY));
    setHappyHourDiscount(debitPayment - (debitPayment * PaymentRatesEnums.HAPPY_HOUR));
    setCashGeneralDiscount(cashPayment - (cashPayment * PaymentRatesEnums.DISCOUNT));
    setDebitGeneralDiscount(debitPayment - (debitPayment * PaymentRatesEnums.DISCOUNT));

    const debitPaymentPrice = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.COMBINATION_CASH_DEBIT
      ? cashPayment - state.cashPaymentPrice + ((cashPayment - state.cashPaymentPrice) * PaymentRatesEnums.CASH_OFF)
      : 0;
    setDebitPaymentPrice(debitPaymentPrice);

    const returnAmount = (Number(state.receive) - Number(state.paymentReceipt?.selectedPayment?.price)).toFixed(2) || '0';
    setReturnAmount(returnAmount);

    const isPayable = !!state.paymentReceipt?.selectedPayment?.method;
    setIsPayable(isPayable);

    const giftcardAmount = state.paymentReceipt?.giftcardAmount || 0;
    setGiftcardAmount(giftcardAmount);

    const giftcardPaymentWithCash = ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE)) - giftcardAmount) - ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE) - giftcardAmount) * PaymentRatesEnums.CASH_OFF);
    setGiftcardPaymentWithCash(giftcardPaymentWithCash);

    const giftcardPaymentWithDebit = debitPayment - giftcardAmount;
    setGiftcardPaymentWithDebit(giftcardPaymentWithDebit);

    const isGiftcardPayment = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_CASH || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_DEBIT || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD;
    setIsGiftcardPayment(isGiftcardPayment);

    const paymentInvoice: PaymentInvoiceDetailType = {
      payment_method: state.paymentReceipt?.selectedPayment?.method,
      staff_services: state.paymentReceipt?.staffs,
      total_service_amount: totalServicePrice,
      total_tip_amount: state.paymentReceipt?.staffs?.reduce((sum, staff) => sum + staff.tip, 0) || 0
    };
    setPaymentInvoice(paymentInvoice);
  }, [state]);

  return {
    subtotal,
    totalServicePrice,
    debitPayment,
    cashPayment,
    loyaltyDiscount,
    happyHourDiscount,
    cashGeneralDiscount,
    debitGeneralDiscount,
    debitPaymentPrice,
    returnAmount,
    isPayable,
    giftcardAmount,
    giftcardPaymentWithCash,
    giftcardPaymentWithDebit,
    isGiftcardPayment,
    paymentInvoice
  };
};

export default usePayment;