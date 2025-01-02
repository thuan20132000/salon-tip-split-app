import { PaymentInvoiceDetailType } from '@/types/receipt.type';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface ConfirmReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  receiptData?: PaymentInvoiceDetailType;
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const ConfirmReceiptModal: React.FC<ConfirmReceiptModalProps> = ({
  visible,
  onClose,
  receiptData,
}) => {




  const ReceiptRow = ({ label, value }: { label?: string; value?: string }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Receipt Details</Text>

          <ScrollView style={styles.scrollContent}>
            <ReceiptRow
              label="Service Total"
              value={formatCurrency(receiptData?.total_service_amount || 0)}
            />
            <ReceiptRow
              label="Payment Method"
              value={receiptData?.payment_method?.toString()}
            />
            {/* {discount > 0 && (
              <ReceiptRow
                label="Discount"
                value={`-${formatCurrency(discount)}`}
              />
            )}
            <ReceiptRow
              label="Price After Discount"
              value={formatCurrency(priceAfterDiscount)}
            />
            <ReceiptRow
              label="Tip"
              value={formatCurrency(tip)}
            />
            <View style={styles.divider} />
            <ReceiptRow
              label="Total Amount"
              value={formatCurrency(totalWithTip)}
            />
            <ReceiptRow
              label="Received"
              value={formatCurrency(receivedAmount)}
            />
            {changeAmount > 0 && (
              <ReceiptRow
                label="Change"
                value={formatCurrency(changeAmount)}
              />
            )}
            <View style={styles.divider} />
            <ReceiptRow
              label="Payment Method"
              value={paymentMethod}
            /> */}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
  },
});

export default ConfirmReceiptModal;

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