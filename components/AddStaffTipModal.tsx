import { SalonPaymentReceiptType } from '@/store/useSalonUpdatePaymentStore';
import { PaymentInvoiceDetailType, SalonReceipt } from '@/types/receipt.type';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { ms } from 'react-native-size-matters';
import ButtonText from './commons/ButtonText';

interface AddStaffTipModalProps {
  visible: boolean;
  onClose: () => void;
  receiptData?: PaymentInvoiceDetailType;
  paymentReceipts?: SalonReceipt;
  updateReceiptStaffTip: (index: number, value: number | null) => void;
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const AddStaffTipModal: React.FC<AddStaffTipModalProps> = ({
  visible,
  onClose,
  receiptData,
  paymentReceipts,
  updateReceiptStaffTip
}) => {


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Tip</Text>

          <ScrollView
          >
            {paymentReceipts?.staff_receipts?.map((staff, index) => (
              <View style={styles.staffRow} key={index}>

                <Text style={styles.staffName}>{staff.staff?.first_name}</Text>

                <View style={{ flex: 1 }}>
                  <CurrencyInput
                    value={staff.tip_amount}
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
              </View>

            ))}
          </ScrollView>

          <ButtonText
            title="Close"
            onPress={onClose}
            textStyle={styles.closeButtonText}
          />


        </View>
      </View>
    </Modal>
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
    justifyContent: 'center',

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

export default AddStaffTipModal;

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