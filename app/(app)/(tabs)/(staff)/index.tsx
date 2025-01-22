import StaffPaymentItem from '@/components/StaffPaymentItem';
import { SalonPaymentState, useSalonPaymentStore } from '@/store/useSalonPaymentStore';
import { SalonStaffState, useSalonStaffStore } from '@/store/useSalonStaffStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { SalonPaymentUpdateState, useSalonPaymentUpdateStore } from '@/store/useSalonUpdatePaymentStore';
import { StaffState, StaffType, useStaffStore } from '@/store/useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const StaffScreen = () => {
  const router = useRouter();
  // const {
  //   getSalonStaffs,
  //   salonStaffs,
  //   // selectPaymentStaff,
  //   // selectedPaymentStaffs,
  // } = useSalonStaffStore((state: SalonStaffState) => state);

  const {
    getSalonStaffs,
    salonStaffs,
    initSelectedSalon,
    selectedSalon
  } = useSalonStore((state: SalonState) => state);

  const {
    selectPaymentStaff,
    selectedPaymentStaffs
  } = useSalonPaymentUpdateStore((state: SalonPaymentUpdateState) => state);




  const onPaymentPress = () => {
    let staffIds = selectedPaymentStaffs.map((staff) => staff.id);

    router.push({
      pathname: '/payment-create',
      params: {
        staff_ids: JSON.stringify(staffIds),
      },
    });
  }

  const onSelectStaff = (staff: SalonStaffType) => {
    selectPaymentStaff(staff);
  }

  useEffect(() => {
    initSelectedSalon();
  }, [])

  useEffect(() => {
    getSalonStaffs();

  }, [selectedSalon])


  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View
        style={{
          flex: 1,
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
      >
        {salonStaffs?.map((staff) => (

          <StaffPaymentItem
            key={staff.id}
            staff={staff}
            onPress={() => onSelectStaff(staff)}
            customStyle={{
              backgroundColor: selectedPaymentStaffs.includes(staff) ? '#ffd33d' : 'white',
              borderColor: selectedPaymentStaffs.includes(staff) ? 'blue' : 'white',
            }}

          />
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
    marginTop: 120,
    width: '50%',
    alignSelf: 'center',
  },
});

export default StaffScreen;