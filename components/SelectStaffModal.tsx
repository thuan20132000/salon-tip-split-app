import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { Text } from 'react-native';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { SalonStaffType } from '@/types/staff.types';

interface Staff {
  id: number;
  name: string;
}

interface SelectStaffModalProps {
  visible: boolean;
  onSelect: (staffId: SalonStaffType) => void;
  onCancel: () => void;
}

const SelectStaffModal: React.FC<SelectStaffModalProps> = ({ visible, onSelect, onCancel }) => {

  const {
    salonStaffs,
  } = useSalonStore((state: SalonState) => state);



  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Staff</Text>
          <ScrollView>
            {salonStaffs?.map((staff) => (
              <TouchableOpacity
                key={staff.id}
                style={styles.staffItem}
                onPress={() => onSelect(staff)}
              >
                <Text style={styles.staffName}>{staff.first_name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.staffItem}
              onPress={() => onSelect({ id: undefined, first_name: 'ALL' })}
            >
              <Text style={styles.staffName}>ALL</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onCancel()}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectStaffModal;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  applyButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  staffItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  staffName: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
  },
});
