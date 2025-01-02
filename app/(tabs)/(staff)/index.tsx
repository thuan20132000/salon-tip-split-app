import { SalonPaymentState, useSalonPaymentStore } from '@/store/useSalonPaymentStore';
import { SalonStaffState, useSalonStaffStore } from '@/store/useSalonStaffStore';
import { StaffState, StaffType, useStaffStore } from '@/store/useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const StaffScreen = () => {
  const router = useRouter();
  const {
    getSalonStaffs,
    salonStaffs,
    // selectPaymentStaff,
    // selectedPaymentStaffs,
  } = useSalonStaffStore((state: SalonStaffState) => state);

  const {
    selectPaymentStaff,
    selectedPaymentStaffs
  } = useSalonPaymentStore((state:SalonPaymentState) => state);




  const onPaymentPress = () => {
    let staffIds = selectedPaymentStaffs.map((staff) => staff.id);
    router.push({
      pathname: '/payment',
      params: {
        staff_ids: JSON.stringify(staffIds),
      },
    });
  }

  const onSelectStaff = (staff: SalonStaffType) => {
    selectPaymentStaff(staff);
  }

  useEffect(() => {
    getSalonStaffs();
  }, [])

  console.log("salonStaffs", salonStaffs);


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
        {salonStaffs?.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            onPress={() => onSelectStaff(staff)}
            style={[
              styles.staffBoxContainer,
              selectedPaymentStaffs.includes(staff) && styles.selectedStaffBox,
            ]}
          >
            <View key={staff.id} style={styles.staffBox}>
              <Text style={styles.staffName}>{staff.first_name}</Text>
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