import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  totalAmount: number;
  totalTip: number;
  period?: string;
  onPeriodChange?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  totalAmount,
  totalTip,
  period,
  onPeriodChange,
}) => {
  const grandTotal = totalAmount + totalTip;

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Summary</Text>
        {period && (
          <TouchableOpacity
            style={styles.periodButton}
            onPress={onPeriodChange}
          >
            <Text style={styles.periodText}>{period}</Text>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View> */}

      {/* Amount Cards */}
      <View style={styles.cardsContainer}>
        {/* Service Amount Card */}
        <View style={[styles.card, styles.serviceCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={24} color="#4CAF50" />
            <Text style={styles.cardLabel}>Services</Text>
          </View>
          <Text style={[styles.amount, styles.serviceAmount]}>
            ${totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Tips Card */}
        <View style={[styles.card, styles.tipsCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="gift-outline" size={24} color="#FF9800" />
            <Text style={styles.cardLabel}>Tips</Text>
          </View>
          <Text style={[styles.amount, styles.tipsAmount]}>
            ${totalTip.toFixed(2)}
          </Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  periodText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  serviceCard: {
    backgroundColor: '#E8F5E9',
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
  },
  serviceAmount: {
    color: '#4CAF50',
  },
  tipsAmount: {
    color: '#FF9800',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  grandTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default SummaryCard;