import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { User } from '@/types/user.type';
import { AuthState, useAuthStore } from '@/store/authStore';
import ButtonText from '@/components/commons/ButtonText';
import { SalonState, useSalonStore } from '@/store/useSalonStore';


interface UserScreenProps {
  
}

const UserInfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'Not provided'}</Text>
  </View>
);


const UserScreen: React.FC<UserScreenProps> = () => {
  const {
    user,
    logout
  } = useAuthStore((state: AuthState) => state)

  const {
    initSelectedSalon
  } = useSalonStore((state:SalonState) => state);

  const handleLogout = async () => {
    try {
      await logout();
      // Router will handle navigation after logout in the auth store
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    const first = user?.first_name.charAt(0);
    const last = user?.last_name.charAt(0);
    return (first)?.toUpperCase() || user?.username.charAt(0).toUpperCase();
  };

  console.log('====================================');
  console.log('user: ', user);
  console.log('====================================');

  const showStaffManagement = () => {
    router.push('/(app)/(tabs)/(user)/salon-staff');
  }

  const showSalonManagement = () => {
    router.push('/(app)/(tabs)/(user)/salons');
  }

  useEffect(() => {
    initSelectedSalon()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>

          <Text style={styles.username}>
            {user?.username}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Information</Text>


          <UserInfoRow
            label="First Name"
            value={String(user?.first_name)}
          />
          <UserInfoRow
            label="Last Name"
            value={String(user?.last_name)}
          />

        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Management</Text>
          <ButtonText
            title="Salons"
            onPress={showSalonManagement}
            style={styles.managementItem}
          />

          <ButtonText
            title="Staffs"
            onPress={showStaffManagement}
            style={styles.managementItem}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <AntDesign name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  managementItem:{
    marginBottom: 8,
    backgroundColor: '#007AFF',
    padding: 12,
  }
});

export default UserScreen;

// Usage Example:
/*
import UserScreen from './UserScreen';
import { useAuthStore } from '../store/auth.store';

export default function ProfileRoute() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <UserScreen 
      user={user}
      onLogout={logout}
    />
  );
}
*/