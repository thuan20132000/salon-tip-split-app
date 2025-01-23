// screens/ReceiptHistoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { formatCurrency, formatDate, formatDateTime, formatTime, groupReceiptsByDate, handleNumberToPercent } from './../utils/receiptUtils';
import { router, useFocusEffect } from 'expo-router';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType } from '@/types/receipt.type';
import { PaymentDiscountRateEnums } from '@/enums/PaymentEnums';
import Badge from '@/components/commons/Badge';
import { receiptAPIs } from '@/api/receiptAPI';
import ButtonIcon from '@/components/commons/ButtonIcon';
import NavigationDate from '@/components/NavigationDate';
import dayjs from 'dayjs';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import { SalonStaffType } from '@/types/staff.types';

export default function PendingPaymentReceipts() {
  // const {
  //   salonReceipts,
  //   getSalonPaymentReceipts
  // } = useSalonPaymentStore((state: SalonPaymentState) => state);
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType>();
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState(false);

  const {
    pendingPaymentReceipts,
    getSalonPendingPaymentReceipts
  } = useSalonStore((state: SalonState) => state);

  const onDeleteReceipt = async (receipt: SalonReceipt) => {
    try {
      await receiptAPIs.deleteSalonReceipt(Number(receipt.id));
      Alert.alert('Receipt deleted successfully');
      getSalonPendingPaymentReceipts({
        created_at: dayjs(new Date()).format('YYYY-MM-DD'),
      });
    } catch (err) {
      console.error('Error deleting receipt:', err);
    }
  }

  const onConfirmDeleteReceipt = (receipt: SalonReceipt) => {
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

  const showPaymentUpdateScreen = (receipt: SalonReceipt) => {
    router.push({
      pathname: '/(app)/(tabs)/(history)/payment-update',
      params: {
        payment_receipt: JSON.stringify(receipt),
      },
    });
  }

  const renderStaffBillItem = (staffReceipts?: StaffBillType[]) => {
    return staffReceipts?.map((staffItem, index) => (
      <View
        key={staffItem.id}
        style={{
          flexDirection: 'row',
          // justifyContent: 'space',
        }}
      >
        <Text key={index} style={styles.staffItem}>
          {staffItem.staff?.first_name} - {formatCurrency(Number(staffItem.service_amount))}
          {Number(staffItem.tip_amount) > 0 && ` (Tip: ${formatCurrency(Number(staffItem.tip_amount))})`}
        </Text>
        {
          Number(staffItem?.discount_price) > PaymentDiscountRateEnums.DISC_0_PERCENT &&
          <Badge
            text={handleNumberToPercent(Number(staffItem.discount_percent)) + ' OFF'}
            backgroundColor='#4CAF50'
          />

        }

      </View>
    ));
  }

  const renderReceiptItem = ({ item }: { item: SalonReceipt }) => {
    return (
      <View
        style={styles.receiptCard}
      >
        <View style={styles.receiptHeader}>
          <Text style={styles.receiptTime}>{formatDateTime(item.created_at?.toString())}</Text>
          <Badge
            text={item.payment_status?.toUpperCase()}
            backgroundColor='#4CAF50'
          />
        </View>
        <View >
          <View style={styles.receiptDetails}>
            <View style={styles.staffList}>
              {renderStaffBillItem(item.staff_receipts)}
            </View>

            <View style={styles.paymentDetails}>
              <Text style={styles.subtotalText}>
                Subtotal: {item.sub_total_amount}
              </Text>
              {/* <Text style={styles.subtotalText}>
                Gift Amount: {item.giftcardAmount)}
              </Text> */}
              <Text style={styles.tipText}>
                Tip: {item.tip_total_amount}
              </Text>
              <Text style={styles.totalText}>
                Total: {item?.payment_method_price}
              </Text>
              <Text style={styles.paymentMethod}>
                Paid via {item.payment_method?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <ButtonIcon
            iconName='trash'
            color="red"
            size={24}
            onPress={() => onConfirmDeleteReceipt(item)}
            containerStyle={{ padding: 0, backgroundColor: 'transparent', }}

          />

          <ButtonIcon
            iconName='create'
            color="#007AFF"
            size={24}
            onPress={() => showPaymentUpdateScreen(item)}
            containerStyle={{ padding: 0, backgroundColor: 'transparent', }}

          />
        </View>
      </View>
    );
  };


  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      let filter: SalonReceiptFilterInput = {
        created_at: dayjs(new Date()).format('YYYY-MM-DD'),
      };
      getSalonPendingPaymentReceipts(filter);

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={pendingPaymentReceipts}
        renderItem={renderReceiptItem}
        keyExtractor={(item, index) => `${item?.id?.toString()}-${index}` || ''}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No Pending receipts found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  receiptCard: {
    backgroundColor: 'white',
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
    // paddingBottom: 10,
  },
  receiptTime: {
    fontSize: 14,
    color: '#666',
  },
  receiptStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  receiptDetails: {
    gap: 10,
  },
  staffList: {
    gap: 5,
  },
  staffItem: {
    fontSize: 14,
    color: '#444',
  },
  paymentDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 5,
  },
  subtotalText: {
    fontSize: 14,
    color: '#666',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  deleteButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
});