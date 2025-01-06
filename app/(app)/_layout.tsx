import { AuthState, useAuthStore } from "@/store/authStore";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function AppLayout() {

  const {
    isAuthenticated,
  } = useAuthStore((state: AuthState) => state)


  if (!isAuthenticated) {
    return <Redirect href={'/sign-in'} />
  }

  return <Stack 
    screenOptions={{
      title: 'Salon',
    }}
  />

}
