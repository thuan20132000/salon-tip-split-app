import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function StaffLayout() {
  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          title: 'Staff Turn Tracker',
        }}
      >
        {/* Add your screens here */}
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Staff Turn Tracker',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="payment-update" 
          options={{
            headerShown: true,
            title: 'Update Payment',
          }}
        />
      </Stack>
    </KeyboardProvider>
  );
}