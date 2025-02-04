import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationBar } from '@/components/NavigationBar'
import StaffTurnRow from '@/components/StaffTurnRow'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore'
import ButtonText from '@/components/commons/ButtonText'
import { ms, s } from 'react-native-size-matters'
import SuggestionTurns from '@/components/SuggestionTurns'

type Props = {}

const index = (props: Props) => {

  const {
    staffTurns,
    initStaffTurns,
    resetStaffTurns
  } = useTurnManagementStore((state: TurnManagementState) => state)


  useEffect(() => {
    initStaffTurns()
  }, [])

  return (
    <View>
      <NavigationBar
        title="Turns"
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: ms(80) }}>
            {
              staffTurns.map((staffTurn, index) => (
                <StaffTurnRow
                  staffTurn={staffTurn}
                />
              ))
            }
            <ButtonText
              title="Reset"
              onPress={resetStaffTurns}
              containerStyle={{
                width: ms(120),
                alignSelf: 'center'
              }}
            />
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