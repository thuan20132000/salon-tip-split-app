import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { StaffServiceType } from '@/types/salon.types';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
import UpdateStaffServiceItem from './UpdateStaffServiceItem';

interface UpdateStaffServiceModalProps {
  visible: boolean;
  onClose: () => void;
  service: StaffServiceType;
  currentStaffServices: StaffServiceType[];
  staffId: number;
}


const UpdateStaffServiceModal: React.FC<UpdateStaffServiceModalProps> = ({
  visible,
  onClose,
  service,
  currentStaffServices,
  staffId,
}) => {

  const {
    salonServices,
    getSalonServices,
  } = useSalonServicesStore((state: SalonServicesState) => state)

  useEffect(() => {
    if (salonServices.length <= 0) {
      getSalonServices();
    }
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      avoidKeyboard
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Update Service</Text>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* List salon services with checkboxes */}
            {salonServices.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                <UpdateStaffServiceItem
                  key={service.id}
                  service={service}
                  currentStaffServices={currentStaffServices}
                  staffId={staffId}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    minHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: '80%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
  },
  buttonSubmit: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  submitText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceItemLeft: {
    flex: 1,
  },
  serviceItemRight: {
    // flex: 1,
    alignItems: 'flex-end',
  },
});

export default UpdateStaffServiceModal;
