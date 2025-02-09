import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Modal from 'react-native-modal'
import { TurnService } from '@/types/turn.types';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';
import { Colors } from '@/constants/Colors';
import ButtonText from './commons/ButtonText';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
import { SalonServiceType } from '@/types/salon.types';
interface SalonServicesSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectServices: (services: SalonServiceType[]) => void;
}


const SalonServicesSelectionModal: React.FC<SalonServicesSelectionModalProps> = ({
  visible,
  onClose,
  onSelectServices
}) => {


  const {
    salonServices
  } = useSalonServicesStore((state: SalonServicesState) => state);

  const [selectedTurnServices, setSelectedTurnServices] = useState<SalonServiceType[]>([]);

  const onSelectTurnServicePress = (service: SalonServiceType) => {

    if (selectedTurnServices.includes(service)) {
      setSelectedTurnServices(selectedTurnServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedTurnServices([...selectedTurnServices, service]);
    }
  }



  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onSwipeCancel={onClose}
      onBackdropPress={onClose}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
    >
      <View style={styles.modalContent}>
        <ButtonIcon
          iconName='close'
          onPress={onClose}
          containerStyle={commonStyles.closeButtonView}
        />
        <Text style={styles.title}>Salon Services</Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>

          <ScrollView>
            <View style={{ marginTop: 20 }}>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {
                  salonServices.map((service, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      style={[styles.serviceItem, selectedTurnServices.includes(service) ? { backgroundColor: 'lightgreen' } : {}]}
                      onPress={() => onSelectTurnServicePress(service)}
                    >
                      <Text key={index.toString()}>{service.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

            </View>

          </ScrollView>
        </View>
        <ButtonText
          title="Save"
          containerStyle={{
            // flex: 1,
          }}
          onPress={() => onSelectServices(selectedTurnServices)}
        />
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
  serviceBox: {
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: ms(42),
    height: ms(22),
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  selectedServiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 5,
    padding: 6,
    marginRight: ms(2),
    backgroundColor: Colors.primary.lightGreen,

  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.primary.dark,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 2,
    marginVertical: 2,
    borderRadius: 5,
    width: 80,
    height: 80,
    marginRight: 10,
  }
});

export default SalonServicesSelectionModal;

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