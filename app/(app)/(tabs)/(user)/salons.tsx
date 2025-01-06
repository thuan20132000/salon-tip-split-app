import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Salon } from '@/types/salon.types';
import { SalonState, useSalonStore } from '@/store/useSalonStore';



const SalonScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    salons,
    getMySalons,
    onSelectedSalon,
    selectedSalon
  } = useSalonStore((state:SalonState) => state);



  useEffect(() => {
    getMySalons();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  const handleSalonPress = (salon: Salon) => {
    // router.push({
    //   pathname: '/(app)/salon/[id]',
    //   params: { id: salon.id }
    // });
    onSelectedSalon(salon);

  };

  const SalonCard = ({ salon }: { salon: Salon }) => (
    <TouchableOpacity
      style={[styles.salonCard,{
        backgroundColor: selectedSalon?.id === salon.id ? '#007AFF' : 'white'
      }]}
      onPress={() => handleSalonPress(salon)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.salonName}>{salon.name}</Text>
        <AntDesign name="right" size={20} color="#666" />
      </View>

      <View style={styles.cardContent}>
        {salon.address && (
          <View style={styles.infoRow}>
            <AntDesign name="enviromento" size={16} color="#666" />
            <Text style={styles.infoText}>{salon.address}</Text>
          </View>
        )}

        {salon.phone && (
          <View style={styles.infoRow}>
            <AntDesign name="phone" size={16} color="#666" />
            <Text style={styles.infoText}>{salon.phone}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <AntDesign name="mail" size={16} color="#666" />
          <Text style={styles.infoText}>{salon.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <FlatList
        data={salons}
        renderItem={({ item }) => <SalonCard salon={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No salons found</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
      // onPress={() => router.push('/(app)/salon/new')}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  salonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SalonScreen;