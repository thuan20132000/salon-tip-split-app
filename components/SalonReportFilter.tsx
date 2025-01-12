import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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

interface SalonReportFilterProps {
  onFilter?: (startDate: string, endDate: string) => void;
}

const SalonReportFilter: React.FC<SalonReportFilterProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [isShowDateRangePicker, setIsShowDateRangePicker] = useState(false);
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType | null>();
  const [isShowSummary, setIsShowSummary] = useState<boolean>(false);

  const {
    salonStaffs,
  } = useSalonStore((state: SalonState) => state);
  const {
    getSalaryReport,
    summary,
  } = useSalonSalaryReportStore((state: SalonSalaryReportState) => state);

  const toggleShowSummary = () => {
    setIsShowSummary(!isShowSummary);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
        }}
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
              getSalaryReport({
                staff: selectedStaff?.id,
                created_at: dayjs(startDate).format('YYYY-MM-DD')
              })
            } else {
              getSalaryReport({
                staff: selectedStaff?.id,
                created_at_range_after: stDate,
                created_at_range_before: edDate
              })

            }
            setIsShowDateRangePicker(false);

          }}
          onItemPress={() => { setIsShowDateRangePicker(true) }}
          defaultDate={new Date()}
        />
        <SelectSalonStaffModal
          isVisible={isShowSelectStaffModal}
          onClose={() => { setIsShowSelectStaffModal(false) }}
          staffList={salonStaffs}
          onSelectStaff={(staff) => {
            console.log('selected staff:', staff);

            getSalaryReport({
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
          title={selectedStaff?.first_name || ''}
          onPress={toggleShowSummary}
          iconName='pie-chart'
          containerStyle={{ marginLeft: ms(4) }}
          color={isShowSummary ? 'green' : 'black'}
        />
      </View>

      {
        isShowSummary &&
        <SummaryCard
          totalAmount={summary?.total_service_amount || 0}
          totalTip={summary?.total_tip_amount || 0}
          totalTurn={summary?.total_turn || 0}
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

export default SalonReportFilter;