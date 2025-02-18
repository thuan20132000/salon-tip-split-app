import { AuthState, useAuthStore } from "@/store/authStore";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {

  const {
    isAuthenticated,
  } = useAuthStore((state: AuthState) => state)


  if (!isAuthenticated) {
    return <Redirect href={'/sign-in'} />
  }

  return (
    <Stack
      screenOptions={{
        title: 'Salon',
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="setting-modal"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>

  )
}
