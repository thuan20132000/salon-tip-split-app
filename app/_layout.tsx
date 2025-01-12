import { intializeOneSignal } from "@/services/onesignal.service";
import { AuthState, useAuthStore } from "@/store/authStore";
import { Redirect, Slot, Stack } from "expo-router";
import { useEffect } from "react";

export default function Root() {
  const {
    isAuthenticated,
    initialize
  } = useAuthStore((state: AuthState) => state)

  useEffect(() => {
    intializeOneSignal()
    initialize()
  }, [])

  return <Slot />
}
