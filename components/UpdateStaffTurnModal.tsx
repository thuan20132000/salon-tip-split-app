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
import TurnStatusList from './TurnStatusList';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';
import { SalonServiceType } from '@/types/salon.types';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
import CurrencyInput from 'react-native-currency-input';
import { formatCurrency } from '@/utils/receiptUtils';

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
    removeStaffTurn
  } = useTurnManagementStore((state: TurnManagementState) => state);

  const {
    salonServices
  } = useSalonServicesStore((state: SalonServicesState) => state);

  const [selectedService, setSelectedService] = useState<SalonServiceType[]>(updateTurn?.services || []);
  const [selectedStatus, setSelectedStatus] = useState(updateTurn.status);
  const [customPrice, setCustomPrice] = useState(0);
  const onUpdateTurn = () => {

    let updatedTurn: Turn = {
      ...updateTurn,
      services: selectedService,
      status: selectedStatus,
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


  const onSelectTurnService = (salonService: SalonServiceType) => {
    let turnServices = [...selectedService];
    if (turnServices.includes(salonService)) {
      turnServices = turnServices.filter((s) => s.id !== salonService.id);
    } else {
      turnServices.push(salonService);
    }

    setSelectedService(turnServices);
  }

  const getTotalPrice = () => {
    return selectedService.reduce((acc, s) => acc + (Number(s.price) || 0), 0)
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
        <Text style={styles.title}>Update Turn for {staffTurn.staff?.first_name}</Text>
        <View>
          <View

          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.textH5}>Services</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {
                    selectedService.map((s) => (
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
          <Text>Services</Text>
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
                        selectedService.includes(service) ? Colors.primary.lightYellow : Colors.primary.lightGray
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
        </View>
        <View>
          <Text>Status</Text>
          <TurnStatusList
            onSelectTurnStatusPress={(status) => setSelectedStatus(status)}
            selectedTurnStatus={selectedStatus}
          />
        </View>
        {/* show created_at and updated_at */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text>Created at: {dayjs(updateTurn.created_at).format('DD/MM/YYYY HH:mm')}</Text>
          <Text>Updated at: {dayjs(updateTurn.updated_at).format('DD/MM/YYYY HH:mm')}</Text>
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
    minWidth: ms(40),
    height: ms(22),
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: ms(4),
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