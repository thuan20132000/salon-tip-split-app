import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SalonSalaryReportType } from '@/types/report.types';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/receiptUtils';

interface SalaryReportItemProps {
  item: SalonSalaryReportType;
  onPress?: () => void;
}

const SalaryReportItem: React.FC<SalaryReportItemProps> = ({
  item,
  onPress,
}) => {

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>

      <View style={styles.amountsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Sale:</Text>
          <Text style={styles.amount}>{formatCurrency(item.total_service_amount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Turns:</Text>
          <Text style={styles.amount}>{item.total_turn}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Tips:</Text>
          <Text style={styles.amount}>{item.total_tip_amount}</Text>
        </View>
        {/* <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{item.total_turn}</Text>
        </View> */}
      </View>

      {onPress && (
        <View style={styles.iconContainer}>
          <AntDesign name="right" size={16} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  dateContainer: {
    flex: 1.2,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amountsContainer: {
    flex: 2,
    gap: 4,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
  },
  amount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',

  },
  totalRow: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  iconContainer: {
    marginLeft: 12,
  },
});

export default SalaryReportItem;

// Usage Example:
/*
const SalaryReport = () => {
  return (
    <View style={{ padding: 16 }}>
      <SalaryReportItem
        date="2025-01-06"
        totalServiceAmount={94.0}
        totalTipAmount={0.0}
        onPress={() => console.log('Item pressed')}
      />
    </View>
  );
};
*/