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
import ButtonText from './commons/ButtonText';
import Modal from 'react-native-modal'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore';
import { StaffTurn, Turn, TurnService } from '@/types/turn.types';
import dayjs from 'dayjs';
import { TurnStatusEnums } from '@/enums/TurnEnums';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';
import { Colors } from '@/constants/Colors';
import { SalonServiceType } from '@/types/salon.types';
import CurrencyInput from 'react-native-currency-input';
import { formatCurrency } from '@/utils/receiptUtils';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
interface AddStaffTurnModalProps {
  visible: boolean;
  onClose: () => void;
  staffTurn: StaffTurn;
  initialTurnServices?: SalonServiceType[];
}


const AddStaffTurnModal: React.FC<AddStaffTurnModalProps> = ({
  visible,
  onClose,
  staffTurn,
  initialTurnServices
}) => {


  const {
    addStaffTurn,
  } = useTurnManagementStore((state: TurnManagementState) => state)

  const {
    getSalonServices,
    salonServices
  } = useSalonServicesStore((state: SalonServicesState) => state);


  const [turn, setTurn] = useState<Turn>();
  const [selectedTurnServices, setSelectedTurnServices] = useState<SalonServiceType[]>(initialTurnServices || []);
  const [customPrice, setCustomPrice] = useState<number>(0);

  useEffect(() => {
    if (initialTurnServices) {
      setSelectedTurnServices(initialTurnServices);
      setTurn({
        id: new Date().getTime(),
        services: initialTurnServices || [],
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: TurnStatusEnums.IN_SERVICE,
        staff: staffTurn?.staff,
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
      newTurn.sub_total = getTotalPrice();
      newTurn.discount_percentage = 0;
      newTurn.discount_amount = 0;
      newTurn.total = newTurn.sub_total;
      if (customPrice > 0) {
        newTurn.custom_price = customPrice;
        newTurn.total = customPrice;
      }
      newTurn.staff = staffTurn?.staff;
      addStaffTurn(staffTurn, newTurn);
      clearTurn();
      setCustomPrice(0);
      onClose();
    }
  }

  const onSelectTurnService = (salonService: SalonServiceType) => {
    let turnServices = [...selectedTurnServices];
    if (turnServices.includes(salonService)) {
      turnServices = turnServices.filter((s) => s.id !== salonService.id);
    } else {
      turnServices.push(salonService);
    }

    setSelectedTurnServices(turnServices);

    setTurn({
      id: new Date().getTime(),
      services: turnServices,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: TurnStatusEnums.IN_SERVICE,
      staff: staffTurn?.staff,
    });

  }

  const getTotalPrice = () => {
    return selectedTurnServices.reduce((acc, s) => acc + (Number(s.price) || 0), 0)
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.textH5}>Services</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  selectedTurnServices.map((s) => (
                    <View style={[styles.selectedServiceBadge]} key={s.id.toString()}>
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
              <Text style={commonStyles.textH5}>Sub Total</Text>
              <Text style={commonStyles.textH4}>{formatCurrency(getTotalPrice())}</Text>
            </View>

          </View>

          <View>
            <Text style={commonStyles.textH5}>Custom Price</Text>
            <CurrencyInput
              value={customPrice}
              onChangeValue={(value) => setCustomPrice(value ?? 0)}
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
        </View>
        <ScrollView horizontal style={styles.scrollContent}>
          {
            salonServices.map((service, index) => (
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