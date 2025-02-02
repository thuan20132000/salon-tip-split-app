
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


import { SalonReceipt, SalonReceiptUpdateType, StaffBillType, StaffBillUpdateType, UpdateSalonReceiptInputType } from '@/types/receipt.type';
import { receiptAPIs } from '@/api/receiptAPI';
import { formatCurrency, handleDiscountPrice, handleNumberToPercent } from '@/utils/receiptUtils';
import SelectDiscountModal from '@/components/SelectDiscountModal';
import ConfirmReceiptModal from '@/components/CofirmReceiptModal';
import { Ionicons } from '@expo/vector-icons';
import ButtonIcon from '@/components/commons/ButtonIcon';
import ButtonText from '@/components/commons/ButtonText';
import { SalonStaffType } from '@/types/staff.types';
import { SalonPaymentUpdateState, useSalonPaymentUpdateStore } from '@/store/useSalonUpdatePaymentStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import SelectStaffModal from '@/components/SelectStaffModal';
import PaymentMethods from '@/components/PaymentMethods';
import AddStaffTipModal from '@/components/AddStaffTipModal';
import TipBadge from '@/components/TipBadge';
import AddDiscountModal from '@/components/AddDiscountModal';
import { ms, s } from 'react-native-size-matters';
import { helper } from '@/utils/helper';
import AddGiftModal from '@/components/AddGiftCardModal';
import PaymentMixModal from '@/components/PaymentMixModal';
import { APIErrorType } from '@/types/api.types';
import { NavigationBar } from '@/components/NavigationBar';


export default function StaffPaymentScreen() {
  const { payment_receipt } = useLocalSearchParams();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState<boolean>(false);
  const [isShowAddStaffTipModal, setIsShowAddStaffTipModal] = useState<boolean>(false);
  const [isShowTotalDiscountModal, setIsShowTotalDiscountModal] = useState<boolean>(false)
  const [isShowGiftModal, setIsShowGiftModal] = useState<boolean>(false);
  const [isShowPaymentMixModal, setIsShowPaymentMixModal] = useState<boolean>(false);

  const {
    receive,
    tipPrice,
    cashPaymentPrice,
    setReceive,
    setTipPrice,
    setCashPaymentPrice,
    calculatePayments,
    resetPayment,
    isLoading,
    addStaffBillDiscount,
    selectedSalonReceipt,
    setSelectedSalonReceipt,
    onUpdateTipRate,
    removeSelectedSalonReceiptStaff,
    deleteStaffReceipt,
    customDiscountPercent,
    updateCustomDiscountPercent,
    updateStaffReceiptPrice,
    addNewSalonPaymentReceiptStaff,
    giftAmount,
    updateGiftAmount,
  } = useSalonPaymentUpdateStore((state: SalonPaymentUpdateState) => state);

  const {
    selectedSalon
  } = useSalonStore((state: SalonState) => state);


  const handleInitialStaffPrice = () => {
    const selectedSalonReceipt: SalonReceipt = JSON.parse(String(payment_receipt));

    setSelectedSalonReceipt(selectedSalonReceipt);
    if (selectedSalonReceipt.tip_total_amount) {
      updateCustomDiscountPercent(Number(selectedSalonReceipt.custom_discount) * 100);
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


      let receiptUpdate: SalonReceiptUpdateType = {
        ...selectedSalonReceipt,
        tip_total_amount: tipPrice?.toFixed(2),
        payment_status: paymentStatus || PaymentReceiptStatusEnums.PAID,
        payment_method_price: Number(selectedSalonReceipt?.payment_method_price).toFixed(2),
        salon: Number(selectedSalon?.id),
        bonus_amount: 0,
        custom_discount: helper.handlePercentToDecimal(customDiscountPercent),
        total_amount: calculatePayments().total.toFixed(2),
        sub_total_amount: calculatePayments().subtotal.toFixed(2),
        staff_receipts: calculatePayments().paymentInvoice?.staff_services?.map((staffReceipt) => {
          return {
            service_amount: staffReceipt.service_amount,
            tip_amount: staffReceipt.tip_amount,
            staff: Number(staffReceipt.staff?.id),
            service_name: 'Service Name',
            discount_percent: staffReceipt.discount_percent,
            discount_price: staffReceipt.discount_price,
            id: Number(staffReceipt.id),
          }
        }),
      }

      await receiptAPIs.updateSalonReceipt(Number(selectedSalonReceipt?.id), receiptUpdate);

      Alert.alert('Update Payment Success', 'Update Payment has been successfully processed');

    } catch (err: any) {
      // console.error('Error save payment:', err);
      helper.showAlertErrorMessage(err);

    } finally {
      resetPayment();
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


  const [selectedStaffDiscount, setSelectedStaffDiscount] = useState<StaffBillType | null>(null);
  const [isShowDiscountModal, setIsShowDiscountModal] = useState<boolean>(false);

  const onSelectStaffDiscount = (staff: StaffBillType) => {
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

  const handleAddPaymentStaff = (staff: SalonStaffType) => {

    addNewSalonPaymentReceiptStaff(staff);
    setIsShowSelectStaffModal(false);

  }

  const showSelectStaffModal = () => {
    setIsShowSelectStaffModal(true);
  }

  const renderDiscountButton = (staff: StaffBillType) => {
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
          Number(staff.discount_price) > 0 && (
            <Text>({handleNumberToPercent(Number(staff.discount_percent))}) {formatCurrency(Number(staff.discount_price))}</Text>
          )
        }
      </TouchableOpacity>
    )
  }

  const renderTipBadge = (staff: StaffBillType) => {
    if (Number(staff?.tip_amount) <= 0) {
      return null;
    }

    return (
      <TipBadge amount={Number(staff.tip_amount)} containerStyle={{ marginHorizontal: 6 }} />
    )
  }

  const onChangeTotalTip = (value: number) => {
    onUpdateTipRate(value);
    setTipPrice(value);
  }

  const handleRemoveStaffBill = (staffBill: StaffBillType) => {
    if (staffBill.id) {
      deleteStaffReceipt(staffBill);
    }
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




  useEffect(() => {
    handleInitialStaffPrice()

    return () => {
      resetPayment();
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
      <NavigationBar
        title='Payment Update'
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
            bottom: 0,
            zIndex: 999
          }}
        />
      </NavigationBar>
      <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}>

        {/* Staff Price Inputs */}
        <View style={styles.section}>
          {/* Staff  Price Input */}
          {selectedSalonReceipt?.staff_receipts?.map((staff, index) => (
            <View key={index} style={[styles.staffReceiptItem]}>
              <Text style={styles.staffName}>{staff.staff?.first_name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  <CurrencyInput
                    value={staff.service_amount}
                    onChangeValue={(value) => updateReceiptStaffPrice(staff, value)}
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
                    keyboardType='numeric'
                    returnKeyType='done'
                    returnKeyLabel='Done'
                    keyboardAppearance='light'
                  />
                  {
                    renderDiscountButton(staff)
                  }
                  {
                    renderTipBadge(staff)
                  }
                </View>
                <View>
                  <ButtonIcon
                    iconName="trash-outline"
                    onPress={() => handleRemoveStaffBill(staff)}
                    containerStyle={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                    }}
                    size={14}
                  />
                </View>
              </View>
            </View>
          ))}
          <ButtonIcon
            iconName="add"
            onPress={showSelectStaffModal}
            containerStyle={{
              // flex: 1,
              backgroundColor: '#f8f9fa',
              justifyContent: 'center'
              // alignSelf: 'flex-start',

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
          <View style={{flexDirection:'row'}}>
            <View style={[{ flexDirection: 'row', gap: 8, marginVertical: 2, flexWrap: 'wrap',flex:1 }]}>
              <ButtonIcon
                title={`Gift ${helper.formatCurrency(Number(giftAmount))}`}
                iconName='gift-outline'
                containerStyle={{
                  backgroundColor: giftAmount ? '#ffd33d' : '#d3d3d3',
                }}
                onPress={() => setIsShowGiftModal(true)}
              />
              <ButtonIcon
                title={`Discount ${(Number(customDiscountPercent))}%`}
                iconName='gift-outline'
                containerStyle={{
                  backgroundColor: customDiscountPercent ? '#ffd33d' : '#d3d3d3',
                }}
                onPress={() => setIsShowTotalDiscountModal(true)}
              />
              <ButtonIcon
                title={`Cash & Debit`}
                iconName='cash-outline'
                containerStyle={{
                  backgroundColor: cashPaymentPrice > 0 ? '#ffd33d' : '#d3d3d3',
                }}
                onPress={() => setIsShowPaymentMixModal(true)}
              />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffd33d',
                borderRadius: 5,
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 10
            }}>
              <Text style={styles.finalTotalText}>Total: {formatCurrency(calculatePayments().total)}</Text>
              <ButtonIcon
                iconName='print-sharp'
                onPress={() => { }}
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
                color: '#333',
                fontSize: 22,
                fontWeight: 'bold'
              }}
              disabled={isPayable ? false : true}

            />
          </View>



        </View>
        <SelectDiscountModal
          visible={isShowDiscountModal}
          onClose={hideDiscountModal}
          onSelect={onSelectDiscount}
        />
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
          onConfirm={() => {
            setSelectedSalonReceipt({
              ...selectedSalonReceipt,
              payment_method: PaymentMethodsEnums.COMBINATION_CASH_DEBIT,
              // payment_method_price: calculatePayments().total.toFixed(2),
            })
            console.log('====================================');
            console.log('Payment Mix', calculatePayments().total.toFixed(2));
            console.log('====================================');
            setIsShowPaymentMixModal(false)
           }}
          onCancel={() => {
            setCashPaymentPrice(0)
            setIsShowPaymentMixModal(false)
          }}
          onUpdateTipAmount={onChangeTotalTip}
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
  staffReceiptItem: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 3,
    padding: 6
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
    fontSize: ms(16),
    fontWeight: 'bold',
    marginHorizontal: ms(20),
    color: '#007AFF',
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
    minWidth: ms(140),
    fontSize: ms(16),
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