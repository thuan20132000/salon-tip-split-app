import { Colors } from '@/constants/Colors';
import { SalonStaffType } from '@/types/staff.types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { ms } from 'react-native-size-matters';

interface SelectStaffItemProps {
  staff: SalonStaffType;
  isSelected: boolean;
  onSelect: (staff: SalonStaffType) => void;
}

const SelectStaffItem: React.FC<SelectStaffItemProps> = ({
  staff,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onSelect(staff)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{staff.first_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: ms(100),
    backgroundColor: Colors.primary.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  tabletContainer: {
    // marginHorizontal: 24,
    // padding: 20,
  },
  selectedContainer: {
    backgroundColor: '#EBF5FF',
    borderColor: '#2196F3',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  roleText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  checkmark: {
    color: '#2196F3',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SelectStaffItem;
