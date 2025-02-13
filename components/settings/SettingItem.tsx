import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';

interface SettingItemProps {
  label: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={{ fontSize: ms(8), fontWeight: 'bold' }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minWidth: ms(100),
    height: ms(50),
    borderRadius: 12,
    // Adding shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Adding shadow for Android
    elevation: 3,
    // Adding margin to make shadow visible
    margin: 4,
  },
  // ... existing code ...
});

