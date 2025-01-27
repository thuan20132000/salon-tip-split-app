import PendingPaymentReceipts from '@/components/PendingPaymentReceipts';
import StaffPaymentItem from '@/components/StaffPaymentItem';
import { StaffRoleEnums } from '@/enums/StaffRoleEnums';
import { AuthState, useAuthStore } from '@/store/authStore';
import { SalonPaymentState, useSalonPaymentStore } from '@/store/useSalonPaymentStore';
import { SalonStaffState, useSalonStaffStore } from '@/store/useSalonStaffStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { SalonPaymentUpdateState, useSalonPaymentUpdateStore } from '@/store/useSalonUpdatePaymentStore';
import { StaffState, StaffType, useStaffStore } from '@/store/useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, s } from 'react-native-size-matters';

const StaffScreen = () => {
  const router = useRouter();
  const {
    isSalonOwner
  } = useAuthStore((state: AuthState) => state);
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

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                paddingHorizontal: ms(10),
                justifyContent: 'center'

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
                    minWidth: ms(80),
                    height: ms(80),
                    // flex:1
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
          </View>
        </View>
        {
          isSalonOwner() &&
          <PendingPaymentReceipts />
        }
      </ScrollView>
    </View>
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
    padding: ms(10),
    backgroundColor: '#03A9F4',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: ms(200),
    alignSelf: 'center',
    marginVertical: ms(30),
  },
});

export default StaffScreen;