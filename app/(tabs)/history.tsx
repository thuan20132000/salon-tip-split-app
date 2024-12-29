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
} from 'react-native';
import { Receipt, GroupedReceipts } from '../../types/receipt';
import { formatCurrency, formatTime, groupReceiptsByDate } from '../../utils/receiptUtils';
import { FirestoreService } from '@/services/firestore.service';
import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import { PaymentReceiptType } from '@/store/usePaymentStore';

export default function ReceiptHistoryScreen() {
  const [receipts, setReceipts] = useState<GroupedReceipts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log('Hello, Im focused!');
      loadReceipts();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const fetchedReceipts = await FirestoreService.getDocuments<Receipt>('payments');
      const groupedReceipts = groupReceiptsByDate(fetchedReceipts);

      // sort ascending
      groupedReceipts.sort((a, b) => b.data[0].createdAt.seconds - a.data[0].createdAt.seconds);


      setReceipts(groupedReceipts);
      setError(null);
    } catch (err) {
      setError('Failed to load receipts');
      console.error('Error loading receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const showReceiptDetail = (receipt: PaymentReceiptType) => {

    console.log('====================================');
    console.log('Receipt Detail:', receipt);
    console.log('====================================');

    // Handle receipt detail navigation
    router.push({
      pathname: '/payment',
      params: {
        staff_ids: JSON.stringify(receipt.staffs?.map((staff) => staff.staff.id)),
        payment_receipt: JSON.stringify(receipt),
      },
    });
  }

  const onDeleteReceipt = async (receipt: Receipt) => {
    try {
      await FirestoreService.deleteDocument('payments', receipt.id);
      loadReceipts();
    } catch (err) {
      console.error('Error deleting receipt:', err);
    }
  }

  const onConfirmDeleteReceipt = (receipt: Receipt) => {
    console.log('====================================');
    console.log('Delete receipt:', receipt);
    console.log('================================');
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

  const renderReceiptItem = ({ item }: { item: Receipt }) => {
    return (
      <View
        style={styles.receiptCard}
      >


        <View style={styles.receiptHeader}>
          <Text style={styles.receiptTime}>{formatTime(item.createdAt)}</Text>
          <Text style={styles.receiptStatus}>{item.status.toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onConfirmDeleteReceipt(item)}
          >
            <Text style={styles.paymentMethod}>
              Delete?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          // style={styles.receiptCard}
          onPress={() => showReceiptDetail(item)}
        >
          <View style={styles.receiptDetails}>
            <View style={styles.staffList}>
              {item.staffs?.map((staffItem, index) => (
                <Text key={index} style={styles.staffItem}>
                  {staffItem.staff.name} - {formatCurrency(staffItem.price)}
                  {staffItem.tip > 0 && ` (Tip: ${formatCurrency(staffItem.tip)})`}
                </Text>
              ))}
            </View>

            <View style={styles.paymentDetails}>
              <Text style={styles.subtotalText}>
                Subtotal: {formatCurrency(item.subtotal)}
              </Text>
              <Text style={styles.subtotalText}>
                Gift Amount: {formatCurrency(item.giftcardAmount)}
              </Text>
              <Text style={styles.tipText}>
                Tip: {formatCurrency(item.tip)}
              </Text>
              <Text style={styles.totalText}>
                Total: {formatCurrency(item?.selectedPayment?.price)}
              </Text>
              <Text style={styles.paymentMethod}>
                Paid via {item.selectedPayment?.method.toUpperCase()}
              </Text>
              <Text style={styles.paymentMethod}>
                Updated at {formatTime(item.updatedAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadReceipts}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={receipts}
        keyExtractor={(item) => item.id}
        renderItem={renderReceiptItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
      // inverted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
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