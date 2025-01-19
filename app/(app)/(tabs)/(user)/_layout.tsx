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
        <Stack.Screen name="salon-staff" />
        <Stack.Screen name="salon" />
        <Stack.Screen name="salon-report" />
        <Stack.Screen name="salon-salary-report" />

      </Stack>
    </KeyboardProvider>
  );
}