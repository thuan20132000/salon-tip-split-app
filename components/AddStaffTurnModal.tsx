import React, { useEffect, useState } from 'react';
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
import { Colors } from '@/constants/Colors';
interface AddStaffTurnModalProps {
  visible: boolean;
  onClose: () => void;
  staffTurn: StaffTurn;
  initialTurnServices?: TurnService[];
}


const AddStaffTurnModal: React.FC<AddStaffTurnModalProps> = ({
  visible,
  onClose,
  staffTurn,
  initialTurnServices
}) => {


  const {
    addStaffTurn,
    salonTurnServices
  } = useTurnManagementStore((state: TurnManagementState) => state)

  console.log('initialTurnServices::', JSON.stringify(initialTurnServices, null, 4));

  const [turn, setTurn] = useState<Turn>();
  const [selectedTurnServices, setSelectedTurnServices] = useState<TurnService[]>(initialTurnServices || []);

  useEffect(() => {
    if (initialTurnServices) {
      setSelectedTurnServices(initialTurnServices);
      setTurn({
        id: new Date().getTime(),
        services: initialTurnServices || [],
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: TurnStatusEnums.IN_SERVICE,
      });
    }
  }, [initialTurnServices])

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
        <Text style={styles.title}>Add Turn for {staffTurn?.staff?.first_name}</Text>
        <View>
          <View>
            <Text style={commonStyles.textH5}>Services</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {
                selectedTurnServices.map((s) => (
                  <View style={[styles.selectedServiceBadge]}>
                    <Text style={[commonStyles.textParagraph, {
                      fontWeight: '500',
                      color: Colors.primary.dark
                    }]}>{s.name} </Text>
                    <Text style={[commonStyles.textParagraph, {
                      fontWeight: '500',
                      color: Colors.primary.dark
                    }]}>{s.price}</Text>
                  </View>
                ))
              }
            </View>
          </View>
          <View>
            <Text style={commonStyles.textH5}>Total</Text>
            <Text style={commonStyles.textParagraph}>{selectedTurnServices.reduce((acc, s) => acc + (s.price || 0), 0)}</Text>
          </View>
        </View>
        <ScrollView horizontal style={styles.scrollContent}>
          {
            salonTurnServices.map((service, index) => (
              <TouchableOpacity
                onPress={() => onSelectTurnService(service)}
                key={index.toString()}
              >
                <View
                  style={[styles.serviceBox, {
                    backgroundColor:
                      selectedTurnServices.includes(service) ? Colors.primary.lightYellow : Colors.primary.lightGray
                  }]}
                >
                  <Text style={styles.label}
                    numberOfLines={1}
                  >{service.name}</Text>
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
    minWidth: ms(42),
    height: ms(42),
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

  }


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