import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { ms, s } from 'react-native-size-matters'
import { StaffTurn, Turn, TurnService } from '@/types/turn.types'
import { helper } from '@/utils/helper'
import UpdateStaffTurnModal from './UpdateStaffTurnModal'
import { formatCurrency } from '@/utils/receiptUtils'
import { TurnStatusEnums } from '@/enums/TurnEnums'

type Props = {
  onTurnServicePress?: (turn: TurnService) => void
  turn: Turn,
  staffTurn: StaffTurn
}

const StaffTurnBoxItem = ({
  onTurnServicePress,
  turn,
  staffTurn,

}: Props) => {
  const [isShowUpdateStaffTurnModal, setIsShowUpdateStaffTurnModal] = useState(false)


  const hideUpdateStaffTurnModal = () => {
    setIsShowUpdateStaffTurnModal(false)
  }

  const showUpdateStaffTurnModal = () => {
    setIsShowUpdateStaffTurnModal(true)
  }

  const getTotalTurnAmount = () => {
    let totalServiceAmount = turn?.services?.reduce((total, service) => total + Number(service?.price), 0)
    return formatCurrency(totalServiceAmount)
  }

  const getTurnServiceShortname = () => {
    let shortname = ''

    if (turn?.services.length <= 0) {
      return shortname
    }

    if (turn?.services.length <= 1) {
      shortname = helper.getInitialsText(turn?.services[0]?.name)
      return shortname
    }

    turn?.services?.map((service, index) => {
      if (index < turn?.services.length - 1) {
        shortname += helper.getInitialsText(service.name) + ', '
      } else {
        shortname += helper.getInitialsText(service.name)
      }
      return service
    })

    return shortname
  }

  const getTurnStatusStyle = () => {
    let statusStyle: ViewStyle = {}
    switch (turn.status) {
      case TurnStatusEnums.CHECK_IN:
        statusStyle = { backgroundColor: '#7fff00' }
        break
      case TurnStatusEnums.CHECK_OUT:
        statusStyle = { backgroundColor: 'red' }
        break
      case TurnStatusEnums.PAYMENT_PENDING:
        statusStyle = { backgroundColor: '#fffacd' }
        break
      case TurnStatusEnums.IN_SERVICE:
        statusStyle = { backgroundColor: '#7fffd4' }
        break

      default:
        statusStyle = { backgroundColor: 'white' }
        break
    }
    return statusStyle
  }

  return (
    <TouchableOpacity
      onPress={showUpdateStaffTurnModal}
    >
      <View style={[styles.container, getTurnStatusStyle()]}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: s(6),
            }}
            numberOfLines={1}
          >
            {getTurnServiceShortname()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{getTotalTurnAmount()}</Text>
        </View>
      </View>
      <UpdateStaffTurnModal
        visible={isShowUpdateStaffTurnModal}
        onClose={hideUpdateStaffTurnModal}
        staffTurn={staffTurn}
        updateTurn={turn}
      />
    </TouchableOpacity>
  )
}

export default StaffTurnBoxItem

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    width: ms(45),
    height: ms(45),
    borderRadius: ms(6),
  },
})