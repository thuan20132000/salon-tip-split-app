import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/receiptUtils';
import Modal from "react-native-modal";
import { SalonReceipt } from '@/types/receipt.type';


type ReceiptPrintModalProps = {
  visible: boolean;
  onClose: () => void;
  receiptData?: SalonReceipt;
};

const ReceiptPrintModal = ({ visible, onClose, receiptData }: ReceiptPrintModalProps) => {

  const generatePrintHTML = () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .date {
            color: #666;
            margin: 5px 0;
          }
          .services {
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            padding: 15px 0;
            margin: 15px 0;
          }
          .service-item {
            margin: 15px 0;
          }
          .service-name {
            font-size: 16px;
            margin-bottom: 5px;
          }
          .staff-id, .tip {
            font-size: 12px;
            color: #666;
            margin: 3px 0;
          }
          .summary {
            margin-top: 20px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total {
            border-top: 1px solid #eee;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Receipt</div>
          <div class="date">${formatDateTime(String(receiptData?.created_at))}</div>
          <div class="date">Pedi N Nails Hamilton by Nyny & Jona</div>
          <div class="date">Address: 65 Mall Rd, Hamilton, ON L8V 4V4</div>
        </div>

        <div class="services">
          ${receiptData?.staff_receipts?.map(item => `
            <div class="service-item">
              <div class="service-name">${item.service_name}</div>
              <div class="staff-id">Staff: ${item.staff?.first_name}</div>
              <div class="tip">Sale: ${formatCurrency(Number(item.service_amount))}</div>
              <div class="tip">Tip: ${formatCurrency(Number(item.tip_amount))}</div>
            </div>
          `).join('')}
        </div>

        <div class="summary">
          <div class="row">
            <span>Subtotal</span>
            <span>${formatCurrency(Number(receiptData?.sub_total_amount))}</span>
          </div>
          <div class="row">
            <span>Total Tip</span>
            <span>${formatCurrency(Number(receiptData?.tip_total_amount))}</span>
          </div>
          <div class="row total">
            <span>Total</span>
            <span>${formatCurrency(Number(receiptData?.total_amount))}</span>
          </div>
        </div>
      </body>
      </html>
      `;

  const handlePrint = async () => {
    const { uri } = await Print.printToFileAsync({ html: generatePrintHTML() });
    if (Platform.OS === 'ios') {
      await Print.printAsync({ uri });
    } else {
      await shareAsync(uri);
    }
  };


  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      style={{ margin: 0 }}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={handlePrint} style={styles.printButton}>

            <Text style={styles.printButtonText}>Print Receipt</Text>
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>Receipt</Text>
              <Text style={styles.date}>{formatDateTime(String(receiptData?.created_at))}</Text>
              <Text style={styles.date}>Pedi N Nails Hamilton by Nyny & Jona</Text>
              <Text style={styles.date}>Address: 65 Mall Rd, Hamilton, ON L8V 4V4</Text>
            </View>

            <View style={styles.services}>
              {receiptData?.staff_receipts?.map((item, index) => (
                <View key={index} style={styles.serviceItem}>
                  <View>
                    <Text style={styles.serviceName}>{item.service_name}</Text>
                    <Text style={styles.staffId}>Staff: {item.staff?.first_name}</Text>
                    <Text style={styles.tip}>Sale: {formatCurrency(Number(item.service_amount))}</Text>
                    <Text style={styles.tip}>Tip: {formatCurrency(Number(item.tip_amount))}</Text>
                  </View>
                  {/* <Text style={styles.amount}>{formatCurrency(item.service_amount)}</Text> */}
                </View>
              ))}
            </View>

            <View style={styles.summary}>
              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text>{formatCurrency(Number(receiptData?.sub_total_amount))}</Text>
              </View>
              <View style={styles.row}>
                <Text>Total Tip</Text>
                <Text>{formatCurrency(Number(receiptData?.tip_total_amount))}</Text>
              </View>
              <View style={[styles.row, styles.total]}>
                <Text style={styles.bold}>Total</Text>
                <Text style={styles.bold}>{formatCurrency(Number(receiptData?.total_amount))}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  scrollView: {
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    marginTop: 5,
  },
  services: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  serviceName: {
    fontSize: 16,
  },
  staffId: {
    fontSize: 12,
    color: '#666',
  },
  tip: {
    fontSize: 12,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
  },
  summary: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  total: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  printButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  printButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ReceiptPrintModal;