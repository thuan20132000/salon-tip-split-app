import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  title?: string;
}

const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode = 'datetime',
  minimumDate,
  maximumDate,
  title = 'Select Date & Time',
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date:any) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    }}>
      <DateTimePickerModal
        isVisible={true}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}

        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: 16,
        
        }}
        
        display='default'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  nextButton: {
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default CustomDateTimePicker;

// Usage Example:
/*
import CustomDateTimePicker from './CustomDateTimePicker';

const MyComponent = () => {
  const [date, setDate] = useState(new Date());

  return (
    <CustomDateTimePicker
      value={date}
      onChange={setDate}
      mode="datetime"
      minimumDate={new Date()}
      title="Select Appointment Time"
    />
  );
};
*/