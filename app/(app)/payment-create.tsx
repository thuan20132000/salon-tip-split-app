
// import { CurrencyInput } from '@/components/CurrencyInput';
import CurrencyInput from 'react-native-currency-input';

// screens/TipSplitScreen.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums, PaymentReceiptStatusEnums } from '@/enums/PaymentEnums';


import {
  CreateSalonReceiptType,
  SalonReceipt,
  StaffBillType,
} from '@/types/receipt.type';
import { receiptAPIs } from '@/api/receiptAPI';
import { formatCurrency, handleNumberToPercent } from '@/utils/receiptUtils';
import ConfirmReceiptModal from '@/components/CofirmReceiptModal';
import ButtonIcon from '@/components/commons/ButtonIcon';
import ButtonText from '@/components/commons/ButtonText';
import { SalonStaffType } from '@/types/staff.types';
import { SalonPaymentUpdateState, useSalonPaymentUpdateStore } from '@/store/useSalonUpdatePaymentStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import SelectStaffModal from '@/components/SelectStaffModal';
import PaymentMethods from '@/components/PaymentMethods';
import AddStaffTipModal from '@/components/AddStaffTipModal';
import AddDiscountModal from '@/components/AddDiscountModal';
import { ms, s } from 'react-native-size-matters';
import { helper } from '@/utils/helper';
import AddGiftModal from '@/components/AddGiftCardModal';
import PaymentMixModal from '@/components/PaymentMixModal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import ReceiptPrintModal from '@/components/ReceiptPrintModal';
import { RootState, useRootStore } from '@/store/useRootStore';
import { NavigationBar } from '@/components/NavigationBar';
import { AuthState, useAuthStore } from '@/store/authStore';
import StaffReceiptPaymentItem from '@/components/StaffReceiptPaymentItem';
import { Colors } from '@/constants/Colors';


export default function StaffPaymentScreen() {
  const { staff_ids } = useLocalSearchParams();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState<boolean>(false);
  const [isShowAddStaffTipModal, setIsShowAddStaffTipModal] = useState<boolean>(false);
  const [isShowTotalDiscountModal, setIsShowTotalDiscountModal] = useState<boolean>(false);
  const [isShowGiftModal, setIsShowGiftModal] = useState<boolean>(false);
  const [isShowPaymentMixModal, setIsShowPaymentMixModal] = useState<boolean>(false);
  const [isShowDatetimePicker, setIsShowDateTimePicker] = useState<boolean>(false);
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date | null>(new Date());
  const [isShowReceiptPrintModal, setIsShowReceiptPrintModal] = useState<boolean>(false);

  const {
    isLoading,
    setIsLoading
  } = useRootStore((state: RootState) => state);

  const {
    receive,
    tipPrice,
    cashPaymentPrice,
    setReceive,
    setTipPrice,
    setCashPaymentPrice,
    calculatePayments,
    resetPayment,
    selectedSalonReceipt,
    setSelectedSalonReceipt,
    onUpdateTipRate,
    removeSelectedSalonReceiptStaff,
    customDiscountPercent,
    updateCustomDiscountPercent,
    giftAmount,
    updateGiftAmount,
    updateStaffReceiptPrice,
    addNewSalonPaymentReceiptStaff
  } = useSalonPaymentUpdateStore((state: SalonPaymentUpdateState) => state);

  const {
    selectedSalon,
    salonStaffs
  } = useSalonStore((state: SalonState) => state);

  const {
    isSalonOwner
  } = useAuthStore((state: AuthState) => state);


  const handleInitialStaffPrice = () => {
    try {

      let staff_ids_list = JSON.parse(String(staff_ids));
      let selectedStaffList = salonStaffs?.filter((staff) => {
        return staff_ids_list.includes(Number(staff.id));
      });

      if (!selectedStaffList) {
        selectedStaffList = [];
      }

      let selectedStaffPriceList: StaffBillType[] = selectedStaffList.map((staff, index) => {
        return {
          staff: staff,
          service_amount: 0,
          tip_amount: 0,
          discount_percent: 0,
          discount_price: 0,
          service_name: '',
          id: new Date().getTime() + index
        }
      });


      setSelectedSalonReceipt({
        staff_receipts: selectedStaffPriceList,
      });
    } catch (error) {
      console.log('Error:', error);

    }

  }

  const onSelectPaymentMethod = (method: PaymentMethodsEnums, price: number) => {
    let receiveFormatted = price.toString();
    receiveFormatted = new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);


    setSelectedSalonReceipt({
      ...selectedSalonReceipt,
      payment_method: method,
      payment_method_price: String(price),
    })
    setReceive(Number(receiveFormatted));
  }

  const updateReceiptStaffPrice = (staffReceipt: StaffBillType, price: number | null) => {
    updateStaffReceiptPrice(staffReceipt, Number(price))

  }

  const onCompletePaymentPress = async (paymentStatus?: PaymentReceiptStatusEnums) => {
    try {

      setIsLoading(true);
      let newReceipt: CreateSalonReceiptType = {
        payment_method: selectedSalonReceipt?.payment_method || PaymentMethodsEnums.CASH,
        payment_method_price: Number(selectedSalonReceipt?.payment_method_price || 0).toFixed(2),
        return_amount: Number(returnAmount).toFixed(2),
        tip_total_amount: Number(tipPrice).toFixed(2),
        sub_total_amount: Number(calculatePayments().subtotal).toFixed(2),
        total_amount: Number(calculatePayments().total).toFixed(2),
        payment_status: paymentStatus || PaymentReceiptStatusEnums.PAID,
        salon: selectedSalon?.id,
        staff_receipts: calculatePayments().paymentInvoice?.staff_services?.map((staffReceipt) => {
          return {
            service_amount: staffReceipt.service_amount,
            tip_amount: staffReceipt.tip_amount,
            staff: Number(staffReceipt.staff?.id),
            service_name: staffReceipt.service_name || 'Service',
            discount_percent: (Number(staffReceipt.discount_percent)),
            discount_price: (Number(staffReceipt.discount_price)),
            created_at: dayjs(selectedPaymentDate).format(),
            updated_at: dayjs(selectedPaymentDate).format(),
          }
        }),
        created_at: dayjs(selectedPaymentDate).format(),
        updated_at: dayjs(selectedPaymentDate).format(),
      }

      await receiptAPIs.createSalonReceipt(newReceipt);

      Alert.alert('Create Payment Success', 'Create Payment has been successfully processed');
      resetPayment();
    } catch (err) {
      console.error('Error save payment:', err);

    } finally {
      setIsLoading(false);
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
  } = calculatePayments();


  const handleAddPaymentStaff = (staff: SalonStaffType) => {

    addNewSalonPaymentReceiptStaff(staff);
    setIsShowSelectStaffModal(false);
  }

  const [receiptData, setReceiptData] = useState<SalonReceipt>();
  const showSelectStaffModal = () => {
    setIsShowSelectStaffModal(true);


  }

  const onChangeTotalTip = (value: number) => {
    onUpdateTipRate(value);
    setTipPrice(value);
  }

  const handleRemoveStaffBill = (staffBill: StaffBillType) => {
    removeSelectedSalonReceiptStaff(staffBill);

  }


  const updateReceiptStaffTip = (index: number, tip: number | null) => {
    let newStaffPrices = [...selectedSalonReceipt?.staff_receipts || []];
    newStaffPrices[index] = { ...newStaffPrices[index], tip_amount: Number(tip) };
    let newPaymentReceipt: SalonReceipt = {
      ...selectedSalonReceipt,
      staff_receipts: newStaffPrices
    }
    setSelectedSalonReceipt(newPaymentReceipt);
  }

  const hideDatePicker = () => {
    setIsShowDateTimePicker(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    setSelectedPaymentDate(date);
    hideDatePicker();
  };

  const onShowPrintReceipt = () => {
    setIsShowReceiptPrintModal(true);
    let newReceipt: SalonReceipt = {
      payment_method: selectedSalonReceipt?.payment_method || PaymentMethodsEnums.CASH,
      payment_method_price: Number(selectedSalonReceipt?.payment_method_price).toFixed(2),
      return_amount: Number(returnAmount).toFixed(2),
      tip_total_amount: Number(tipPrice).toFixed(2),
      sub_total_amount: Number(calculatePayments().subtotal).toFixed(2),
      total_amount: Number(calculatePayments().total.toFixed(2)),
      // salon: selectedSalon?.id,
      staff_receipts: calculatePayments().paymentInvoice?.staff_services?.map((staffReceipt) => {
        return {
          service_amount: staffReceipt.service_amount,
          tip_amount: staffReceipt.tip_amount,
          staff: staffReceipt.staff,
          service_name: 'Service',
          discount_percent: (Number(staffReceipt.discount_percent)),
          discount_price: (Number(staffReceipt.discount_price)),
          created_at: dayjs(selectedPaymentDate).format(),
          updated_at: dayjs(selectedPaymentDate).format(),
        }
      }),
      created_at: dayjs(selectedPaymentDate).format(),
      updated_at: dayjs(selectedPaymentDate).format(),
    }

    setReceiptData(newReceipt);
  }


  useEffect(() => {
    handleInitialStaffPrice()

    return () => {
      resetPayment();
    }
  }, [])


  return (

    <>
      <NavigationBar
        title='Payment'
      >
        <ButtonText
          title="Save"
          onPress={() => onCompletePaymentPress(PaymentReceiptStatusEnums.PENDING)}
          textStyle={{ color: '#007AFF' }}
          containerStyle={{
            // flex: 1,
            backgroundColor: '#ffffff',
            alignSelf: 'flex-start',
            position: 'absolute',
            right: 10,
            bottom: 0
          }}
        />
      </NavigationBar>
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
      >

        {/* Staff Price Inputs */}
        <View style={styles.section}>
          {/* Staff  Price Input */}
          {selectedSalonReceipt?.staff_receipts?.map((staff, index) => (
            <StaffReceiptPaymentItem
              key={index}
              index={index}
              staff={staff}
              updateReceiptStaffPrice={updateReceiptStaffPrice}
              handleRemoveStaffBill={handleRemoveStaffBill}
            />
          ))}
          <ButtonIcon
            // title="Add Staff"
            iconName="add"
            onPress={showSelectStaffModal}
            containerStyle={{
              backgroundColor: '#f8f9fa',
              justifyContent: 'center'
            }}
          />

        </View>

        {/* Totals Section */}
        <View style={styles.section}>

          {/* Payment Methods */}
          <PaymentMethods
            calculatePayments={calculatePayments}
            onSelectPaymentMethod={onSelectPaymentMethod}
            cashGeneralDiscount={cashGeneralDiscount}
            cashPayment={cashPayment}
            debitGeneralDiscount={debitGeneralDiscount}
            debitPayment={debitPayment}
            loyaltyDiscount={loyaltyDiscount}
            happyHourDiscount={happyHourDiscount}
            paymentReceipt={selectedSalonReceipt}
            key={selectedSalonReceipt?.id}
            cashPaymentPrice={cashPaymentPrice}
            debitPaymentPrice={debitPaymentPrice}
            setCashPaymentPrice={setCashPaymentPrice}
            setSelectedSalonReceipt={setSelectedSalonReceipt}
            subtotal={subtotal}
          />


          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 12,
            }}
          >
            <View style={[{
              flexDirection: 'row',
              gap: 8,
              marginVertical: 2,
              flexWrap: 'wrap',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }]}>
              <ButtonIcon
                title={`Gift ${helper.formatCurrency(Number(giftAmount))}`}
                iconName='gift-outline'
                containerStyle={{
                  backgroundColor: giftAmount ? '#ffd33d' : '#d3d3d3',
                  alignItems:'center',
                  justifyContent:'center',
                }}
                onPress={() => setIsShowGiftModal(true)}
                titleStyle={{
                  fontSize: ms(10),
                  alignItems:'center',
                  justifyContent:'center',
                  textAlign:'center'
                }}
              />
              <ButtonIcon
                title={`Discount ${(Number(customDiscountPercent))}%`}
                iconName='gift-outline'
                containerStyle={{
                  backgroundColor: customDiscountPercent ? '#ffd33d' : '#d3d3d3',
                  alignItems:'center',
                  justifyContent:'center',
                }}
                onPress={() => setIsShowTotalDiscountModal(true)}
                titleStyle={{
                  fontSize: ms(10),
                  alignItems:'center',
                  justifyContent:'center',
                  
                }}
              />
              <ButtonIcon
                title={`Cash & Debit`}
                iconName='cash-outline'
                containerStyle={{
                  backgroundColor: cashPaymentPrice > 0 ? '#ffd33d' : '#d3d3d3',
                  alignItems:'center',
                  justifyContent:'center',
                  
                }}
                onPress={() => setIsShowPaymentMixModal(true)}
                titleStyle={{
                  fontSize: ms(10),
                  alignItems:'center',
                  justifyContent:'center',

                }}
              />
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: Colors.secondary.lightYellow,
              borderRadius: 5,
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 10
            }}>
              <Text style={styles.finalTotalText}>Total: {formatCurrency(calculatePayments().total)}</Text>
              <ButtonIcon
                iconName='print-sharp'
                onPress={onShowPrintReceipt}
              />
            </View>
          </View>

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
                  keyboardType='numeric'
                  returnKeyType='done'
                  returnKeyLabel='Done'

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
                <Text style={styles.returnPrice}>{formatCurrency(Number(returnAmount))}</Text>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => onChangeTotalTip(Number(returnAmount))}
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
                  onChangeValue={(value) => onChangeTotalTip(value ?? 0)}
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
                  onFocus={() => onChangeTotalTip(0)}
                  keyboardType='numeric'
                  returnKeyType='done'
                  returnKeyLabel='Done'
                />
                <ButtonText
                  title="Custom Tip"
                  onPress={() => setIsShowAddStaffTipModal(true)}
                  style={{
                    padding: 8,
                    marginLeft: 8,
                  }}
                  textStyle={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#007AFF'
                  }}
                />
              </View>
            </View>
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
                color: isPayable ? '#fff' : '#007AFF',
                fontSize: s(12),
                fontWeight: 'bold'
              }}
              disabled={isPayable || isLoading ? false : true}

            />
          </View>

          {
            isSalonOwner() &&
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
            </View>

          }

        </View>

        <ConfirmReceiptModal
          visible={isShowConfirmModal}
          onClose={() => { setIsShowConfirmModal(false) }}
        />
        <SelectStaffModal
          visible={isShowSelectStaffModal}
          onSelect={handleAddPaymentStaff}
          onCancel={() => { setIsShowSelectStaffModal(false) }}

        />
        <AddStaffTipModal
          visible={isShowAddStaffTipModal}
          onClose={() => { setIsShowAddStaffTipModal(false) }}
          paymentReceipts={selectedSalonReceipt}
          updateReceiptStaffTip={updateReceiptStaffTip}
        />
        <AddDiscountModal
          visible={isShowTotalDiscountModal}
          onClose={() => { setIsShowTotalDiscountModal(false) }}
          discountPercent={customDiscountPercent}
          updateDiscountPercent={updateCustomDiscountPercent}
        />
        <AddGiftModal
          visible={isShowGiftModal}
          onClose={() => { setIsShowGiftModal(false) }}
          giftAmount={giftAmount}
          updateGiftAmount={updateGiftAmount}
        />
        <PaymentMixModal
          visible={isShowPaymentMixModal}
          cashPaymentAmount={cashPaymentPrice}
          debitPaymentAmount={debitPaymentPrice}
          onClose={() => { setIsShowPaymentMixModal(false) }}
          setCashPaymentAmount={setCashPaymentPrice}
          onConfirm={() => { setIsShowPaymentMixModal(false) }}
          onCancel={() => {
            setCashPaymentPrice(0)
            setIsShowPaymentMixModal(false)
            onChangeTotalTip(0)
          }}
          onUpdateTipAmount={onChangeTotalTip}
        />
        <ReceiptPrintModal
          visible={isShowReceiptPrintModal}
          onClose={() => { setIsShowReceiptPrintModal(false) }}
          receiptData={receiptData}
        />
        <DateTimePickerModal
          isVisible={isShowDatetimePicker}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          display='inline'

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
    marginBottom: 12,
     // Adding shadow properties
     shadowColor: '#000',
     shadowOffset: {
       width: 0.2,
       height: 0.2,
     },
     shadowOpacity: 0.1,
     shadowRadius: 3.84,
     elevation: 5, // This is for Android shadow
     backgroundColor: '#fff',
     borderRadius: 8,
     padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  staffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffName: {
    fontSize: s(8),
    fontWeight: '500',
    marginBottom: 2,
  },
  priceInput: {
    // flex: 1,
    fontSize: ms(16),
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
    paddingVertical: 9,
    paddingHorizontal: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    width: ms(120),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
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
    flex: 1,
    marginVertical: 8
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
    backgroundColor: 'white'
  },
  finalTotalText: {
    fontSize: ms(16),
    fontWeight: 'bold',
    marginHorizontal: ms(20),
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
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  currencyInput: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    height: 45,
    minWidth: ms(140),
    fontSize: ms(16),
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#d8d8d8',
  },
  isPaymentActive: {
    backgroundColor: '#007AFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffReceiptItem: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 3,
    paddingHorizontal: ms(8),
    paddingVertical: ms(4)
  },
});