import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { TurnStatusEnums } from '@/enums/TurnEnums'


const DEFAULT_TURN_STATUS = [
  {
    id: TurnStatusEnums.IN_SERVICE,
    label: TurnStatusEnums.IN_SERVICE,
  },
  {
    id: TurnStatusEnums.PAID,
    label: TurnStatusEnums.PAID,
  },
  {
    id: TurnStatusEnums.PAYMENT_PENDING,
    label: TurnStatusEnums.PAYMENT_PENDING,
  }
]

type Props = {
  onSelectTurnStatusPress?: (turnStatus: TurnStatusEnums) => void;
  selectedTurnStatus?: string | TurnStatusEnums;
}

const TurnStatusList = (props: Props) => {
  // const [selectedService, setSelectedService] = useState<TurnService[]>(updateTurn.services);
  const [selectedTurnStatus, setSelectedTurnStatus] = useState(props.selectedTurnStatus);

  const onSelectTurnStatus = (turnStatus: TurnStatusEnums) => {
    setSelectedTurnStatus(turnStatus)
    if (props.onSelectTurnStatusPress) {
      props.onSelectTurnStatusPress(turnStatus)
    }
  }

  return (
    <View>
      <ScrollView horizontal >
        {
          DEFAULT_TURN_STATUS.map(({ id, label }, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={[
                styles.itemBox,
                selectedTurnStatus === id && { backgroundColor: 'blue' }
              ]}
              onPress={() => onSelectTurnStatus(id)}
            >
              <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  )
}

export default TurnStatusList

const styles = StyleSheet.create({
  itemBox: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    backgroundColor: '#ffd33d',
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
  },
})