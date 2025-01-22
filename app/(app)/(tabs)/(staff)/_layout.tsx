import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function StaffLayout() {
  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Add your screens here */}
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="payment-create" 
          options={{
            headerShown: true,
            title: 'Create Payment',
          }}
        />
      </Stack>
    </KeyboardProvider>
  );
}