import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import { useForm, Controller } from 'react-hook-form';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
import { SalonServiceType } from '@/types/salon.types';

interface SalonServiceCategory {
  id: number;
  name: string;
}

interface AddSalonServicesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: SalonServiceCategory[];
}


const AddSalonServicesModal: React.FC<AddSalonServicesModalProps> = ({
  visible,
  onClose,
  categories,
}) => {

  const {
    addSalonService,
  } = useSalonServicesStore((state: SalonServicesState) => state)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalonServiceType>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      is_active: true,
      id: 0,
    },
  });

  const onSubmitForm = (data: SalonServiceType) => {
    addSalonService(data)
    reset();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      avoidKeyboard
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Salon Service</Text>

          <ScrollView style={styles.formContainer}>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Service name is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Service Name *</Text>
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter service name"
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter description"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="price"
              rules={{ required: 'Price is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Price *</Text>
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    value={value?.toString()}
                    onChangeText={(text) => onChange(text)}
                    placeholder="Enter price"
                    keyboardType="decimal-pad"
                  />
                  {errors.price && (
                    <Text style={styles.errorText}>{errors.price.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="duration"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    value={value?.toString()}
                    onChangeText={(text) => onChange(text)}
                    placeholder="Enter duration"
                    keyboardType="number-pad"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="is_active"
              render={({ field: { onChange, value } }) => (
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Active Status</Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
              )}
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => {
                reset();
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit(onSubmitForm)}
            >
              <Text style={[styles.buttonText, styles.submitText]}>
                Add Service
              </Text>
            </TouchableOpacity>
          </View>
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
});

export default AddSalonServicesModal;
