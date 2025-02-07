import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { StaffServiceType } from '@/types/salon.types'
import UpdateSalonServiceModal from './UpdateSalonServiceModal'


type Props = {
  service: StaffServiceType
}

const StaffServiceItem = ({ service }: Props) => {
  const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false)

  return (
    <View>

      <TouchableOpacity key={service.id} style={styles.serviceItem}
        onPress={() => setShowUpdateServiceModal(true)}
      >
        <Text style={styles.serviceName}>{service.skill.name}</Text>
        <Text style={styles.servicePrice}>
          {service?.skill?.price}
        </Text>
      </TouchableOpacity>
     
    </View>
  )
}

const styles = StyleSheet.create({
  serviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 14,
  },
})

export default StaffServiceItem