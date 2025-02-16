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
import { useFocusEffect } from 'expo-router';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType, StaffReceiptFilterInput } from '@/types/receipt.type';
import dayjs, { Dayjs } from 'dayjs';
import { receiptAPIs } from '@/api/receiptAPI';
import SalaryReportItem from '@/components/SalaryReportItem';
import useSalonSalaryReportStore, { SalonSalaryReportState } from '@/store/useSalonSalaryReportStore';
import SalonReportFilter from '@/components/SalonReportFilter';
import { SalonSalaryReportType } from '@/types/report.types';
import { router } from 'expo-router';

const SalonReportScreen: React.FC = () => {

  const {
    getSalaryReport,
    salaryReport,
    resetSalaryReport,
  } = useSalonSalaryReportStore((state: SalonSalaryReportState) => state);

  // State
  // const [receipts, setReceipts] = useState<StaffReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const onShowSalonTicketReport = (report: SalonSalaryReportType) => {
    
    router.push({
      pathname: '/(app)/(tabs)/(user)/ticket-report',
      params: {
        startDate: report.date,
        endDate: report.date,
        staffId: report.staff_id,
      }
    });
  }

  useEffect(() => {
    return () => {
      resetSalaryReport();
    }
  }, []);

  return (
    <View style={styles.container}>
      <SalonReportFilter
        onFilter={(startDate, endDate, staffId) => {
          getSalaryReport({
            created_at_range_after: startDate,
            created_at_range_before: endDate,
            staff: staffId,
          });
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={salaryReport}
          renderItem={({ item }) =>
            <SalaryReportItem
              item={item}
              onPress={() => onShowSalonTicketReport(item)}
            />
          }
          keyExtractor={(item) => item?.date?.toString() || ''}
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

export default SalonReportScreen;