import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ms, mvs } from 'react-native-size-matters'
import { PaymentMethodsEnums } from '@/enums/PaymentEnums'
import { SalonReceipt } from '@/types/receipt.type'
import { SalonPaymentCalculations } from '@/store/useSalonUpdatePaymentStore'
import { Colors } from '@/constants/Colors'

interface PaymentMethodsProps {
  onSelectPaymentMethod: (method: PaymentMethodsEnums, value: number) => void
  paymentReceipt?: SalonReceipt
  debitPayment: number
  cashPayment: number
  loyaltyDiscount: number
  happyHourDiscount: number
  cashGeneralDiscount: number
  debitGeneralDiscount: number
  calculatePayments: () => SalonPaymentCalculations
  cashPaymentPrice: number
  setCashPaymentPrice: (value: number) => void
  debitPaymentPrice: number
  setSelectedSalonReceipt: (value: SalonReceipt) => void,
  subtotal: number
}

const PaymentMethods = ({
  cashPayment,
  debitPayment,
  happyHourDiscount,
  loyaltyDiscount,
  onSelectPaymentMethod,
  paymentReceipt,
  subtotal
}: PaymentMethodsProps) => {

  return (
    <View style={styles.discountsContainer}>
      <ScrollView horizontal
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[
            styles.selectPaymentButton,
            paymentReceipt?.payment_method == PaymentMethodsEnums.NO_TAX && styles.selectedPayment,
          ]}
          onPress={() =>
            onSelectPaymentMethod(PaymentMethodsEnums.NO_TAX, subtotal)
          }
        >
          <View style={styles.discountRow}>
            <Text
              style={[
                styles.paymentMethodTitle,
                paymentReceipt?.payment_method == PaymentMethodsEnums.NO_TAX &&
                { color: Colors.secondary.white }]}
            >
              No Tax
            </Text>
            <Text
              style={[styles.paymentMethodPrice,
                paymentReceipt?.payment_method == PaymentMethodsEnums.NO_TAX &&
                { color: Colors.secondary.white }]}
            >
              ${subtotal?.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectPaymentButton,
            paymentReceipt?.payment_method == PaymentMethodsEnums.DEBIT && styles.selectedPayment,
          ]}
          onPress={() =>
            onSelectPaymentMethod(PaymentMethodsEnums.DEBIT, debitPayment)
          }
        >
          <View style={styles.discountRow}>
            <Text
              style={[
                styles.paymentMethodTitle,
                paymentReceipt?.payment_method == PaymentMethodsEnums.DEBIT &&
                { color: Colors.secondary.white }]}
            >
              Debit (13%)</Text>
            <Text style={[styles.paymentMethodPrice,
                paymentReceipt?.payment_method == PaymentMethodsEnums.DEBIT &&
                { color: Colors.secondary.white }]}
            >${debitPayment?.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectPaymentButton,
            paymentReceipt?.payment_method == PaymentMethodsEnums.CASH && styles.selectedPayment,
          ]}
          onPress={() =>
            onSelectPaymentMethod(PaymentMethodsEnums.CASH, cashPayment)
          }
        >
          <View style={styles.discountRow}>
            <Text style={[styles.paymentMethodTitle,
                paymentReceipt?.payment_method == PaymentMethodsEnums.CASH &&
                { color: Colors.secondary.white }]}
            >Cash (-10%)</Text>
            <Text style={[styles.paymentMethodPrice,
                paymentReceipt?.payment_method == PaymentMethodsEnums.CASH &&
                { color: Colors.secondary.white }]}
            >${cashPayment.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectPaymentButton,
            paymentReceipt?.payment_method == PaymentMethodsEnums.LOYALTY && styles.selectedPayment,
          ]}
          onPress={() =>
            onSelectPaymentMethod(PaymentMethodsEnums.LOYALTY, loyaltyDiscount)
          }
        >
          <View style={styles.discountRow}>
            <Text style={[styles.paymentMethodTitle,
                paymentReceipt?.payment_method == PaymentMethodsEnums.LOYALTY &&
                { color: Colors.secondary.white }]}
            >Loyalty (25%)</Text>
            <Text style={[styles.paymentMethodPrice,
                paymentReceipt?.payment_method == PaymentMethodsEnums.LOYALTY &&
                { color: Colors.secondary.white }]}
            >${loyaltyDiscount.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectPaymentButton,
            paymentReceipt?.payment_method == PaymentMethodsEnums.HAPPY_HOUR && styles.selectedPayment,
          ]}
          onPress={() =>
            onSelectPaymentMethod(PaymentMethodsEnums.HAPPY_HOUR, happyHourDiscount)
          }
        >
          <View style={styles.discountRow}>
            <Text style={styles.paymentMethodTitle} >Happy.H (15%)</Text>
            <Text style={styles.paymentMethodPrice} >${happyHourDiscount.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default PaymentMethods

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  staffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '500',
    width: 100,
  },
  priceInput: {
    // flex: 1,
    // minWidth: 200,
    fontSize: ms(12),
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    paddingVertical: 9,
    paddingHorizontal: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexWrap: 'wrap',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discountsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
  },
  discountTitle: {
    fontSize: ms(12),
    fontWeight: '600',
  },
  selectPaymentButton: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    width: ms(120),
    flex: 1,
    marginRight: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5, // This is for Android shadow
    

  },
  discountRow: {
    alignItems: 'center',
    alignContent: 'space-between',
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',

  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedPayment: {
    backgroundColor: Colors.secondary.blue,
  },
  paymentText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paymentMethodTitle: {
    fontSize: mvs(14),
    fontWeight: 'bold'
  },
  paymentMethodPrice: {
    fontSize: mvs(12),
    fontWeight: 'bold',
    // color: '#007AFF'
  },
  returnPrice: {
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  currencyInput: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    height: 45,
    width: ms(120),
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  isPaymentActive: {
    backgroundColor: '#007AFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

})