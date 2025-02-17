import { SalonPaymentReceiptType } from '@/store/useSalonUpdatePaymentStore';
import { PaymentInvoiceDetailType } from '@/types/receipt.type';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { ms, s } from 'react-native-size-matters';
import ButtonText from './commons/ButtonText';
import Badge from './commons/Badge';
import ButtonIcon from './commons/ButtonIcon';
import Modal from 'react-native-modal';
import { commonStyles } from '@/utils/commonStyles';
interface AddDiscountModalProps {
  visible: boolean;
  onClose: () => void;
  discountPercent?: number;
  updateDiscountPercent?: (value: number) => void;
}


const DISCOUNT_PERCENTAGES = [0, 5, 10, 15, 20, 25];

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  visible,
  onClose,
  discountPercent,
  updateDiscountPercent,
}) => {

  const [discount, setDiscount] = useState(discountPercent || 0);

  const onChangeDiscountPercent = (value: number) => {
    setDiscount(value);
  }

  const onConfirm = () => {
    if (updateDiscountPercent) {
      updateDiscountPercent(discount);
      onClose();
    }
  }

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
      avoidKeyboard={true}
    >
      <View style={styles.modalContent}>
        <ButtonIcon
          iconName='close'
          size={ms(12)}
          containerStyle={commonStyles.closeButtonView}
          onPress={onClose}
        />
        <View>
          <Text style={styles.title}>Discount(%)</Text>
        </View>
        <View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 20, justifyContent: 'center' }}>
            {
              DISCOUNT_PERCENTAGES.map((value: number) =>
                <ButtonIcon
                  key={value}
                  iconName={'gift'}
                  containerStyle={{
                    width: ms(60),
                    height: ms(60),
                    // backgroundColor: value == discount ? '#007BFF' : 'grey',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: ms(12),
                    borderWidth: value == discount ? 1 : 0,
                    borderColor: value == discount ? '#007BFF' : 'transparent',
                    flexDirection: 'column',
                  }}
                  size={ms(12)}
                  onPress={() => onChangeDiscountPercent(value)}
                  title={`${value}%`}
                  color={value == discount ? '#007BFF' : 'grey'}
                />
              )
            }
          </View>
          <CurrencyInput
            value={discount || 0}
            onChangeValue={(value) => onChangeDiscountPercent(Number(value))}
            prefix=""
            suffix="%"
            delimiter="."
            separator="."
            precision={0}
            minValue={0}
            showPositiveSign={false}
            onChangeText={(formattedValue) => {
              console.log(formattedValue); // R$ +2.310,46
            }}
            style={styles.priceInput}
          />

        </View>

        <ButtonText
          title="Confirm"
          onPress={onConfirm}
          textStyle={styles.closeButtonText}
          containerStyle={{
            marginVertical: 8
          }}
        />

      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: ms(12),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContent: {
    maxHeight: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    minWidth: ms(120),
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


});

export default AddDiscountModal;

// Usage Example:
/*
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const sampleReceiptData = {
    serviceTotal: 100.00,
    discount: 10.00,
    tip: 15.00,
    receivedAmount: 150.00,
    paymentMethod: 'CASH' as const,
  };

  return (
    <View>
      <ConfirmReceiptModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        receiptData={sampleReceiptData}
      />
      <Button
        title="Show Receipt"
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
};
*/