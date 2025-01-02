import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterBar from '@/components/FilterBar';
import useStaffReceiptStore, { StaffReceiptStore } from '@/store/useStaffReceiptStore';
import { StaffBillType } from '@/types/receipt.type';
import { useFocusEffect } from 'expo-router';
import { formatCurrency, formatDateTime } from '@/utils/receiptUtils';
import dayjs from 'dayjs';
import StaffBillItem from '@/components/StaffBillItem';

// Interfaces
// interface Staff {
//   id: number;
//   name: string;
// }

// interface Receipt {
//   id: number;
//   total_amount: number;
//   receipt_number: string;
//   created_at: string;
// }

// interface StaffReceipt {
//   id: number;
//   staff: Staff;
//   receipt: Receipt;
//   service_amount: number;
//   tip_amount: number;
//   service_name: string | null;
//   status: boolean;
//   created_at: string;
//   updated_at: string;
// }

interface FilterValues {
  date: Date | null;
  dateTime: Date | null;
  // staff: Staff | null;
}

const StaffReceiptScreen: React.FC = () => {

  const {
    staffBills,
    getStaffReceipts
  } = useStaffReceiptStore((state: StaffReceiptStore) => state);

  // State
  // const [receipts, setReceipts] = useState<StaffReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    // fetchStaffList();
    // fetchStaffReceipts();
  }, []);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log('Hello, Im focused!');
      getStaffReceipts()
      // loadReceipts();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );





  // Render receipt item
  const renderReceiptItem = ({ item }: { item: StaffBillType }) => {
    // const formattedDate = new Date(item.created_at).toLocaleDateString();
    // const formattedTime = new Date(item.created_at).toLocaleTimeString();

    return (
      <TouchableOpacity style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Text style={styles.staffName}>{item.staff?.first_name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status ? '#4CAF50' : '#FFA000' }
          ]}>
            <Text style={styles.statusText}>
              {item.status ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.receiptDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              Salon Receipt: {item.receipt?.id}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cut-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              Service: {item.service_name || 'N/A'}
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Service</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(Number(item.service_amount))}
              </Text>
            </View>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Tip</Text>
              <Text style={styles.amountValue}>
                ${item.tip_amount}
              </Text>
            </View>
          </View>

          <View style={styles.timeStamp}>
            <Ionicons name="time-outline" size={16} color="#999" />
            <Text style={styles.timeText}>
              Created on {dayjs(item.created_at?.toString()).format('DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FilterBar
      // onApplyFilters={handleFilters}
      // staffList={salonStaffs}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={staffBills}
          renderItem={({ item }) => <StaffBillItem staffBill={item} />}
          keyExtractor={(item) => item?.id?.toString() || ''}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No receipts found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  receiptDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    color: '#007AFF',
  },
  timeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  timeText: {
    fontSize: 13,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
});

export default StaffReceiptScreen;