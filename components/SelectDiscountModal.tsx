import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';
import Modal from 'react-native-modal';
import { ms } from 'react-native-size-matters';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';

// Payment Methods



// Payment Method Display Names and Icons
const PAYMENT_METHOD_INFO: Record<PaymentDiscountRateEnums, { label: string; icon: string }> = {
  [PaymentDiscountRateEnums.DISC_5_PERCENT]: { label: '5% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_10_PERCENT]: { label: '10% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_15_PERCENT]: { label: '15% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_20_PERCENT]: { label: '20% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_25_PERCENT]: { label: '25% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_30_PERCENT]: { label: '30% ', icon: 'gift-outline' },
  [PaymentDiscountRateEnums.DISC_0_PERCENT]: { label: '0% ', icon: 'gift-outline' },
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
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.methodContent}>
        {/* Header */}
        <Text style={styles.headerTitle}>Select Service Discount(%)</Text>
        <ButtonIcon
          iconName="close-outline"
          onPress={onClose}
          containerStyle={commonStyles.closeButtonView}
        />
        {/* Payment Methods List */}
        <ScrollView style={styles.methodsList}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            alignContent: 'center',
            gap: ms(10),
            justifyContent: 'center',
          }}>
            {Object.entries(PAYMENT_METHOD_INFO).map(([method, info]) => (
              <ButtonIcon
                iconName={'gift-outline'}
                onPress={() => {
                  onSelect(method as unknown as PaymentDiscountRateEnums);
                  onClose();
                }}
                containerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: ms(60),
                  height: ms(60),
                }}
                title={info.label}
                titleStyle={{
                  fontSize: ms(12),
                  color: '#333',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                color="#007AFF"

              />
            ))}

          </View>
        </ScrollView>
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
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
    marginRight: 8,
  },
  methodContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: ms(10),
    maxHeight: '80%',
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
    fontSize: ms(12),
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
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