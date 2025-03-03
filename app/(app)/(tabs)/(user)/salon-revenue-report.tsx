import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType, StaffReceiptFilterInput } from '@/types/receipt.type';
import dayjs, { Dayjs } from 'dayjs';
import { receiptAPIs } from '@/api/receiptAPI';
import useSalonSalaryReportStore, { SalonSalaryReportState } from '@/store/useSalonSalaryReportStore';
import StaffSalaryReportItem from '@/components/StaffSalaryReportItem';
import SalonStaffSalaryReportFilter from '@/components/filter/StaffReportFilter';
import { StaffSalaryReportType } from '@/types/report.types';
import SalaryReportItem from '@/components/SalaryReportItem';



const SalonRevenueReportScreen: React.FC = () => {

  const [startDate, setStartDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));

  const {
    getSalonStaffSalaryReport,
    salonStaffSalaryReport,
    salonStaffSalaryReportSummary,
  } = useSalonSalaryReportStore((state: SalonSalaryReportState) => state);

  // State
  // const [receipts, setReceipts] = useState<StaffReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const onDeleteReceipt = async (receipt: StaffBillType) => {
    try {
      await receiptAPIs.deleteStaffReceipt(Number(receipt.id));
      Alert.alert('Staff Receipt is deleted successfully');
      // getStaffReceipts();
    } catch (err) {
      console.error('Error deleting receipt:', err);
    }
  }

  // useFocusEffect(
  //   // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
  //   useCallback(() => {
  //     // Invoked whenever the route is focused.
  //     let filter: SalonReceiptFilterInput = {
  //       created_at: dayjs(new Date()).format('YYYY-MM-DD'),
  //     };
  //     getStaffSalaryReport(filter);

  //     // Return function is invoked whenever the route gets out of focus.
  //     return () => {
  //       console.log('This route is now unfocused.');
  //     };
  //   }, [])
  // );

  useEffect(() => {
    getSalonStaffSalaryReport({
      created_at_range_after: startDate,
      created_at_range_before: endDate,
    });
  }, [])

  const showStaffTicketReport = (staff: StaffSalaryReportType) => {
    router.push({
      pathname: '/(app)/(tabs)/(user)/ticket-report',
      params: {
        staffId: staff.staff_id,
        startDate: staff.date,
        endDate: staff.date,
      }
    });
  }

  return (
    <View style={styles.container}>
      <SalonStaffSalaryReportFilter
        onFilter={(startDate, endDate, staffId) => {
          setStartDate(startDate);
          setEndDate(endDate);
          getSalonStaffSalaryReport({
            created_at_range_after: startDate,
            created_at_range_before: endDate,
            staff_id: staffId,
          });
          console.log('staffId:: ', staffId);
          console.log('startDate:: ', startDate);
          console.log('endDate:: ', endDate);
        }}
        summary={salonStaffSalaryReportSummary}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={salonStaffSalaryReport}
          renderItem={({ item }) =>
              // <StaffSalaryReportItem
              //   item={item}
              //   onPress={() => showStaffTicketReport(item)}
              // />
            <SalaryReportItem
              item={{
                date: item.date,
                total_service_amount: item.total_service_amount,
                total_tip_amount: item.total_tip_amount,
                total_turn: item.total_turn,
                staff_id: Number(item.staff_id),
                staff_name: item.staff__first_name,
                // staff_commission_rate: item.staff__commission_rate,
              }}
              onPress={() => showStaffTicketReport(item)}
            />
          }
          keyExtractor={(item, index) => index.toString()}
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

export default SalonRevenueReportScreen;