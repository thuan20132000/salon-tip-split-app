import { StaffState, StaffType, useStaffStore } from '@/store/useStaffStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const StaffScreen = () => {
  const router = useRouter();
  const {
    staffList,
    selectedPaymentStaffs,
    addPaymentStaffs,
    removePaymentStaffs
  } = useStaffStore((state: StaffState) => state);

  // const [selectedStaff, setSelectedStaff] = React.useState<StaffType[]>([]);


  const onStaffPress = (staff: StaffType) => {
    if (selectedPaymentStaffs.includes(staff)) {
      removePaymentStaffs(staff);
      return;
    }

    addPaymentStaffs(staff);
  }



  const onPaymentPress = () => {
    let staffIds = selectedPaymentStaffs.map((staff) => staff.id);
    router.push({
      pathname: '/payment',
      params: {
        staff_ids: JSON.stringify(staffIds),
      },
    });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
      >
        {staffList.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            onPress={() => onStaffPress(staff)}
            style={[
              styles.staffBoxContainer,
              selectedPaymentStaffs.includes(staff) && styles.selectedStaffBox,
            ]}
          >
            <View key={staff.id} style={styles.staffBox}>
              <Text style={styles.staffName}>{staff.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={onPaymentPress}
        style={styles.startPaymentButton}
        disabled={selectedPaymentStaffs.length === 0}

      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Start Payment</Text>
      </TouchableOpacity>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flexDirection: 'row',
  },
  staffBoxContainer: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedStaffBox: {
    justifyContent: 'center',
    backgroundColor: '#ffd33d',
    borderColor: 'blue',
  },
  staffBox: {
    // width: '90%',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  startPaymentButton: {
    padding: 16,
    backgroundColor: '#03A9F4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '50%',
    alignSelf: 'center'
  },
});

export default StaffScreen;