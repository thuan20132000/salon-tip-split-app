import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SettingState, useSettingsStore } from '@/store/useSettingsStore';
import SwitchButton from '@/components/SwitchButton';
import Dialog from "react-native-dialog";
import SettingItem from '@/components/settings/SettingItem';
import ButtonIcon from '@/components/commons/ButtonIcon';
import { helper } from '@/utils/helper';


const SettingScreen = () => {
  const {
    isAllowAccessManagement,
    setAllowAccessManagement,
    verifyPasscode,
    getSalonSettings,
    salonSettings,
    setSalonSettings
  } = useSettingsStore((state: SettingState) => state);

  const [visible, setVisible] = useState(false);
  const [settingPasscode, setSettingPasscode] = useState('');

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
  };


  const showStaffManagement = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/salon-staff');
  }

  const showSalonManagement = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/salons');
  }

  const showTicketReport = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/ticket-report');
  }

  const showSalonReport = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/salon-report');
  }

  const showSalonRevenueReport = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/salon-revenue-report');
  }

  const showSalaryReport = () => {
    if (!canAccessManagement()) {
      return;
    }
    router.push('/(app)/(tabs)/(user)/salon-salary-report');
  }

  const showSettings = () => {
    router.push('/(app)/(tabs)/(user)/setting');
  }

  const showSalonService = () => {
    router.push('/(app)/(tabs)/(user)/salon-services');
  }

  const canAccessManagement = () => {
    if (!isAllowAccessManagement) {
      Alert.alert('Access Denied', 'You are not allowed to access this feature.')
      return false;
    }
    return true;
  }

  const showSalonServiceReport = () => {
    router.push('/(app)/(tabs)/(user)/ticket-report');
  }

  const showSettingModal = () => {
    router.push('/(app)/setting-modal');
  }

  useEffect(() => {
    getSalonSettings()
  }, [])

  return (
    <ScrollView style={styles.container}>

      <View style={styles.container}>
        <StatusBar style="dark" />


        <View style={{
          padding: 16,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <SettingItem label="Salon Salary Report" onPress={showSalaryReport} />
          <SettingItem label="Salon Service Report" onPress={showSalonServiceReport} />
          <SettingItem label="Salon Revenue Report" onPress={showSalonRevenueReport} />
          <SettingItem label="Staff Report" onPress={showSalonReport} />
          <SettingItem label="Staffs" onPress={showStaffManagement} />
          <SettingItem label="Services" onPress={showSalonService} />
          <SettingItem label="Salon" onPress={showSalonManagement} />
          {/* <SettingItem label="Salon Revenue Report" onPress={showSalonRevenueReport} /> */}
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            padding: 16,
            gap: 16,
            backgroundColor: 'white',
            borderRadius: 12,
            margin: 16,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
            <Text>Allow Access Management</Text>
            <SwitchButton
              value={isAllowAccessManagement}
              onValueChange={(value) => {
                if (value === true) {
                  showDialog();
                } else {
                  setAllowAccessManagement(value);
                }
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
            <Text>Setup Tax</Text>
            <Text>{helper.decimalToPercentage(salonSettings?.tax_rate)}%</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
            <Text>Setup Logo</Text>
            <Image
              source={{ uri: salonSettings?.logo_url }}
              style={{ width: 40, height: 40 }}
            />
          </View>
          <ButtonIcon
            iconName="pencil"
            onPress={showSettingModal}
          />
        </View> 
        <View style={styles.dialogContainer}>
          <Dialog.Container visible={visible}>
            <Dialog.Title>Verify passcode</Dialog.Title>
            <Dialog.Description>
              Please enter your passcode to proceed
            </Dialog.Description>
            <Dialog.Input value={settingPasscode} onChangeText={(text) => setSettingPasscode(text)} />
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Confirm" onPress={() => {
              if (verifyPasscode(settingPasscode)) {
                setAllowAccessManagement(true);
                setSettingPasscode('');
                setVisible(false);
              } else {
                Alert.alert('Invalid passcode', 'Please enter the correct passcode');
              }
            }} />
          </Dialog.Container>
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dialogContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  salonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingScreen;