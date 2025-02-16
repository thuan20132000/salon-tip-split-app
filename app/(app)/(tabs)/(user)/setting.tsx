import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Salon } from '@/types/salon.types';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import SwitchButton from '@/components/SwitchButton';
import { SettingState, useSettingsStore } from '@/store/useSettingsStore';
import ButtonText from '@/components/commons/ButtonText';
import Dialog from "react-native-dialog";
import SettingItem from '@/components/settings/SettingItem';


const SettingScreen = () => {
  const {
    isAllowAccessManagement,
    setAllowAccessManagement,
    verifyPasscode
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

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
      <View style={{
        flex: 1,
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <SettingItem label="Salon Salary Report" onPress={showSalaryReport} />
        <SettingItem label="Salon Service Report" onPress={showSalonServiceReport} />
        <SettingItem label="Staff Report" onPress={showSalonReport} />
        <SettingItem label="Staffs" onPress={showStaffManagement} />
        <SettingItem label="Services" onPress={showSalonService} />
        <SettingItem label="Salon" onPress={showSalonManagement} />
        {/* <SettingItem label="Salon Ticket Report" onPress={showSalonTicketReport} /> */}
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