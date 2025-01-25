// screens/SalonStaffScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SalonStaffType } from '@/types/staff.types';
import { SalonStaffModal } from '@/components/SalonStaffModal';
import { SalonStaffState, useSalonStaffStore } from '@/store/useSalonStaffStore';
import { AuthState, useAuthStore } from '@/store/authStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';

export default function SalonStaffScreen() {
  const [staff, setStaff] = useState<SalonStaffType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  const {
    getSalonStaffs,
    salonStaffs
  } = useSalonStore((state: SalonState) => state);

  const {
    user
  } = useAuthStore((state: AuthState) => state);

  const fetchStaff = async () => {
    setIsLoading(true);

  };

  useEffect(() => {
    getSalonStaffs();
  }, []);



  const handleDeleteStaff = async (staffId: number) => {

  };

  const renderStaffItem = ({ item }: { item: SalonStaffType }) => (
    <View style={styles.staffCard}>
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{item.first_name}</Text>
        <Text style={styles.staffDetails}>{item.phone}</Text>
        {item.email && <Text style={styles.staffDetails}>{item.email}</Text>}
      </View>

      {/* <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => {
            setSelectedStaff(item);
            setModalVisible(true);
          }}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteStaff(Number(item?.id))}
          style={styles.deleteButton}
        >
          <AntDesign name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedStaff(null);
          setModalVisible(true);
        }}
      >
        <AntDesign name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Staff</Text>
      </TouchableOpacity>

      <FlatList
        data={salonStaffs}
        renderItem={renderStaffItem}
        keyExtractor={(item) => String(item?.id?.toString())}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchStaff}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <SalonStaffModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedStaff(null);
        }}
        // initialData={{
        //   first_name: selectedStaff?.first_name || '',
        //   phonenumber: selectedStaff?.phone || '',
        //   email: selectedStaff?.email || '',
        //   password: '',
        //   password2: '',
        //   username: selectedStaff?.phone || '',
        // }}
        title={selectedStaff ? 'Edit Staff' : 'Add Staff'}
      />
    </View>
  );
}

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
    maxHeight: '80%',
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

