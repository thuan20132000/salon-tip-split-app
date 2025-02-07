import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import React, { useState } from 'react'
import { SalonServiceType, StaffServiceType, UpdateStaffServiceType } from '@/types/salon.types'
import useStaffServicesStore from '@/store/useStaffServicesStore'
import { StaffServicesState } from '@/store/useStaffServicesStore'


type Props = {
  service: SalonServiceType,
  currentStaffServices: StaffServiceType[],
  staffId: number
}

const UpdateStaffServiceItem = ({ service, currentStaffServices, staffId }: Props) => {
  const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const { updateStaffService } = useStaffServicesStore((state: StaffServicesState) => state)

  const onChangeStaffServiceStatus = async (service: SalonServiceType, isActive: boolean) => {
    try {
      console.log("service:: ", service);
      console.log("isActive:: ", isActive);
      console.log("value:: ", isActive);
      setIsActive(isActive);

    let input: UpdateStaffServiceType = {
      id: service.id,
      is_active: isActive,
      skill_id: service.id,
      staff_id: staffId,
    }

      await updateStaffService(input);
    } catch (error) {
      setIsActive(!isActive);
      console.log("error:: ", error);
    }
  }

  const checkIfServiceIsActive = (serviceId: number) => {

    return currentStaffServices.some((service) => {
      if (service.skill.id === serviceId && service.is_active) {
        return true;
      }
      return false;
    });
  }
  

  return (
    <View style={styles.serviceItem}>
      <TouchableOpacity key={service.id} style={styles.serviceItemLeft}
        onPress={() => setShowUpdateServiceModal(true)}
      >
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>
          {service?.price}
        </Text>
      </TouchableOpacity>
      <View style={styles.serviceItemRight}>
        <Switch
          value={checkIfServiceIsActive(service.id)}
          onValueChange={(value) => {
            onChangeStaffServiceStatus(service, value);
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
  serviceItemLeft: {
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
    position: 'absolute',
    right: 0,
    top: 0,
  },
})

export default UpdateStaffServiceItem