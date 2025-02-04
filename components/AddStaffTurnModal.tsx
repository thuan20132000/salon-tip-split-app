import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import ButtonText from './commons/ButtonText';
import Modal from 'react-native-modal'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore';
import { StaffTurn, Turn, TurnService } from '@/types/turn.types';
import dayjs from 'dayjs';
import { TurnStatusEnums } from '@/enums/TurnEnums';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';
interface AddStaffTurnModalProps {
  visible: boolean;
  onClose: () => void;
  staffTurn: StaffTurn;
}


const AddStaffTurnModal: React.FC<AddStaffTurnModalProps> = ({
  visible,
  onClose,
  staffTurn
}) => {


  const {
    addStaffTurn,
    initialTurnService
  } = useTurnManagementStore((state: TurnManagementState) => state)

  const [turn, setTurn] = useState<Turn>();
  const [selectedTurnServices, setSelectedTurnServices] = useState<TurnService[]>([]);

  const clearTurn = () => {
    setTurn(undefined);
    setSelectedTurnServices([]);
  }

  const onConfirm = () => {
    if (addStaffTurn) {
      let newTurn: Turn = turn as Turn;
      addStaffTurn(staffTurn, newTurn);
      clearTurn();
      onClose();
    }
  }

  const onSelectTurnService = (turnService: TurnService) => {
    let turnServices = [...selectedTurnServices];
    if (turnServices.includes(turnService)) {
      turnServices = turnServices.filter((s) => s.id !== turnService.id);
    } else {
      turnServices.push(turnService);
    }

    setSelectedTurnServices(turnServices);
   
    setTurn({
      id: new Date().getTime(),
      services: turnServices,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: TurnStatusEnums.IN_SERVICE,
    });

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
        <Text style={styles.title}>Add Staff Turn</Text>
        <ScrollView horizontal style={styles.scrollContent}>
          {
            initialTurnService.map((service,index) => (
              <TouchableOpacity
                onPress={() => onSelectTurnService(service)}
                key={index.toString()}
              >
                <View style={[styles.serviceBox,{
                  backgroundColor: selectedTurnServices.includes(service) ? '#007AFF' : '#ffd33d'
                }]} >
                  <Text style={styles.label}>{service.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
        <ButtonText
          title="Confirm"
          onPress={onConfirm}
          textStyle={styles.closeButtonText}
          containerStyle={{
            marginTop: 10,
          }}
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
    width: ms(40),
    height: ms(40),
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    marginRight: 10,
  },


});

export default AddStaffTurnModal;

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