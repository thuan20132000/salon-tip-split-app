import { intializeOneSignal } from "@/services/onesignal.service";
import { AuthState, useAuthStore } from "@/store/authStore";
import { Redirect, Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Root() {
  const {
    initialize
  } = useAuthStore((state: AuthState) => state)

  useEffect(() => {
    initialize()
  }, [])

  return (
       <Slot />
  )
}
