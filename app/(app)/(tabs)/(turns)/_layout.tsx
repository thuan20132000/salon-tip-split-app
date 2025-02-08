import { LoadingIndicatorModal } from '@/components/LoadingIndicatorModal';
import { RootState, useRootStore } from '@/store/useRootStore';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const TurnLayout = () => {

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Add your screens here */}
        <Stack.Screen name="index"
          options={{
            headerShown: false,
            headerTitle: 'Turns',
          }}
        />
      </Stack>

    </KeyboardProvider>
  );
}

export default TurnLayout;