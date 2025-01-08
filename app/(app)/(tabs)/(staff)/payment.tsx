
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
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums, PaymentReceiptStatusEnums } from '@/enums/PaymentEnums';

import { GiftcardPaymentInput } from '@/components/GiftcardPaymentInput';
import { SalonStaffState, useSalonStaffStore } from '@/store/useSalonStaffStore';
import { SalonPaymentReceiptType, SalonPaymentState, useSalonPaymentStore } from '@/store/useSalonPaymentStore';
import { CreateSalonReceiptType, SalonReceipt, SalonStaffPriceType } from '@/types/receipt.type';
import { receiptAPIs } from '@/api/receiptAPI';
import { formatCurrency, handleDiscountPrice, handleNumberToPercent } from '@/utils/receiptUtils';
import SelectDiscountModal from '@/components/SelectDiscountModal';
import ConfirmReceiptModal from '@/components/CofirmReceiptModal';
import { Ionicons } from '@expo/vector-icons';
import ButtonIcon from '@/components/commons/ButtonIcon';
import ButtonText from '@/components/commons/ButtonText';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import CustomDateTimePicker from '@/components/DateTimePicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';


export default function StaffPaymentScreen() {
  const { staff_ids, payment_receipt } = useLocalSearchParams();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [isShowDatetimePicker, setIsShowDateTimePicker] = useState<boolean>(false);
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date | null>(new Date());
  // const {
  //   salonStaffs,
  // } = useSalonStaffStore((state: SalonStaffState) => state);

  const {
    salonStaffs,
    selectedSalon,
  } = useSalonStore((state: SalonState) => state);



  const {
    receive,
    tipPrice,
    cashPaymentPrice,
    setReceive,
    setTipPrice,
    setCashPaymentPrice,
    calculatePayments,
    resetPayment,
    paymentReceipt,
    setPaymentReceipt,
    isLoading,
    addStaffBillDiscount,
    resetSelectedPaymentStaffs
  } = useSalonPaymentStore((state: SalonPaymentState) => state);



  const handleInitialStaffPrice = () => {
    console.log('Payment receipt:', payment_receipt);

    if (payment_receipt) {
      let receipt: SalonPaymentReceiptType = typeof payment_receipt === 'string' ? JSON.parse(payment_receipt) : payment_receipt;
      setPaymentReceipt(receipt);
      // setSelectedStaffs(selectedStaffPriceList);
    } else {

      let staff_ids_list = JSON.parse(String(staff_ids));
      let selectedStaffList = salonStaffs?.filter((staff) => {
        return staff_ids_list.includes(Number(staff.id));
      });

      if (!selectedStaffList) {
        selectedStaffList = [];
      }

      let selectedStaffPriceList: SalonStaffPriceType[] = selectedStaffList.map((staff) => {
        let discountPrice = 0;
        // if (staff.id == 1) {
        //   discountPrice = handleDiscountPrice(39, HAPPY_HOUR);
        // }

        return {
          price: 0,
          tip: 0,
          staff: staff,
          discount_price: discountPrice,
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

  const updateReceiptStaffPrice = (index: number, price: number | null) => {
    let newStaffPrices = [...paymentReceipt?.staffs || []];

    newStaffPrices[index] = { ...newStaffPrices[index], price: Number(price) };
    let newPaymentReceipt: SalonPaymentReceiptType = {
      ...paymentReceipt,
      staffs: newStaffPrices
    }

    setPaymentReceipt(newPaymentReceipt);
  }

  const updateReceiptStaffTip = (index: number, tip: number | null) => {
    let newStaffPrices = [...paymentReceipt?.staffs || []];
    newStaffPrices[index] = { ...newStaffPrices[index], tip: Number(tip) };
    let newPaymentReceipt: SalonPaymentReceiptType = {
      ...paymentReceipt,
      staffs: newStaffPrices
    }
    setPaymentReceipt(newPaymentReceipt);
  }

  const onCompletePaymentPress = async (paymentStatus?: PaymentReceiptStatusEnums) => {
    try {

      let salonReceipt: CreateSalonReceiptType = {
        payment_method: paymentReceipt?.selectedPayment?.method || '',
        payment_method_price: Number(paymentReceipt?.selectedPayment?.price?.toFixed(2)) || 0,
        return_amount: Number(calculatePayments().returnAmount),
        tip_total_amount: tipPrice,
        sub_total_amount: calculatePayments().paymentInvoice.total_service_amount,
        payment_status: paymentStatus || PaymentReceiptStatusEnums.PENDING,
        salon: selectedSalon?.id,
        staff_receipts: calculatePayments().paymentInvoice.staff_services?.map((staff) => {
          return {
            service_amount: staff.price,
            tip_amount: staff.tip,
            staff: Number(staff.staff.id),
            service_name: 'Service Name',
            status: true,
            discount_percent: staff.discount_percent,
            discount_price: staff.discount_price,
            created_at: dayjs(selectedPaymentDate).format(),
            updated_at: dayjs(selectedPaymentDate).format(),
          }
        },
        ) || [],
        created_at: dayjs(selectedPaymentDate).format(),
        updated_at: dayjs(selectedPaymentDate).format(),
      }

      console.log('Salon Receipt:', salonReceipt);
      

      await receiptAPIs.createSalonReceipt(salonReceipt);


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
    debitPaymentPrice,
    paymentInvoice
  } = calculatePayments();


  const [selectedStaffDiscount, setSelectedStaffDiscount] = useState<SalonStaffPriceType | null>(null);
  const [isShowDiscountModal, setIsShowDiscountModal] = useState<boolean>(false);

  const onSelectStaffDiscount = (staff: SalonStaffPriceType) => {
    setSelectedStaffDiscount(staff);
    setIsShowDiscountModal(true);
  }

  const onSelectDiscount = (discount: PaymentDiscountRateEnums) => {
    if (selectedStaffDiscount) {
      addStaffBillDiscount(selectedStaffDiscount, discount);
    }
    setIsShowDiscountModal(false);
  }

  const hideDiscountModal = () => {
    setIsShowDiscountModal(false);
  }


  const hideDatePicker = () => {
    setIsShowDateTimePicker(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    setSelectedPaymentDate(date);
    hideDatePicker();
  };

  const renderDiscountButton = (staff: SalonStaffPriceType) => {
    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => onSelectStaffDiscount(staff)}
      >
        <Ionicons
          name="gift-outline"
          size={24}
          color="#007AFF"
          style={{ marginLeft: 8 }}
        />
        {
          staff.discount_price > 0 && (
            <Text>({handleNumberToPercent(Number(staff.discount_percent))}) {formatCurrency(staff.discount_price)}</Text>
          )
        }
      </TouchableOpacity>
    )
  }


  useEffect(() => {
    handleInitialStaffPrice()

    return () => {
      resetPayment();
      // resetSelectedPaymentStaffs();
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
            <Text style={{}}>Service Price</Text>
            <Text style={{}}>Price</Text>
            <Text style={{}}>Tip</Text>
          </View>
          {/* Staff  Price Input */}
          {paymentReceipt?.staffs?.map((staff, index) => (
            <View key={index} style={styles.staffRow}>
              <Text style={styles.staffName}>{staff.staff.first_name}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
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
                {
                  renderDiscountButton(staff)
                }
              </View>
              <CurrencyInput
                value={staff.tip}
                onChangeValue={(value) => updateReceiptStaffTip(index, value)}
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
            <Text style={styles.totalAmount}>{formatCurrency(paymentInvoice.total_service_amount)}</Text>
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
                  <Text style={styles.paymentMethodPrice} >${debitPayment?.toFixed(2)}</Text>
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
              giftcardAmount={Number(paymentReceipt?.giftcardAmount)}
              onChangeGiftcardAmount={(value) => {
                let newPaymentReceipt = {
                  ...paymentReceipt,
                  giftcardAmount: value
                }
                setPaymentReceipt(newPaymentReceipt);
              }}

              cashPayment={calculatePayments().giftcardPaymentWithCash}
              debitPayment={calculatePayments().giftcardPaymentWithDebit}
              paymentMethod={paymentReceipt?.selectedPayment?.method as PaymentMethodsEnums}
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
                <Text style={styles.returnPrice}>${(returnAmount)}</Text>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => {
                    setTipPrice(Number(returnAmount));
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
          <View>

            <ButtonIcon
              title={selectedPaymentDate ? selectedPaymentDate.toDateString() : 'Select Payment Date'}
              iconName="calendar"
              onPress={() => setIsShowDateTimePicker(true)}
              containerStyle={{
                // flex: 1,
                backgroundColor: '#f8f9fa',
                alignSelf: 'flex-start',
                marginBottom: 16,
              }}
            />
            <DateTimePickerModal
              isVisible={isShowDatetimePicker}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              display='inline'
              
            />
          </View>
          {/* Payment Method */}
          <View style={styles.paymentSection}>


            <ButtonText
              title="Complete Payment"
              onPress={() => onCompletePaymentPress(PaymentReceiptStatusEnums.PAID)}
              style={[
                styles.paymentButton,
                isPayable && styles.isPaymentActive,
                { flex: 2, }
              ]}
              textStyle={{
                color: '#333',
                fontSize: 22,
                fontWeight: 'bold'
              }}
              disabled={isPayable ? false : true}

            />
          </View>

          <ButtonIcon
            title="Save"
            iconName="save"
            onPress={() => onCompletePaymentPress(PaymentReceiptStatusEnums.PENDING)}
            containerStyle={{
              // flex: 1,
              backgroundColor: '#f8f9fa',
              alignSelf: 'flex-start',
            }}
          />

        </View>
        <SelectDiscountModal
          visible={isShowDiscountModal}
          onClose={hideDiscountModal}
          onSelect={onSelectDiscount}
        />
        <ConfirmReceiptModal
          visible={isShowConfirmModal}
          onClose={() => { setIsShowConfirmModal(false) }}
          receiptData={calculatePayments().paymentInvoice}
        // receipt={paymentReceipt}
        />
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