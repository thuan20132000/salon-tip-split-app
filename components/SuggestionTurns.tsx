import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TurnManagementState, useTurnManagementStore } from '@/store/useTurnManagementStore'
import { StaffTurn, TurnService } from '@/types/turn.types'
import { TurnStatusEnums } from '@/enums/TurnEnums'
import dayjs from 'dayjs'
import AddStaffTurnModal from './AddStaffTurnModal'
import { Colors } from '@/constants/Colors'
import { commonStyles } from '@/utils/commonStyles'
import useSalonServicesStore, { SalonServicesState } from '@/store/useSalonServicesStore'
import { SalonServiceType } from '@/types/salon.types'
type Props = {}

const SuggestionTurns = (props: Props) => {

  const {
    staffTurns,
    salonTurnServices
  } = useTurnManagementStore((state: TurnManagementState) => state)

  const {
    getSalonServices,
    salonServices
  } = useSalonServicesStore((state: SalonServicesState) => state)

  const [selectedTurnServices, setSelectedTurnServices] = useState<SalonServiceType[]>([]);
  const [isShowAddStaffTurnModal, setIsShowAddStaffTurnModal] = useState(false);
  const [staffTurn, setStaffTurn] = useState<StaffTurn>();

  // useEffect(() => {
  //   getSuggestionStaffTurns()
  // }, [staffTurns])

  const onSelectTurnServicePress = (salonService: SalonServiceType) => {
    console.log('salonServiceSelected:: ', salonService)
    console.log('staffTurns:: ', staffTurns)
    
    if (selectedTurnServices.includes(salonService)) {
      setSelectedTurnServices(selectedTurnServices.filter((s) => s.id !== salonService.id));
    } else {
      setSelectedTurnServices([...selectedTurnServices, salonService]);
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
      return staffTurn.staff?.skills?.some((skill) => {
        console.log('skill:: ', skill)
        console.log('selectedTurnServices:: ', selectedTurnServices)
        return selectedTurnServices.map((s) => s.id).includes(Number(skill.skill))
      });
    })

    console.log('staffAvailable:: ', staffAvailable)

    // sort staffAvailable by last_turn updated_at
    staffAvailable.sort((a, b) => {
      if (a.last_turn?.updated_at == null) {
        a.last_turn = {
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 'pending',
          services: []
        }
      }
      if (b.last_turn?.updated_at == null) {
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

  const onSelectStaffTurnPress = (staffTurn: StaffTurn) => {
    console.log(staffTurn)
    setStaffTurn(staffTurn)
    setIsShowAddStaffTurnModal(true)
  }

  const hideAddStaffTurnModal = () => {
    setIsShowAddStaffTurnModal(false)
    setSelectedTurnServices([])
  }

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <View>
          <Text style={commonStyles.textH5}>Priority Level</Text>
          {
            getStaffAvailable().map((staffTurn, index) => (
              <TouchableOpacity
                style={[styles.staffItem]}
                key={index.toString()}
                onPress={() => onSelectStaffTurnPress(staffTurn)}
              >
                <Text
                  style={[styles.staffItemText]}
                >{staffTurn.staff?.first_name}</Text>
              </TouchableOpacity>
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
              salonServices.map((service, index) => (
                <TouchableOpacity
                  key={index.toString()}
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
      <AddStaffTurnModal
        visible={isShowAddStaffTurnModal}
        onClose={hideAddStaffTurnModal}
        staffTurn={staffTurn as StaffTurn}
        initialTurnServices={selectedTurnServices}
      />
    </View>
  )
}

export default SuggestionTurns

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.primary.white,
    padding: 10,
    width: 200,
    height: '100%'
  },
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#48d1cc',
    padding: 6,
    marginVertical: 2,
    borderRadius: 5
  },
  staffItemText: {
    fontSize: 16,
    fontWeight: 'bold'
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