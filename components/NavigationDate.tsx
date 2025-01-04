import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface NavigationDateProps {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  dateFormat?: Intl.DateTimeFormatOptions;
  theme?: 'light' | 'dark';
}

const NavigationDate: React.FC<NavigationDateProps> = ({
  initialDate = new Date(),
  onDateChange,
  dateFormat = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  theme = 'light'
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

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
    onDateChange?.(newDate);
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
            size={20}
            color={textColor}
          />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <TouchableOpacity
            onPress={handleToday}
            style={[styles.todayButton, { backgroundColor: buttonColor }]}
          >
            <AntDesign
              name="calendar"
              size={20}
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
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navigationButton, { backgroundColor: buttonColor }]}
        >
          <AntDesign
            name="right"
            size={20}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  navigationButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    minWidth: 180,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
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