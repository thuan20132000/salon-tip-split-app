import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { NavigationBar } from '@/components/NavigationBar'
import StaffTurnRow from '@/components/StaffTurnRow'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore'
import ButtonText from '@/components/commons/ButtonText'
import { ms, s } from 'react-native-size-matters'
import SuggestionTurns from '@/components/SuggestionTurns'
import { useFocusEffect } from 'expo-router'

type Props = {}

const index = (props: Props) => {

  const {
    staffTurns,
    resetStaffTurns,
    initStaffServiceSkills
  } = useTurnManagementStore((state: TurnManagementState) => state)


  useEffect(() => {
    initStaffServiceSkills()
  }, [])

  // implement useFocusEffect
  // useFocusEffect(
  //   // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
  //   useCallback(() => {
  //     // Invoked whenever the route is focused.
  //     console.log('Hello, I\'m focused!');
  //     initStaffServiceSkills()

  //     // Return function is invoked whenever the route gets out of focus.
  //     return () => {
  //       console.log('This route is now unfocused.');
  //     };
  //   }, [])
  // )

  return (
    <View>
      <NavigationBar
        title="Turns"
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: ms(80) }}>
            {
              staffTurns?.map((staffTurn, index) => (
                <StaffTurnRow
                  staffTurn={staffTurn}
                  key={staffTurn.staff?.id || index}
                />
              ))
            }
            {/* <ButtonText
              title="Reset"
              onPress={resetStaffTurns}
              containerStyle={{
                width: ms(120),
                alignSelf: 'center'
              }}
            /> */}
          </ScrollView>
        </View>
        <View>
          <SuggestionTurns />
        </View>
      </View>
    </View>
  )
}

export default index