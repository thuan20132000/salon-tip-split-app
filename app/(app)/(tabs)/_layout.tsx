import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthState, useAuthStore } from '@/store/authStore';
export default function TabLayout() {

  const {
    isSalonOwner
  } = useAuthStore((state: AuthState) => state);

  console.log('is salon owner:: ', isSalonOwner());
  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
        headerShown: false,
      }}

    >

      <Tabs.Screen
        name="(staff)"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash" color={color} size={24} />
          ),
          title: 'Payment',
          headerShown: false
        }}
      />

      <Tabs.Screen
        name="(history)"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="time" color={color} size={24} />
          ),
          title: 'Tracker',
        }}

      />
      <Tabs.Screen
        name="(user)"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={24} />
          ),
          title: 'Profile',
        }}
      />

    </Tabs>
  );
}
