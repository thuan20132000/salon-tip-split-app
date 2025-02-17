import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import CurrencyInput from 'react-native-currency-input';
import { StaffBillType } from '@/types/receipt.type';
import ButtonIcon from './commons/ButtonIcon';
import { formatCurrency } from '@/utils/receiptUtils';
import TipBadge from './TipBadge';
import { handleNumberToPercent } from '@/utils/receiptUtils';
import { ms } from 'react-native-size-matters';
import { useSalonPaymentUpdateStore, SalonPaymentUpdateState } from '@/store/useSalonUpdatePaymentStore';
import SelectDiscountModal from './SelectDiscountModal';
import { PaymentDiscountRateEnums } from '@/enums/PaymentEnums';
import SalonServicesSelectionModal from './SalonServicesSelectionModal';
import { SalonServiceType } from '@/types/salon.types';
type Props = {
  staff: StaffBillType;
  index: number;
  updateReceiptStaffPrice: (staff: StaffBillType, value: number) => void;
  handleRemoveStaffBill: (staff: StaffBillType) => void;
}

const StaffReceiptPaymentItem = (props: Props) => {

  const {
    customDiscountPercent,
    updateCustomDiscountPercent,
    addStaffBillDiscount,
    updateStaffReceiptServices
  } = useSalonPaymentUpdateStore((state: SalonPaymentUpdateState) => state);

  const [isShowDiscountModal, setIsShowDiscountModal] = useState(false);
  const [isShowSalonServicesModal, setIsShowSalonServicesModal] = useState(false);

  const onSelectStaffDiscount = () => {
    setIsShowDiscountModal(true);
  }


  const showSalonServicesModal = () => {
    setIsShowSalonServicesModal(true);
  }

  const hideDiscountModal = () => {
    setIsShowDiscountModal(false);
  }

  const hideSalonServicesModal = () => {
    setIsShowSalonServicesModal(false);
  }

  const onSelectDiscount = (discount: PaymentDiscountRateEnums) => {
    addStaffBillDiscount(props.staff, discount);
    hideDiscountModal();
  }

  const onSelectSalonServices = (services: SalonServiceType[]) => {
    updateStaffReceiptServices(props.staff, services);
    hideSalonServicesModal();
  }


  const renderTipBadge = () => {
    if (Number(props.staff?.tip_amount) <= 0) {
      return null;
    }

    return (
      <TipBadge amount={Number(props.staff.tip_amount)} containerStyle={{ marginHorizontal: 6, padding: ms(4) }} />
    )
  }

  const getDiscountTitle = () => {
    let title = '';
    if (Number(props.staff.discount_price) > 0) {
      title = `(${handleNumberToPercent(Number(props.staff.discount_percent))}) ${formatCurrency(Number(props.staff.discount_price))}`;
    }
    return title;
  }

  const onConfirmRemoveStaffBill = () => {
    Alert.alert('Remove Staff Bill', `Are you sure you want to remove ${props.staff.staff?.first_name} from the bill?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => props.handleRemoveStaffBill(props.staff) }
    ]);
  }

  return (
    <View>
      <View style={[styles.staffReceiptItem]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(4) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4), flex: 1 }}>
            <Text style={styles.staffName}>{props.staff.staff?.first_name}</Text>
            {
              renderTipBadge()
            }
            <ButtonIcon
              iconName="gift"
              onPress={onSelectStaffDiscount}
              containerStyle={{ marginLeft: 8, padding: ms(4), backgroundColor: '#007AFF', borderRadius: 8 }}
              title={getDiscountTitle()}
              titleStyle={{ fontSize: ms(8), color: '#fff' }}
              color="#fff"
            />
          </View>
          <ButtonIcon
            iconName="trash-outline"
            onPress={onConfirmRemoveStaffBill}
            containerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
            }}
            size={14}
          />
        </View>
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
              value={props.staff.service_amount}
              onChangeValue={(value) => props.updateReceiptStaffPrice(props.staff, Number(value))}
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
            />
          </View>
        </View>
      </View>

      <SelectDiscountModal
        visible={isShowDiscountModal}
        onClose={hideDiscountModal}
        onSelect={onSelectDiscount}
      />
      <SalonServicesSelectionModal
        visible={isShowSalonServicesModal}
        onClose={hideSalonServicesModal}
        onSelectServices={onSelectSalonServices}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  staffReceiptItem: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 3,
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8',
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceInput: {
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
  }
})

export default StaffReceiptPaymentItem