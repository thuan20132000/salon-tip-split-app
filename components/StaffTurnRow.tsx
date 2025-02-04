import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import StaffTurnBoxItem from './StaffTurnBoxItem'
import UpdateStaffTurnModal from './UpdateStaffTurnModal'
import { StaffTurn } from '@/types/turn.types'
import ButtonIcon from './commons/ButtonIcon'
import AddStaffTurnModal from './AddStaffTurnModal'
import { s } from 'react-native-size-matters'

type Props = {
  staffTurn: StaffTurn
}

const StaffTurnRow = ({
  staffTurn,
}: Props) => {
  const [isShowUpdateStaffTurnModal, setIsShowUpdateStaffTurnModal] = useState(false)
  const [isShowAddStaffTurnModal, setIsShowAddStaffTurnModal] = useState(false)


  const hideAddStaffTurnModal = () => {
    setIsShowAddStaffTurnModal(false)
  }

  const showAddStaffTurnModal = () => {
    setIsShowAddStaffTurnModal(true)
  }

  return (
    <View style={[styles.container]}>
      <View style={{ width: s(30) }}>
        <Text>{staffTurn.staff?.first_name}</Text>
      </View>
      <View style={[styles.staffTurnsContainer]}>
        <ScrollView horizontal
          style={{
            paddingRight:s(50)
          }}
          contentContainerStyle={{
            paddingRight:s(30)
          }}
        >
          {
            staffTurn.turns.map((turn, index) => (
              <StaffTurnBoxItem
                key={index.toString()}
                turn={turn}
                staffTurn={staffTurn}
              />
            ))
          }
          <ButtonIcon
            iconName='add-circle'
            onPress={showAddStaffTurnModal}
            color='blue'
          />
        </ScrollView>
      </View>

      <AddStaffTurnModal
        visible={isShowAddStaffTurnModal}
        onClose={hideAddStaffTurnModal}
        staffTurn={staffTurn}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffTurnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
})

export default StaffTurnRow