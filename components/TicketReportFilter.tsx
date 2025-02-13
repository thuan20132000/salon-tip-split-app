import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateRangePickerModal from './DateRangePickerModal';
import SelectSalonStaffModal from './SelectSalonStaffModal';
import SummaryCard from './SummaryCard';
import { SalonState, useSalonStore } from '@/store/useSalonStore';
import dayjs from 'dayjs';
import { SalonStaffType } from '@/types/staff.types';
import { SalonReceiptFilterInput } from '@/types/receipt.type';
import useSalonSalaryReportStore, { SalonSalaryReportState } from '@/store/useSalonSalaryReportStore';
import ButtonIcon from './commons/ButtonIcon';
import { ms } from 'react-native-size-matters';

interface TicketReportFilterProps {
  onFilter?: (startDate: string, endDate: string) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultStaff?: SalonStaffType | null;
}

const TicketReportFilter: React.FC<TicketReportFilterProps> = ({ onFilter,
  defaultStartDate,
  defaultEndDate,
  defaultStaff
}) => {
  const [startDate, setStartDate] = useState(defaultStartDate || dayjs(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(defaultEndDate || dayjs(new Date()).format('YYYY-MM-DD'));
  const [isShowDateRangePicker, setIsShowDateRangePicker] = useState(false);
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType | null>(defaultStaff || null);
  const [isShowSummary, setIsShowSummary] = useState<boolean>(false);

  const {
    salonStaffs,
    getSalonStaffBills,
    staffBillsSummary
  } = useSalonStore((state: SalonState) => state);

  const toggleShowSummary = () => {
    setIsShowSummary(!isShowSummary);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flexDirection: 'row',
        }}
        horizontal
      >
        <DateRangePickerModal
          isVisible={isShowDateRangePicker}
          onClose={() => { setIsShowDateRangePicker(false) }}
          onConfirm={(startDate, endDate) => {
            let stDate = dayjs(startDate).format('YYYY-MM-DD');
            let edDate = dayjs(endDate).format('YYYY-MM-DD');

            setStartDate(stDate);
            setEndDate(edDate);
            if (stDate === edDate) {
              getSalonStaffBills({
                staff: selectedStaff?.id,
                created_at: dayjs(startDate).format('YYYY-MM-DD')
              })
            } else {
              getSalonStaffBills({
                staff: selectedStaff?.id,
                created_at_range_after: stDate,
                created_at_range_before: edDate
              })

            }
            setIsShowDateRangePicker(false);

          }}
          onItemPress={() => { setIsShowDateRangePicker(true) }}
          defaultDate={startDate}
        />

        <SelectSalonStaffModal
          isVisible={isShowSelectStaffModal}
          onClose={() => { setIsShowSelectStaffModal(false) }}
          staffList={salonStaffs}
          onSelectStaff={(staff) => {
            getSalonStaffBills({
              staff: staff.id,
              created_at_range_after: startDate?.toString(),
              created_at_range_before: endDate?.toString()
            })
            setSelectedStaff(staff)
            setIsShowSelectStaffModal(false)
          }}
          onItemPress={() => { setIsShowSelectStaffModal(true) }}
          selectedStaff={selectedStaff}
        />
        <ButtonIcon
          onPress={toggleShowSummary}
          iconName='pie-chart'
          containerStyle={{ marginLeft: ms(4) }}
          color={isShowSummary ? 'green' : 'black'}
        />
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TicketReportFilter;