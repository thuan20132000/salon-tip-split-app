import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddSalonServicesModal from '@/components/AddSalonServicesModal';
import useSalonServicesStore from '@/store/useSalonServicesStore';
import ButtonText from '@/components/commons/ButtonText';
import UpdateSalonServiceModal from '@/components/UpdateSalonServiceModal';
import { SalonServiceType, StaffServiceFilterType, StaffServiceType } from '@/types/salon.types';
import SalonServiceItem from '@/components/SalonServiceItem';
import useStaffServicesStore, { StaffServicesState } from '@/store/useStaffServicesStore';
import { useLocalSearchParams } from 'expo-router';
import StaffServiceItem from '@/components/StaffServiceItem';
import UpdateStaffServiceModal from '@/components/UpdateStaffServicesModal';  

export default function StaffServicesScreen() {
  const { staff } =  useLocalSearchParams<{ staff: string }>();
  const staff_id = JSON.parse(staff).id;

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<StaffServiceType | null>(null);
  const { staffServices, getStaffServices } = useStaffServicesStore((state: StaffServicesState) => state);
 
  const onShowUpdateServiceModal = () => {
    setShowUpdateServiceModal(true);
  }

  useEffect(() => {
    const filter: StaffServiceFilterType = {
      staff_id: staff_id,
    }
    getStaffServices(filter);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.serviceList}>
        {staffServices.map((service) => (
          <StaffServiceItem key={service.id} service={service} />
        ))}
      </ScrollView>
      <ButtonText title="Update Services" onPress={onShowUpdateServiceModal} />
      <UpdateStaffServiceModal
        visible={showUpdateServiceModal}
        onClose={() => setShowUpdateServiceModal(false)}
        service={selectedService || {} as StaffServiceType}
        currentStaffServices={staffServices}
        staffId={staff_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  serviceList: {
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 16,
    color: '#666',
  },
  addServiceForm: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
