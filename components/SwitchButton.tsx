import React from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';

interface SwitchButtonProps {
  value: boolean | null;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SwitchButton = ({ value, onValueChange, disabled }: SwitchButtonProps) => {
  const translateX = React.useRef(new Animated.Value(value ? 28 : 2)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 28 : 2,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: value ? '#4CAF50' : '#ccc',
          opacity: disabled ? 0.6 : 1,
        },
      ]}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SwitchButton;