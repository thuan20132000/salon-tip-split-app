import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { useEffect } from 'react';


export default function TabLayout() {

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
            <Ionicons name="person" color={color} size={24} />
          ),
          title: 'Payment',
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
        name="(staff-receipt)"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt" color={color} size={24} />
          ),
          title: 'Receipt',
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
