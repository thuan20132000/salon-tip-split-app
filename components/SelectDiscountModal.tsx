import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';


// Payment Methods



// Payment Method Display Names and Icons
const PAYMENT_METHOD_INFO: Record<PaymentDiscountRateEnums, { label: string; icon: string }> = {
  [PaymentDiscountRateEnums.DISC_5_PERCENT]: { label: '5% Discount', icon:'gift-outline' },
  [PaymentDiscountRateEnums.DISC_10_PERCENT]: { label: '10% Discount', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_15_PERCENT]: { label: '15% Discount', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_20_PERCENT]: { label: '20% Discount', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_25_PERCENT]: { label: '25% Discount', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_30_PERCENT]: { label: '30% Discount', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_0_PERCENT]: { label: 'No Discount', icon: 'gift-outline' },
};

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: PaymentDiscountRateEnums) => void;
  selectedMethod?: PaymentMethodsEnums;
}

const SelectDiscountModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedMethod,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Payment Method</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Payment Methods List */}
          <ScrollView style={styles.methodsList}>
            {Object.entries(PAYMENT_METHOD_INFO).map(([method, info]) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.methodItem,
                  selectedMethod === method && styles.selectedMethod
                ]}
                onPress={() => {
                  onSelect(method as unknown as PaymentDiscountRateEnums);
                  onClose();
                }}
              >
                <View style={styles.methodContent}>
                  <View style={styles.methodIcon}>
                    <Ionicons
                      name={info.icon as any}
                      size={24}
                      color={selectedMethod === method ? '#007AFF' : '#666'}
                    />
                  </View>
                  <Text style={[
                    styles.methodLabel,
                    selectedMethod === method && styles.selectedMethodText
                  ]}>
                    {info.label}
                  </Text>
                </View>
                {selectedMethod === method && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // height:'50%'
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  methodsList: {
    padding: 16,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodLabel: {
    fontSize: 16,
    color: '#333',
  },
  selectedMethod: {
    backgroundColor: '#e3f2fd',
  },
  selectedMethodText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default SelectDiscountModal;