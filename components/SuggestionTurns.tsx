import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore'
import { TurnService } from '@/types/turn.types'
import { TurnStatusEnums } from '@/enums/TurnEnums'
import dayjs from 'dayjs'
type Props = {}

const SuggestionTurns = (props: Props) => {

  const {
    staffTurns,
    getSuggestionStaffTurns,
    initialTurnService
  } = useTurnManagementStore((state: TurnManagementState) => state)

  const [selectedTurnServices, setSelectedTurnServices] = useState<TurnService[]>([]);

  useEffect(() => {
    getSuggestionStaffTurns()
  }, [staffTurns])

  const onSelectTurnServicePress = (turnService: TurnService) => {
    if (selectedTurnServices.includes(turnService)) {
      setSelectedTurnServices(selectedTurnServices.filter((s) => s.id !== turnService.id));
    } else {
      setSelectedTurnServices([...selectedTurnServices, turnService]);
    }
    // update staffTurns priority based on last turnService price
  }

  const getStaffAvailable = () => {
    let staffAvailable = staffTurns.filter((staffTurn) => {
      if (staffTurn.last_turn && staffTurn.last_turn.status === TurnStatusEnums.IN_SERVICE) {
        return false;
      }
      return staffTurn;
    })

    // filter staffAvailable by selectedTurnServices
    staffAvailable = staffAvailable.filter((staffTurn) => {
      return staffTurn.staff?.skills?.some((skill) => selectedTurnServices.map((s) => s.id).includes(skill.id));
    })

    // sort staffAvailable by last_turn updated_at
    staffAvailable.sort((a, b) => {
      if(a.last_turn == null) {
        a.last_turn = {
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'pending',
          services: []
        }
      }
      if(b.last_turn == null) {
        b.last_turn = {
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'pending',
          services: []
        }
      }

      if (a.last_turn && b.last_turn) {
        return new Date(a?.last_turn?.updated_at).getTime() - new Date(b?.last_turn?.updated_at).getTime();
      }
      return 0;
    })

    // if a has no last_turn, then sort by staffTurn id
    


    // const staffAvailableWithTurns = staffAvailable.map((staffTurn) => {
    return staffAvailable
  }


  return (
    <View style={[styles.container]}>
      <ScrollView>
        <View>
          <Text>Staff Priority</Text>
          {
            getStaffAvailable().map((staffTurn, index) => (
              <View style={[styles.staffItem]}>
                <Text key={index.toString()}>{staffTurn.staff?.first_name}</Text>
              </View>
            ))
          }
        </View>
        <View style={{ marginTop: 20 }}>
          <Text>Services</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
          }}>
            {
              initialTurnService.map((service, index) => (
                <TouchableOpacity
                  style={[styles.serviceItem, selectedTurnServices.includes(service) ? { backgroundColor: 'lightgreen' } : {}]}
                  onPress={() => onSelectTurnServicePress(service)}
                >
                  <Text key={index.toString()}>{service.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default SuggestionTurns

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    width: 200
  },
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'coral',
    padding: 2,
    marginVertical: 2,
    borderRadius: 5
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 2,
    marginVertical: 2,
    borderRadius: 5,
    width: 80,
    height: 80
  }
})