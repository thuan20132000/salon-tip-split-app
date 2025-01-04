import { StaffBillType } from '@/types/receipt.type';
import { formatCurrency, formatDateTime, formatPercentage, handleNumberToPercent } from '@/utils/receiptUtils';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SubText from './commons/SubText';
import Badge from './commons/Badge';
import ButtonIcon from './commons/ButtonIcon';

type BillStatus = 'PENDING' | 'PAID' | 'CANCELLED';

interface StaffBillProps {
  staffName?: string;
  servicePrice?: number;
  serviceTip?: number;
  discount?: number;
  discountPercentage?: number;
  status?: BillStatus;
  onStatusChange?: (newStatus: BillStatus) => void;
  staffBill?: StaffBillType;
  onDeletePress?: () => void;
}





const StatusBadge: React.FC<{ status: BillStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'PAID':
        return '#4CAF50';
      case 'PENDING':
        return '#FFA000';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const StaffBillItem: React.FC<StaffBillProps> = ({
  staffName,
  staffBill,
  onStatusChange,
  onDeletePress
}) => {

  const BillRow = ({ label, value }: { label: string; value: string | JSX.Element }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );

  const handleStatusChange = (newStatus: BillStatus) => {
    onStatusChange?.(newStatus);
  };

  const renderDiscount = () => {
    if (staffBill?.discount_percent) {
      return `${formatCurrency(Number(staffBill?.discount_price))} (${handleNumberToPercent(Number(staffBill?.discount_percent))})`;
    }
    return '0';
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.staffName}>{staffName}</Text>
        <StatusBadge status={'PAID'} />
        <ButtonIcon
          iconName='trash'
          color="red"
          size={24}
          onPress={onDeletePress as any}
          containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
        />
      </View>
      <View style={styles.header}>
        <Badge
          text={staffBill?.staff?.first_name?.toString()}
          textStyle={{ fontSize: 16, fontWeight: 'bold' }}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <BillRow
            label="Service Price: "
            value={formatCurrency(Number(staffBill?.service_amount))}
          />
          <BillRow
            label="Discount: "
            value={renderDiscount()}
          />
          <BillRow
            label="Tip: "
            value={formatCurrency(Number(staffBill?.tip_amount))}
          />

          <View style={styles.divider} />
        </View>
        <View>
        </View>
      </View>
      <SubText>
        <Text>{formatDateTime(String(staffBill?.created_at))}</Text>
      </SubText>
      {onStatusChange && (
        <View style={styles.statusActions}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleStatusChange('PAID')}
          >
            <Text style={styles.statusButtonText}>Mark Paid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#FFA000' }]}
            onPress={() => handleStatusChange('PENDING')}
          >
            <Text style={styles.statusButtonText}>Mark Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleStatusChange('CANCELLED')}
          >
            <Text style={styles.statusButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  statusActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StaffBillItem;

// Usage Example:
/*
const App = () => {
  const [billStatus, setBillStatus] = useState<BillStatus>('PENDING');

  return (
    <View style={{ padding: 16 }}>
      <StaffBillComponent
        staffName="John Doe"
        servicePrice={100.00}
        serviceTip={20.00}
        discount={15.00}
        discountPercentage={15}
        status={billStatus}
        onStatusChange={(newStatus) => setBillStatus(newStatus)}
      />
    </View>
  );
};
*/