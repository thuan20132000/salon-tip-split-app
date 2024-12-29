
// import { CurrencyInput } from '@/components/CurrencyInput';
import CurrencyInput from 'react-native-currency-input';

// screens/TipSplitScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { router, useLocalSearchParams } from 'expo-router';
import { StaffState, StaffType, useStaffStore } from '@/store/useStaffStore';
import { PaymentMethodsEnums, PaymentRatesEnums, PaymentReceiptStatusEnums } from '@/enums/PaymentEnums';
import { PaymentReceiptType, PaymentState, StaffPriceType, usePaymentStore } from '@/store/usePaymentStore';
import { FirestoreService } from '@/services/firestore.service';
import { GiftcardPaymentInput } from '@/components/GiftcardPaymentInput';

const TAX_RATE = PaymentRatesEnums.TAX_RATE;
const CASH_OFF = PaymentRatesEnums.CASH_OFF;
const HAPPY_HOUR = PaymentRatesEnums.HAPPY_HOUR;
const LOYALTY = PaymentRatesEnums.LOYALTY;
const DISCOUNT = PaymentRatesEnums.DISCOUNT;



export default function StaffPaymentScreen() {
  const { staff_ids, payment_receipt } = useLocalSearchParams();

  const {
    staffList,
    resetSelectedPaymentStaffs
  } = useStaffStore((state: StaffState) => state);

  console.log('payment receipt:', payment_receipt);



  const {
    receive,
    tipPrice,
    selectedStaffs,
    selectedPayment,
    cashPaymentPrice,
    setSelectedStaffs,
    updateStaffPrice,
    setReceive,
    setTipPrice,
    setCashPaymentPrice,
    selectPaymentMethod,
    calculatePayments,
    setSelectedPayment,
    resetPayment,
    paymentReceipt,
    setPaymentReceipt,
    isLoading
  } = usePaymentStore((state: PaymentState) => state);



  const handleInitialStaffPrice = () => {
    if (payment_receipt) {
      let receipt: PaymentReceiptType = typeof payment_receipt === 'string' ? JSON.parse(payment_receipt) : payment_receipt;
      setPaymentReceipt(receipt);
      // setSelectedStaffs(selectedStaffPriceList);
    } else {


      let selectedStaffList = staffList.filter((staff) => {
        return staff_ids.includes(String(staff.id));
      });

      const selectedStaffPriceList: StaffPriceType[] = selectedStaffList.map((staff) => {
        return {
          price: 0,
          tip: 0,
          staff: staff
        }
      })

      setPaymentReceipt({
        subtotal: 0,
        returnAmount: 0,
        tip: 0,
        selectedPayment: { method: '', price: 0 },
        staffs: selectedStaffPriceList,
        status: PaymentReceiptStatusEnums.PENDING,
      })
      // setSelectedStaffs(selectedStaffPriceList);


    }
  }





  const onSelectPaymentMethod = (method: string, price: number) => {
    let receiveFormatted = price.toString();
    receiveFormatted = new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    // setSelectedPayment({ method, price });
    // setReceive(Number(receiveFormatted));
    // setCashPaymentPrice(0);

    let newPaymentReceipt = {
      ...paymentReceipt,
      selectedPayment: { method, price },
      receive: Number(receiveFormatted),
      cashPaymentPrice: 0
    }

    setPaymentReceipt(newPaymentReceipt);
    setReceive(Number(receiveFormatted));
  }

  const updateSelectedStaffPrice = (index: number, price: number | null) => {
    const newStaffPrices = [...selectedStaffs];
    newStaffPrices[index] = { ...newStaffPrices[index], price: Number(price) };
    setSelectedStaffs(newStaffPrices);
    setSelectedPayment(undefined);
    setReceive(0);
  }

  const updateReceiptStaffPrice = (index: number, price: number | null) => {
    let newStaffPrices = [...paymentReceipt?.staffs || []];

    newStaffPrices[index] = { ...newStaffPrices[index], price: Number(price) };
    let newPaymentReceipt: PaymentReceiptType = {
      ...paymentReceipt,
      staffs: newStaffPrices
    }
    console.log('====================================');
    console.log('newPaymentReceipt:', newPaymentReceipt);
    console.log('====================================');
    setPaymentReceipt(newPaymentReceipt);
  }



  const onPaymentPress = async () => {


    try {

      const receipt: PaymentReceiptType = {
        ...paymentReceipt,
        subtotal: calculatePayments().subtotal,
        returnAmount: Number(calculatePayments().returnAmount.toFixed(2)),
        tip: tipPrice,
        // selectedPayment: selectedPayment || { method: '', price: 0 },
        status: PaymentReceiptStatusEnums.PAID,
      }

      console.log('Receipt:', receipt);
      if (receipt.id) {
        let res = await FirestoreService.updateDocument<PaymentReceiptType>('payments', receipt.id, receipt);
        console.log('Payment updated:', res);
      } else {
        let res = await FirestoreService.createDocument<PaymentReceiptType>('payments', receipt);
        console.log('Payment created:', res);

      }

      Alert.alert('Payment Success', 'Payment has been successfully processed');


    } catch (err) {
      console.error('Error adding todo:', err);
    } finally {
      resetSelectedPaymentStaffs();
      router.back();
    }

  }

  const onSavePaymentReceipt = async () => {
    try {
      let receipt: PaymentReceiptType = {
        ...paymentReceipt,
        subtotal: calculatePayments().subtotal,
        returnAmount: Number(calculatePayments().returnAmount.toFixed(2)),
        tip: tipPrice,
        status: PaymentReceiptStatusEnums.PENDING,
        selectedPayment: selectedPayment || { method: '', price: 0 },

      }
      if (receipt.id) {
        let res = await FirestoreService.updateDocument<PaymentReceiptType>('payments', receipt.id, receipt);
        console.log('Payment updated:', res);
      } else {
        let res = await FirestoreService.createDocument<PaymentReceiptType>('payments', receipt);
        console.log('Payment saved:', res);
      }
    } catch (err) {
      console.error('Error save payment:', err);
    } finally {
      resetSelectedPaymentStaffs();
      router.back();
    }
  }

  const {
    loyaltyDiscount,
    happyHourDiscount,
    subtotal,
    debitPayment,
    cashPayment,
    cashGeneralDiscount,
    debitGeneralDiscount,
    returnAmount,
    isPayable,
    debitPaymentPrice
  } = calculatePayments();


  useEffect(() => {
    handleInitialStaffPrice()

    return () => {
      resetPayment();
      resetSelectedPaymentStaffs();
    }
  }, [])

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (

    <>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}>

        {/* Staff Price Inputs */}
        <View style={styles.section}>
          <View style={styles.staffRow}>
            <Text style={{}}>Name</Text>
            <Text style={{}}>Price</Text>
            <Text style={{}}>Tip</Text>
          </View>
          {/* Staff  Price Input */}
          {paymentReceipt?.staffs?.map((staff, index) => (
            <View key={index} style={styles.staffRow}>
              <Text style={styles.staffName}>{staff.staff.name}</Text>
              <CurrencyInput
                value={staff.price}
                onChangeValue={(value) => updateReceiptStaffPrice(index, value)}
                prefix="$ "
                delimiter="."
                separator="."
                precision={2}
                minValue={0}
                showPositiveSign={false}
                onChangeText={(formattedValue) => {
                  console.log(formattedValue); // R$ +2.310,46
                }}
                style={styles.priceInput}
              />
              <CurrencyInput
                value={staff.tip}
                onChangeValue={(value) => {
                  const newStaffPrices = [...selectedStaffs];
                  newStaffPrices[index] = { ...newStaffPrices[index], tip: value ?? 0 };
                  setSelectedStaffs(newStaffPrices);
                }}
                prefix="$ "
                delimiter="."
                separator="."
                precision={2}
                minValue={0}
                showPositiveSign={false}
                onChangeText={(formattedValue) => {
                  console.log(formattedValue); // R$ +2.310,46
                }}
                style={styles.priceInput}
              />
            </View>
          ))}


        </View>

        {/* Totals Section */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text>SUB TOTAL ($)</Text>
            <Text style={styles.totalAmount}>${subtotal.toFixed(2)}</Text>
          </View>

          {/* Payment Methods */}
          <Text style={styles.discountTitle}>Payment Methods</Text>

          <View style={styles.discountsContainer}>
            <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.DEBIT && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.DEBIT, debitPayment)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Debit (13%)</Text>
                  <Text style={styles.paymentMethodPrice} >${debitPayment.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.CASH && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.CASH, cashPayment)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Cash (-10%)</Text>
                  <Text style={styles.paymentMethodPrice} >${cashPayment.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.LOYALTY && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.LOYALTY, loyaltyDiscount)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Disc.(25%)</Text>
                  <Text style={styles.paymentMethodPrice} >${loyaltyDiscount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.HAPPY_HOUR && styles.selectedPayment,
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
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.DISC_5_PERCENT_CASH && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.DISC_5_PERCENT_CASH, cashGeneralDiscount)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Disc.(5%) - Cash</Text>
                  <Text style={styles.paymentMethodPrice} >${cashGeneralDiscount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.DISC_5_PERCENT_DEBIT && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.DISC_5_PERCENT_DEBIT, debitGeneralDiscount)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Disc.(5%) - Debit</Text>
                  <Text style={styles.paymentMethodPrice} >${debitGeneralDiscount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.COMBINATION_CASH_DEBIT && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.COMBINATION_CASH_DEBIT, 0)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Com. Cash + Debit</Text>
                </View>
              </TouchableOpacity>

              {/* Gift card */}
              <TouchableOpacity
                style={[
                  styles.selectPaymentButton,
                  calculatePayments().isGiftcardPayment && styles.selectedPayment,
                ]}
                onPress={() =>
                  onSelectPaymentMethod(PaymentMethodsEnums.GIFT_CARD, 0)
                }
              >
                <View style={styles.discountRow}>
                  <Text style={styles.paymentMethodTitle} >Gift card</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Pay combination of cash and debit */}
          {
            paymentReceipt?.selectedPayment?.method == PaymentMethodsEnums.COMBINATION_CASH_DEBIT && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.discountTitle}>Pay Cash: </Text>
                  <CurrencyInput
                    value={cashPaymentPrice}
                    onChangeValue={(value) => {
                      setCashPaymentPrice(value ?? 0);
                    }}
                    prefix="$ "
                    delimiter="."
                    separator="."
                    precision={2}
                    minValue={0}
                    showPositiveSign={false}
                    onChangeText={(formattedValue) => {
                      console.log(formattedValue); // R$ +2.310,46
                    }}
                    style={styles.currencyInput}

                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.discountTitle}>Pay Debit: </Text>
                  <CurrencyInput
                    value={debitPaymentPrice}
                    prefix="$ "
                    delimiter="."
                    separator="."
                    precision={2}
                    minValue={0}
                    showPositiveSign={false}
                    style={styles.currencyInput}
                    editable={false}
                  />
                </View>
                <View>
                  <Text style={styles.discountTitle}>Total</Text>
                  <Text style={styles.returnPrice}>${(cashPaymentPrice + debitPaymentPrice).toFixed(2)}</Text>
                </View>
              </View>
            )
          }

          {/* Gift card payment */}
          {
            calculatePayments().isGiftcardPayment &&
            <GiftcardPaymentInput
              onSelectPaymentMethod={onSelectPaymentMethod}
            />

          }

          {/* Receive Input & Return View */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.discountTitle}>Receive</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <CurrencyInput
                  value={receive}
                  onChangeValue={(value) => setReceive(value ?? 0)}
                  prefix="$ "
                  delimiter="."
                  separator="."
                  precision={2}
                  minValue={0}
                  showPositiveSign={false}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // R$ +2.310,46
                  }}
                  style={styles.currencyInput}
                  onFocus={() => setReceive(0)}

                />
              </View>
            </View>
            <View>
              <Text style={styles.discountTitle}>Return</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.returnPrice}>${(returnAmount).toFixed(2)}</Text>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => {
                    setTipPrice(returnAmount);
                  }}
                >
                  <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: 'bold' }}>Add to Tip</Text>
                </TouchableOpacity>

              </View>
            </View>
            <View>
              <Text style={styles.discountTitle}>Tip</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <CurrencyInput
                  value={tipPrice}
                  onChangeValue={(value) => setTipPrice(value ?? 0)}
                  prefix="$ "
                  delimiter="."
                  separator="."
                  precision={2}
                  minValue={0}
                  showPositiveSign={false}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // R$ +2.310,46
                  }}
                  style={styles.currencyInput}
                  onFocus={() => setTipPrice(0)}
                />

              </View>
            </View>
          </View>
          {/* Payment Method */}
          <View style={styles.paymentSection}>

            <TouchableOpacity
              style={[
                styles.paymentButton,
                isPayable && styles.isPaymentActive,
              ]}
              disabled={isPayable ? false : true}
              onPress={onSavePaymentReceipt}
            >
              <Text style={[
                styles.paymentText,
                isPayable && { color: '#fff' }
              ]}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentButton,
                isPayable && styles.isPaymentActive,
                { flex: 2, }
              ]}
              disabled={isPayable ? false : true}
              onPress={onPaymentPress}
            >
              <Text style={[
                styles.paymentText,
                isPayable && { color: '#fff' }
              ]}>Pay</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>
    </>

  );
}

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
  },
  staffName: {
    fontSize: 16,
    fontWeight: '500',
    width: 100,
  },
  priceInput: {
    // flex: 1,
    minWidth: 200,
    fontSize: 22,
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
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discountsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectPaymentButton: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    width: 180,
    height: '100%',
    flex: 1,
    marginRight: 8,

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
    backgroundColor: '#ffd33d',
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  paymentMethodPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    // color: '#007AFF'
  },
  returnPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  currencyInput: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    height: 45,
    width: 180,
    fontSize: 16,
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
});