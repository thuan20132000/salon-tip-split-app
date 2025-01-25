import { SalonPaymentReceiptType } from '@/store/useSalonUpdatePaymentStore';
import { PaymentInvoiceDetailType } from '@/types/receipt.type';
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
import Badge from './commons/Badge';
import ButtonIcon from './commons/ButtonIcon';

interface AddGiftModalProps {
  visible: boolean;
  onClose: () => void;
  giftAmount?: number;
  updateGiftAmount?: (value: number) => void;
}


const DISCOUNT_PERCENTAGES = [5, 10, 15, 20, 25, 30];

const AddGiftModal: React.FC<AddGiftModalProps> = ({
  visible,
  onClose,
  giftAmount,
  updateGiftAmount,
}) => {

  const [amount, setAmount] = useState(giftAmount || 0);

  const onConfirm = () => {
    if (updateGiftAmount) {
      updateGiftAmount(amount);
      onClose();
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
          <ButtonIcon
            iconName='close'
            containerStyle={{
              width: 50,
              height: 50,
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 999
            }}
            onPress={onClose}
          />
          <View>
            <Text style={styles.title}>Gift Card</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gift Card Amount ($)</Text>
            <CurrencyInput
              style={styles.input}
              value={amount}
              onChangeValue={(value) => setAmount(Number(value))}
              prefix="$"
              keyboardType="decimal-pad"
              placeholder="Enter gift card amount"
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
    maxHeight: '80%',
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

});

export default AddGiftModal;

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