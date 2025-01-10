import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Ionicons } from '@expo/vector-icons';
import { useSalonStaffStore } from '@/store/useSalonStaffStore';
import { SalonStaffState } from '../store/useSalonStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import SummaryCard from './SummaryCard';
import useStaffReceiptStore, { StaffReceiptStore } from '@/store/useStaffReceiptStore';
import { formatDate } from '@/utils/receiptUtils';
import dayjs from 'dayjs';
import { SalonReceiptFilterInput, StaffReceiptFilterInput } from '@/types/receipt.type';
import { useFocusEffect } from 'expo-router';
import ButtonIcon from './commons/ButtonIcon';
import { SalonState, useSalonStore } from '@/store/useSalonStore';

const ShowDateTimePickerType = {
  FROM: 'FROM',
  TO: 'TO'
}

// Interface for Filter values
interface FilterValues {
  date: Date | null;
  dateTime: Date | null;
  staff: SalonStaffType | null;
}

// Interface for Component Props
interface FilterComponentProps {
  onApplyFilters?: (filters: FilterValues) => void;
  staffList?: SalonStaffType[];
  containerStyle?: StyleProp<ViewStyle>;
  initialFilters?: Partial<FilterValues>;
}

const FilterBar: React.FC<FilterComponentProps> = ({
  onApplyFilters,
  staffList = [],
  containerStyle,
  initialFilters,
}) => {
  
  const {
    getSalonStaffs,
    salonStaffs,
    selectedSalon,
    staffBillsSummary
  } = useSalonStore((state: SalonState) => state);

  // const {
  //   staffBills,
  //   getStaffReceipts,
  //   staffBillsSummary
  // } = useStaffReceiptStore((state: StaffReceiptStore) => state);

  const {
    salonStaffBills,
    getSalonStaffBills
  } = useSalonStore((state:SalonState) => state);

  // State for filter values
  const [dateFilterFrom, setDateFilterFrom] = useState<string | null>(dayjs(new Date()).format('YYYY-MM-DD'));
  const [dateFilterTo, setDateFilterTo] = useState<string | null>(dayjs(new Date()).format('YYYY-MM-DD'));
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType | null>(initialFilters?.staff || null);

  // State for showing/hiding pickers
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [isShowSummary, setIsShowSummary] = useState<boolean>(false);

  // Handle staff selection
  const handleStaffSelect = (staff: SalonStaffType): void => {
    setSelectedStaff(staff);
    setShowStaffModal(false);
    // getStaffReceipts({staff: staff.id, created_at_from: dateFilter?.toString()});
  };




  useEffect(() => {

    let filter_input: SalonReceiptFilterInput = {
      staff: selectedStaff?.id,
      created_at_range_after: dateFilterFrom?.toString(),
      created_at_range_before: dateFilterTo?.toString()
    }

    getSalonStaffBills(filter_input);

  }, [selectedStaff, dateFilterFrom, dateFilterTo]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      clearFilters();
      // loadReceipts();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );

  // Clear all filters
  const clearFilters = (): void => {
    // setDateFilter(null);
    setSelectedStaff(null);
    setDateFilterFrom(null);
    setDateFilterTo(null);
  
  };

  const handleShowSummary = () => {
    setIsShowSummary(!isShowSummary);
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    if (showDateTimePickerType === ShowDateTimePickerType.FROM) {
      setDateFilterFrom(dayjs(date).format('YYYY-MM-DD'));
    } else {
      setDateFilterTo(dayjs(date).format('YYYY-MM-DD'));
    }
    console.warn("A date has been picked: ", date);
    hideDatePicker();
    // setDateFilter(date);
  };

  const [showDateTimePickerType, setShowDateTimePickerType] = useState<string>('');
  const handleShowDateTimePicker = (type: string) => {
    console.log('type:: ', type);

    showDatePicker()
    setShowDateTimePickerType(type);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Date Filter */}
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleShowDateTimePicker(ShowDateTimePickerType.FROM)}
            >
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              <Text style={styles.filterButtonText}>
                {dateFilterFrom ? dateFilterFrom : 'From'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => handleShowDateTimePicker(ShowDateTimePickerType.TO)}
            >
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              <Text style={styles.filterButtonText}>
                {dateFilterTo ? dateFilterTo : 'To'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Staff Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStaffModal(true)}
          >
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            {
              selectedStaff &&
              <Text style={styles.filterButtonText}>
                {selectedStaff.first_name}
              </Text>
            }
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignSelf: 'flex-end' }}>

        </View>
        <ButtonIcon
          iconName={isShowSummary ? 'chevron-up' : 'chevron-down'}
          onPress={handleShowSummary}
          containerStyle={{
            padding: 0,
            backgroundColor: '#fff',
          }}
        />
      </View>

      {/* Action Buttons */}
      {
        isShowSummary &&
        <SummaryCard
          totalAmount={staffBillsSummary?.total_amount || 0}
          totalTip={staffBillsSummary?.total_tip || 0}
          totalTurn={staffBillsSummary?.total_turn || 0}
          period="Today"
          onPeriodChange={() => { }}
        />

      }
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"

        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
        }}
      />


      {/* Staff Selection Modal */}
      <Modal
        visible={showStaffModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Staff</Text>
            <ScrollView>
              {salonStaffs?.map((staff) => (
                <TouchableOpacity
                  key={staff.id}
                  style={styles.staffItem}
                  onPress={() => handleStaffSelect(staff)}
                >
                  <Text style={styles.staffName}>{staff.first_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStaffModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  applyButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  staffItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  staffName: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
  },
});

export default FilterBar;