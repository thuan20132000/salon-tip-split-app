import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SalonServiceType } from '@/types/salon.types'
import UpdateSalonServiceModal from './UpdateSalonServiceModal'


type Props = {
  service: SalonServiceType
}

const SalonServiceItem = ({ service }: Props) => {
  const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false)

  return (
    <View>

      <TouchableOpacity key={service.id} style={styles.serviceItem}
        onPress={() => setShowUpdateServiceModal(true)}
      >
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>
          {service?.price}
        </Text>
      </TouchableOpacity>
      <UpdateSalonServiceModal
        visible={showUpdateServiceModal}
        onClose={() => setShowUpdateServiceModal(false)}
        categories={[]}
        service={service}
      />
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

export default SalonServiceItem