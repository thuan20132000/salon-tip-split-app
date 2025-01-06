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
        <Stack.Screen
          name="index"
          options={{
            title: 'Staff Receipts',
          }}
        />

      </Stack>
    </KeyboardProvider>
  );
}