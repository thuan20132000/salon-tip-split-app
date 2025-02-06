import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface TurnService {
  id: number;
  name: string;
  price?: number;
}

interface ServiceFormData {
  name: string;
  price: string;
}

export default function SalonServicesScreen() {
  const [services, setServices] = useState<TurnService[]>([]);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      price: '',
    }
  });

  const onSubmit = (data: ServiceFormData) => {
    try {
      const newId = Math.max(...services.map(s => s.id)) + 1;
      setServices([...services, {
        id: newId,
        name: data.name,
        price: data.price ? parseFloat(data.price) : undefined,
      }]);

      reset(); // Reset form
      Alert.alert('Success', 'Service added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add service');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.serviceList}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>
              {service.price ? `$${service.price.toFixed(2)}` : 'Price varies'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.addServiceForm}>
        <Text style={styles.formTitle}>Add New Service</Text>

        <Controller
          control={control}
          rules={{
            required: 'Service name is required'
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Service Name"
                onChangeText={onChange}
                value={value}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{
            pattern: {
              value: /^\d*\.?\d*$/,
              message: 'Please enter a valid price'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                placeholder="Price (optional)"
                keyboardType="decimal-pad"
                onChangeText={onChange}
                value={value}
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price.message}</Text>
              )}
            </View>
          )}
          name="price"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Add Service</Text>
        </TouchableOpacity>
      </View>
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
