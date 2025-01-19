import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { ms, s } from 'react-native-size-matters';
import ButtonText from './commons/ButtonText';
import ButtonIcon from './commons/ButtonIcon';

interface PaymentMixModalProps {
  visible: boolean;
  onClose: () => void;
  cashPaymentAmount: number;
  setCashPaymentAmount: (value: number) => void;
  debitPaymentAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}


const PaymentMixModal: React.FC<PaymentMixModalProps> = ({
  visible,
  onClose,
  cashPaymentAmount,
  setCashPaymentAmount,
  debitPaymentAmount,
  onConfirm,
  onCancel

}) => {

  const [amount, setAmount] = useState(cashPaymentAmount || 0);

  const onConfirmPress = () => {
    console.log('====================================');
    console.log('Confirm Pressed');
    console.log('====================================');
    onClose()
  }

  const onCancelPress = () => {
    console.log('====================================');
    console.log('Cancel Pressed');
    console.log('====================================');
    if(onCancel){
      onCancel()
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}

    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Pay By Debit + Cash</Text>
          <ButtonIcon
            iconName='close'
            containerStyle={{
              width: 50,
              height: 50,
              position: 'absolute',
              right: 8,
              top: 8
            }}
            onPress={onClose}
          />
          <View style={styles.inputContainer}>
            <View
              style={{
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.discountTitle}>Pay Cash: </Text>
                <CurrencyInput
                  value={cashPaymentAmount}
                  onChangeValue={(value) => {
                    setCashPaymentAmount(value ?? 0);
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.discountTitle}>Pay Debit: </Text>
                <CurrencyInput
                  value={debitPaymentAmount}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                <Text style={styles.returnPrice}>Total: </Text>
                <Text style={styles.returnPrice}>${(cashPaymentAmount + debitPaymentAmount).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <ButtonText
            title="Confirm"
            onPress={onConfirmPress}
            textStyle={styles.closeButtonText}
            containerStyle={{
              marginVertical: 8
            }}
          />

          <ButtonText
            title="Cancel"
            onPress={onCancelPress}
            textStyle={styles.closeButtonText}
            containerStyle={{
              marginVertical: 8,
              backgroundColor: 'red'
            }}
          />

        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
  },
  title: {
    fontSize: 24,
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
    marginBottom: 8,
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  returnPrice: {
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  discountTitle: {
    fontSize: ms(12),
    fontWeight: '600',
    marginBottom: 12,
  },
  currencyInput: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    marginBottom: 18,
    borderRadius: 8,
    height: 45,
    flex: 1,
    fontSize: ms(14),
    fontWeight: 'bold',
  },

});

export default PaymentMixModal;

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