import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';
import { SalonStaffType } from '@/types/staff.types';
import { scale } from 'react-native-size-matters';

interface StaffPaymentItemProps {
  staff?: SalonStaffType;
  onPress?: () => void;
  customStyle?: ViewStyle
}

const StaffPaymentItem: React.FC<StaffPaymentItemProps> = ({
  staff,
  customStyle,
  onPress,
}) => {

  return (
    <TouchableOpacity
      style={[styles.container, customStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Staff Info Section */}
      <Text style={styles.avatarText}>
        {staff?.first_name?.toUpperCase()}
      </Text>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  tabletContainer: {
    // marginHorizontal: 24,
    // padding: 20,
  },
  staffSection: {
    // flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabletStaffSection: {
    flex: 2,
  },
  avatarContainer: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  staffContact: {
    fontSize: 14,
    color: '#666',
  },
  paymentSection: {
    flex: 2,
    marginHorizontal: 12,
  },
  tabletPaymentSection: {
    flex: 3,
    marginHorizontal: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionSection: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
});

export default StaffPaymentItem;

// Usage Example:
/*
const PaymentsList = () => {
  const staffPayment = {
    staff: {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "123-456-7890"
    },
    paymentData: {
      totalServices: 5,
      serviceAmount: 150.00,
      tipAmount: 30.00,
      date: "2025-01-07"
    }
  };

  return (
    <StaffPaymentItem
      staff={staffPayment.staff}
      paymentData={staffPayment.paymentData}
    />
  );
};
*/