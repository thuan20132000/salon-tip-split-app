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
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import StaffBillItem from '@/components/StaffBillItem';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType, StaffReceiptFilterInput } from '@/types/receipt.type';
import dayjs, { Dayjs } from 'dayjs';
import { receiptAPIs } from '@/api/receiptAPI';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import TicketReportFilter from '@/components/TicketReportFilter';
import { RootState, useRootStore } from '@/store/useRootStore';
import { ms } from 'react-native-size-matters';
import ButtonIcon from '@/components/commons/ButtonIcon';
import { AuthState, useAuthStore } from '@/store/authStore';

const TicketReportScreen: React.FC = () => {

  const filter = useLocalSearchParams();
  const staffId = filter.staffId as string;
  const [startDate, setStartDate] = useState<string>(filter.startDate as string);
  const [endDate, setEndDate] = useState<string>(filter.endDate as string);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const {
    salonStaffBills,
    getSalonStaffBills,
    salonStaffs,
    sendSalonStaffBillsToEmail,
  } = useSalonStore((state: SalonState) => state);

  // State
  // const [receipts, setReceipts] = useState<StaffReceipt[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const {
    isLoading,
    setIsLoading,
  } = useRootStore((state: RootState) => state);

  const {
    isAuthenticated,
    isSalonOwner
  } = useAuthStore((state: AuthState) => state);

  const onDeleteReceipt = async (receipt: StaffBillType) => {
    try {
      setIsLoading(true);
      await receiptAPIs.deleteStaffReceipt(Number(receipt.id));
      Alert.alert('Staff Receipt is deleted successfully');
      // getStaffReceipts();
    } catch (err) {
      console.error('Error deleting receipt:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const onConfirmDeleteReceipt = (receipt: StaffBillType) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteReceipt(receipt),
        },
      ],
    );
  }

  const onConfirmToSendEmail = () => {
    Alert.alert(
      'Send Email',
      'Are you sure you want to send email report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', style: 'default', onPress: onSendEmail },
      ],
    );
  }

  const onSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      if (dayjs(startDate).isSame(dayjs(endDate), 'day')) {
        await sendSalonStaffBillsToEmail(Number(staffId), startDate);
        Alert.alert('Email sent successfully');
      } else {
        Alert.alert('Please select the same date to send email!');
      }
    } catch (err) {
      console.error('Error sending email:', err);
    } finally {
      setIsSendingEmail(false);
    }
  }
  useEffect(() => {
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    let filter: SalonReceiptFilterInput = {
      staff: Number(staffId),
      created_at_range_after: startDate,
      created_at_range_before: endDate,
    };

    getSalonStaffBills(filter);

  }, [startDate, endDate, staffId])

  return (
    <View style={styles.container}>
      <TicketReportFilter
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        defaultStaff={salonStaffs?.find((staff) => staff?.id === Number(staffId))}
        onFilter={(startDate, endDate) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />
      {
        isSalonOwner() && (
          <ButtonIcon
            onPress={onConfirmToSendEmail}
            iconName='send-sharp'
            containerStyle={{ marginHorizontal: ms(4), width: ms(40), flex: 1, backgroundColor: '#ffffff' }}
            isLoading={isSendingEmail}
          />
        )
      }
      <FlatList
        data={salonStaffBills}
        renderItem={({ item }) =>
          <StaffBillItem
            staffBill={item}
            onDeletePress={() => onConfirmDeleteReceipt(item)}
          />
        }
        keyExtractor={(item) => item?.id?.toString() || ''}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No receipts found</Text>
          </View>
        }
      />
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

export default TicketReportScreen;