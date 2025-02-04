import { SalonPaymentReceiptType } from '@/store/useSalonUpdatePaymentStore';
import { PaymentInvoiceDetailType, SalonReceipt } from '@/types/receipt.type';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import ButtonText from './commons/ButtonText';
import Modal from 'react-native-modal'
import { StaffTurn, Turn, TurnService } from '@/types/turn.types';
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';
import { TurnStatusEnums } from '@/enums/TurnEnums';
import TurnStatusList from './TurnStatusList';
import dayjs from 'dayjs';


interface UpdateStaffTurnModalProps {
  visible: boolean;
  onClose: () => void;
  staffTurn: StaffTurn;
  updateTurn: Turn;
}

const UpdateStaffTurnModal: React.FC<UpdateStaffTurnModalProps> = ({
  visible,
  onClose,
  staffTurn,
  updateTurn
}) => {
  const {
    updateStaffTurn,
    initialTurnService,
    removeStaffTurn
  } = useTurnManagementStore((state: TurnManagementState) => state);

  const [selectedService, setSelectedService] = useState<TurnService[]>(updateTurn?.services || []);
  const [selectedStatus, setSelectedStatus] = useState(updateTurn.status);

  const onUpdateTurn = () => {

    let updatedTurn: Turn = {
      ...updateTurn,
      services: selectedService,
      status: selectedStatus,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    updateStaffTurn(staffTurn, updatedTurn);
    onClose();
  }

  const onRemoveTurn = () => {
    removeStaffTurn(staffTurn, updateTurn);
    onClose();
  }

  const onShowAlertRemoveTurnConfirm = () => {
    Alert.alert(
      'Remove Turn',
      'Are you sure you want to remove this turn?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: onRemoveTurn }
      ]
    );
  }


  const onSelectTurnService = (turnService: TurnService) => {
    let turnServices = [...selectedService];
    if (turnServices.includes(turnService)) {
      turnServices = turnServices.filter((s) => s.id !== turnService.id);
    } else {
      turnServices.push(turnService);
    }

    setSelectedService(turnServices);
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
          color='blue'
          containerStyle={commonStyles.closeButtonView}
        />
        <Text style={styles.title}>Update Staff Turn</Text>
        <View>
          <Text>Services</Text>
          <ScrollView horizontal style={styles.scrollContent}>
            {
              initialTurnService.map((service, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={[
                    styles.serviceBox,
                    selectedService.find(selected => selected.id === service.id) ? { backgroundColor: '#007AFF' } : {},
                  ]}
                  onPress={() => onSelectTurnService(service)}
                >
                  <Text style={styles.label}>{service.name}</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        </View>
        <View>
          <Text>Status</Text>
          <TurnStatusList
            onSelectTurnStatusPress={(status) => setSelectedStatus(status)}
            selectedTurnStatus={selectedStatus}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <ButtonText
            title="Remove"
            onPress={onShowAlertRemoveTurnConfirm}
            textStyle={styles.closeButtonText}
            containerStyle={{
              backgroundColor: 'red',
              marginTop: 10,
            }}
          />
          <ButtonText
            title="Update"
            onPress={onUpdateTurn}
            textStyle={styles.closeButtonText}
            containerStyle={{
              backgroundColor: '#007AFF',
              marginTop: 10,
            }}
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

export default UpdateStaffTurnModal;

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