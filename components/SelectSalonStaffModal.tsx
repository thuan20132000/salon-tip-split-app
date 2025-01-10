import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import ButtonIcon from './commons/ButtonIcon';
import { SalonStaffType } from '@/types/staff.types';

interface Staff {
  id: string;
  name: string;
}

interface SelectSalonStaffModalProps {
  isVisible: boolean;
  onClose: () => void;
  staffList: SalonStaffType[] | null;
  onSelectStaff: (staff: SalonStaffType) => void;
  onItemPress: () => void;
  selectedStaff: SalonStaffType | null | undefined;
}

const SelectSalonStaffModal: React.FC<SelectSalonStaffModalProps> = ({ isVisible, onClose, staffList, onSelectStaff, onItemPress, selectedStaff }) => {

  const handleSelectStaff = (staff: SalonStaffType) => {
    onSelectStaff(staff);
    onClose();
  };

  const handleSelectAllStaff = () => {
    onSelectStaff({ id: 0, first_name: 'All Staffs', last_name: '' });
    onClose();
  }

  const getButtonTitle = () => {
    return selectedStaff?.first_name || 'Select Staff';
  }

  const [isShowStaffModal, setShowStaffPicker] = useState(false);


  return (
    <View>
      <ButtonIcon
        title={getButtonTitle()}
        onPress={onItemPress}
        iconName='person'
      />

      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Staff</Text>
          <FlatList
            data={staffList}
            keyExtractor={(item, index) => item.address?.toString() || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.staffItem} onPress={() => handleSelectStaff(item)}>
                <Text style={styles.staffName}>{item?.first_name}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.staffItem}
                onPress={handleSelectAllStaff}
              >
                <Text style={styles.staffName}>All Staffs</Text>
              </TouchableOpacity>
            }
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  staffItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  staffName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SelectSalonStaffModal;