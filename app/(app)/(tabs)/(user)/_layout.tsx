import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function StaffLayout() {
  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        {/* Add your screens here */}
        <Stack.Screen
          name="index"
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="salons"
          options={{
            title: 'Salon Management',
          }}
        />
        <Stack.Screen
          name="salon-staff"
          options={{
            title: 'Staff Management',
          }}
        />
        <Stack.Screen
          name="ticket-report"
          options={{
            title: 'Staff Ticket',
          }}
        />
        <Stack.Screen name="salon-report"
          options={{
            title: 'Salon Report',
          }}
        />
        <Stack.Screen name="salon-salary-report"
          options={{
            title: 'Salon Report',
          }}
        />
        <Stack.Screen name="setting"
          options={{
            title: 'Setting',
          }}
        />
      </Stack>
    </KeyboardProvider>
  );
}