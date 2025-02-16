import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SalonSalaryReportType, StaffSalaryReportType } from '@/types/report.types';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/receiptUtils';
import { ms, s } from 'react-native-size-matters';
import Badge from './commons/Badge';
import { helper } from '@/utils/helper';

interface SalaryReportItemProps {
  item: StaffSalaryReportType;
  onPress?: () => void;
}

const StaffSalaryReportItem: React.FC<SalaryReportItemProps> = ({
  item,
  onPress,
}) => {

  return (
    <View>
      <TouchableOpacity
        style={[styles.container]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[styles.box, { alignItems: 'flex-start' }]}>
          {/* <Text style={styles.label}>Staff</Text> */}
          <Badge
            // color="#4CAF50"
            text={item?.staff__first_name}
            textStyle={{ color: 'white', padding: 2, fontSize: s(8) }}
            containerStyle={{
              borderTopRightRadius:0,
              borderBottomLeftRadius: 0,
            }}
          />
        </View>
        <View style={styles.bodyContainer}>


          <View style={styles.box}>
            <Text style={styles.label}>Sale</Text>
            <Badge
              backgroundColor="#FF9800"
              text={formatCurrency(item.total_service_amount)}
              textStyle={{ color: 'white', padding: 2, fontSize: s(8) }}
            />
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Tips</Text>
            <Badge
              backgroundColor="#FF9800"
              text={formatCurrency(item.total_tip_amount)}
              textStyle={{ color: 'white', padding: 2, fontSize: ms(8) }}
            />
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Rate</Text>
            <Badge
              backgroundColor="#FF9800"
              text={String(item.staff__commission_rate)}
              textStyle={{ color: 'white', padding: 2, fontSize: ms(8) }}
            />
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Revenue</Text>
            <Badge
              backgroundColor="#FF9800"
              text={formatCurrency(Number(item.service_revenue))}
              textStyle={{ color: 'white', padding: 2, fontSize: ms(8) }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: ms(4),
    marginBottom: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amountsContainer: {
    flex: 1,
    gap: 2,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  bodyContainer: {
    gap: 2,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
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

export default StaffSalaryReportItem;

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