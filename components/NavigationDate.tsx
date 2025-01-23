import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ButtonIcon from './commons/ButtonIcon';
import { SalonStaffType } from '@/types/staff.types';
import SelectStaffModal from './SelectStaffModal';
import { SalonReceiptFilterInput } from '@/types/receipt.type';
import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { ms, s } from 'react-native-size-matters';

interface NavigationDateProps {
  initialDate?: Date;
  onFilterChange: (filter: SalonReceiptFilterInput) => void;
  dateFormat?: Intl.DateTimeFormatOptions;
  theme?: 'light' | 'dark';
}

const NavigationDate: React.FC<NavigationDateProps> = ({
  initialDate = new Date(),
  onFilterChange,
  dateFormat = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  theme = 'light',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedStaff, setSelectedStaff] = useState<SalonStaffType>();
  const [isShowSelectStaffModal, setIsShowSelectStaffModal] = useState(false);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    updateDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    updateDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    updateDate(today);
  };

  const updateDate = (newDate: Date) => {
    setCurrentDate(newDate);
    // onFilterChange?.(newDate);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, dateFormat);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const backgroundColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const buttonColor = isDark ? '#333333' : '#F5F5F5';
  const accentColor = '#007AFF';

  // useEffect(() => {
  //   let filter: SalonReceiptFilterInput = {
  //     created_at: dayjs(currentDate).format('YYYY-MM-DD'),
  //     staff: selectedStaff?.id
  //   }
  //   onFilterChange(filter);
  // }, [selectedStaff, currentDate])

   useFocusEffect(
      // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
      useCallback(() => {
        // Invoked whenever the route is focused.
        console.log('Hello, Im focused!');
  
        
        let filter: SalonReceiptFilterInput = {
          created_at: dayjs(currentDate).format('YYYY-MM-DD'),
          staff: selectedStaff?.id
        }
        
        onFilterChange(filter);
        // loadReceipts();
  
        // Return function is invoked whenever the route gets out of focus.
        return () => {
          console.log('This route is now unfocused.');
        };
      }, [selectedStaff, currentDate])
    );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[styles.navigationButton, { backgroundColor: buttonColor }]}
        >
          <AntDesign
            name="left"
            size={ms(10)}
            color={textColor}
          />
        </TouchableOpacity>

        <View style={[styles.dateContainer, { flexDirection: 'row', justifyContent: 'space-around' }]}>
          <TouchableOpacity
            style={[styles.todayButton, { backgroundColor: buttonColor }]}
            onPress={handleToday}
          >
            <AntDesign
              name="calendar"
              size={ms(14)}
              color={isToday(currentDate) ? accentColor : textColor}
            />
            <Text style={[
              styles.dateText,
              { color: textColor },
              isToday(currentDate) && styles.currentDateText
            ]}>
              {formatDate(currentDate)}
            </Text>
          </TouchableOpacity>
          <ButtonIcon
            iconName="people"
            title={selectedStaff?.first_name || 'Staff'}
            color={accentColor}
            size={ms(14)}
            onPress={() => { setIsShowSelectStaffModal(true) }}
            containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
          />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navigationButton, { backgroundColor: buttonColor }]}
        >
          <AntDesign
            name="right"
            size={ms(10)}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
      <SelectStaffModal
        visible={isShowSelectStaffModal}
        onSelect={(staff) => {
          setSelectedStaff(staff)
          setIsShowSelectStaffModal(false)
        }}
        onCancel={() => {
          setSelectedStaff(undefined)
          setIsShowSelectStaffModal(false)
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 4,
    //   },
    // }),
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: ms(4),
  },
  dateText: {
    fontSize: ms(10),
    marginLeft: 4,
    fontWeight: '500',
  },
  currentDateText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default NavigationDate;

// Usage Example:
/*
import NavigationDate from './NavigationDate';

const App = () => {
  const handleDateChange = (date: Date) => {
    console.log('Selected date:', date);
  };

  return (
    <NavigationDate
      onDateChange={handleDateChange}
      theme="light" // or "dark"
      dateFormat={{
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }}
    />
  );
};
*/