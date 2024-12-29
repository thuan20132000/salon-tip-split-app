// components/GiftcardPaymentInput.tsx
import { PaymentMethodsEnums } from '@/enums/PaymentEnums';
import { PaymentState, usePaymentStore } from '@/store/usePaymentStore';
import { formatCurrency } from '@/utils/receiptUtils';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';

interface GiftcardPaymentInputProps {
  onSelectPaymentMethod: (method: string, price: number) => void;
}

export const GiftcardPaymentInput: React.FC<GiftcardPaymentInputProps> = ({ onSelectPaymentMethod }) => {

  const {
    setPaymentReceipt,
    paymentReceipt,
    calculatePayments
  } = usePaymentStore((state: PaymentState) => state);

  const onChangeGiftcardAmount = (value: number) => {
    // setGiftcardAmount(value);
    setPaymentReceipt({
      ...paymentReceipt,
      giftcardAmount: value || 0,
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gift Card Payment</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gift Card Amount ($)</Text>
        <CurrencyInput
          style={styles.input}
          value={paymentReceipt?.giftcardAmount || 0}
          onChangeValue={(value) => onChangeGiftcardAmount(Number(value))}
          prefix="$"
          keyboardType="decimal-pad"
          placeholder="Enter gift card amount"
        />
      </View>

      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_CASH && styles.selectedMethod
          ]}
          onPress={() => {
            onSelectPaymentMethod(
              PaymentMethodsEnums.GIFT_CARD_CASH,
              calculatePayments().giftcardPaymentWithCash
            )
          }
          }
        >
          <Text style={[
            styles.methodText,
          ]}>Cash {formatCurrency(calculatePayments().giftcardPaymentWithCash)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_DEBIT && styles.selectedMethod
          ]}
          onPress={() => {
            onSelectPaymentMethod(
              PaymentMethodsEnums.GIFT_CARD_DEBIT,
              calculatePayments().giftcardPaymentWithDebit
            )
          }}
        >
          <Text style={[
            styles.methodText,
          ]}>Debit {formatCurrency(calculatePayments().giftcardPaymentWithDebit)}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedMethod: {
    backgroundColor: '#ffd33d',
  },
  methodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedMethodText: {
    color: '#fff',
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  changeLabel: {
    fontSize: 16,
    color: '#333',
  },
  changeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  processButton: {
    backgroundColor: '',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});