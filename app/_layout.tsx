import { LoadingIndicatorModal } from "@/components/LoadingIndicatorModal";
import { intializeOneSignal } from "@/services/onesignal.service";
import { AuthState, useAuthStore } from "@/store/authStore";
import { RootState, useRootStore } from "@/store/useRootStore";
import { Redirect, Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Root() {
  const {
    initialize
  } = useAuthStore((state: AuthState) => state)
  const {
    isLoading,
    setIsLoading
  } = useRootStore((state: RootState) => state);

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      <Slot />
      <LoadingIndicatorModal visible={isLoading} />
    </>

  )
}
