import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CreateStaffAccountInput, SalonStaffType } from '@/types/staff.types';
import { authAPI } from '@/api/authAPI';
import { salonAPI } from '@/api/salonAPI';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { APIErrorType } from '@/types/api.types';





interface SalonStaffModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: CreateStaffAccountInput;
  title: string;
}

export const SalonStaffModal: React.FC<SalonStaffModalProps> = ({
  visible,
  onClose,
  initialData,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedSalon,
    getSalonStaffs,
  } = useSalonStore((state: SalonState) => state);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<CreateStaffAccountInput>({
    defaultValues: {
      first_name: initialData?.first_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      salon_id: initialData?.salon_id || selectedSalon?.id,
      commission_rate: 0,
    }
  });

  const handleAddStaff = async (data: CreateStaffAccountInput) => {
    try {
      setIsLoading(true);
      let res = await salonAPI.addSalonStaff(data);

      Alert.alert('Success', 'Staff added successfully');

      // clear form
      reset();

      getSalonStaffs();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStaff = async (data: SalonStaffType) => {

  };

  const onSubmit = (data: CreateStaffAccountInput) => {
    handleAddStaff(data);

  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView style={styles.form}>
            <Controller
              control={control}
              rules={{ required: 'First name is required' }}
              render={({ field: { onChange, value } }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={String(value)}
                    />
                    {errors.first_name && (
                      <Text style={styles.errorText}>{errors.first_name.message}</Text>
                    )}
                  </View>
                </>
              )}
              name="first_name"
            />

            <Controller
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field: { onChange, value } }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={String(value)}
                    />
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email.message}</Text>
                    )}
                  </View>
                </>
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{ required: 'Phone number is required' }}
              render={({ field: { onChange, value } }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={String(value)}
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.phone.message}</Text>
                    )}
                  </View>
                </>
              )}
              name="phone"
            />

            <Controller
              control={control}
              rules={{ required: 'Commission rate is required' }}
              render={({ field: { onChange, value } }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Commission rate</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={String(value)}
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.commission_rate?.message}</Text>
                    )}
                  </View>
                </>
              )}
              name="commission_rate"
            />

            {/* Add other form fields similarly */}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Submit</Text>
                {
                  isLoading && <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  staffCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  staffDetails: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    height: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  form: {
    maxHeight: '80%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
