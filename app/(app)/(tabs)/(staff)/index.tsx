import ButtonIcon from '@/components/commons/ButtonIcon';
import PendingPaymentReceipts from '@/components/PendingPaymentReceipts';
import StaffPaymentItem from '@/components/StaffPaymentItem';
import { Colors } from '@/constants/Colors';
import { AuthState, useAuthStore } from '@/store/authStore';
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { SalonPaymentUpdateState, useSalonPaymentUpdateStore } from '@/store/useSalonUpdatePaymentStore';
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
    selectedSalon,
  } = useSalonStore((state: SalonState) => state);

  const {
    getSalonServices
  } = useSalonServicesStore((state: SalonServicesState) => state);

  const {
    selectPaymentStaff,
    selectedPaymentStaffs
  } = useSalonPaymentUpdateStore((state: SalonPaymentUpdateState) => state);


  const onPaymentPress = () => {
    let staffIds = selectedPaymentStaffs.map((staff) => staff.id);

    router.push({
      pathname: '/(app)/payment-create',
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
    getSalonServices();
  }, [])

  useEffect(() => {
    getSalonStaffs();

  }, [selectedSalon])

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>

      <View>
        {
          isSalonOwner() &&
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 10,
            backgroundColor: Colors.primary.white,

          }}>
            <ButtonIcon
              iconName="people-circle-outline"
              onPress={() => router.push('/(app)/turn-management')}
              size={ms(16)}
            />
          </View>
        }

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