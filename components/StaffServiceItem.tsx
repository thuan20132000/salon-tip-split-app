import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SalonServiceType, StaffServiceType, UpdateStaffServiceType } from '@/types/salon.types'
import UpdateSalonServiceModal from './UpdateSalonServiceModal'
import { StaffServicesState } from '@/store/useStaffServicesStore'
import useStaffServicesStore from '@/store/useStaffServicesStore'


type Props = {
  service: StaffServiceType
}

const StaffServiceItem = ({ service }: Props) => {
  const [isActive, setIsActive] = useState(service.is_active)


  const { updateStaffService } = useStaffServicesStore((state: StaffServicesState) => state)

  const onChangeStaffServiceStatus = async (isActive: boolean) => {
    try {
      console.log("service:: ", service);
      console.log("isActive:: ", isActive);
      console.log("value:: ", isActive);
      setIsActive(isActive);

      let input: UpdateStaffServiceType = {
        is_active: isActive,
        skill_id: service.skill.id,
        staff_id: service.staff,
        id: service.id,
      }

      await updateStaffService(input);
    } catch (error) {
      setIsActive(!isActive);
      console.log("error:: ", error);
    }
  }

  useEffect(() => {
    setIsActive(service.is_active);
  }, [service.is_active]);

  return (
    <View style={styles.serviceItem}>
      <TouchableOpacity>
        <Text style={styles.serviceName}>{service.skill.name}</Text>
        <Text style={styles.servicePrice}>
          {service?.skill?.price}
        </Text>
      </TouchableOpacity>
      <View style={styles.serviceItemRight}>
        <Switch
          value={isActive}
          onValueChange={(value) => {
            onChangeStaffServiceStatus(value);
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  serviceItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 14,
  },
  serviceItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})

export default StaffServiceItem