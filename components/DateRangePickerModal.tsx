import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker, { DateType, ModeType } from 'react-native-ui-datepicker';
import ButtonText from './commons/ButtonText';
import { formatDate } from '@/utils/receiptUtils';
import ButtonIcon from './commons/ButtonIcon';
import { commonStyles } from '@/utils/commonStyles';

interface DateRangePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (startDate: DateType, endDate: DateType) => void;
  onItemPress: () => void;
  defaultDate: DateType;
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({ isVisible, onClose, onConfirm, onItemPress, defaultDate }) => {

  const [startDateRange, setStartDateRange] = useState<DateType>(defaultDate);
  const [endDateRange, setEndDateRange] = useState<DateType>(defaultDate);


  const handleConfirm = () => {
    if (startDateRange && endDateRange) {
      onConfirm(startDateRange, endDateRange);
      onClose();
    }
  };

  const getButtonTitle = () => {
    return `${formatDate(startDateRange?.toString())} - ${formatDate(endDateRange?.toString())}`;
  }

  return (
    <View style={styles.container}>
      <ButtonIcon
        title={getButtonTitle()}
        onPress={onItemPress}
        iconName='calendar'
      />

      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <DateTimePicker
            mode="range"
            startDate={startDateRange}
            endDate={endDateRange}
            onChange={(date) => {
              setStartDateRange(date.startDate);
              setEndDateRange(date.endDate);
              // onChangeDateRange(startDate, endDate)
            }}
            selectedRangeBackgroundColor='#007AFF'
            selectedItemColor='#007AFF'
            displayFullDays={true}
          />
          <ButtonText
            title="Confirm"
            onPress={handleConfirm}
            style={commonStyles.confirmButton}
          />
          <ButtonText
            title="Close"
            onPress={onClose}
            style={commonStyles.confirmButton}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    marginHorizontal: 8,
  },
};

export default DateRangePickerModal;